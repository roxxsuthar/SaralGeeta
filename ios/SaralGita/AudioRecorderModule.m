#import "AudioRecorderModule.h"
#import <AVFoundation/AVFoundation.h>

@interface AudioRecorderModule ()
@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, strong) AVAudioSession *audioSession;
@property (nonatomic, strong) NSString *recordingPath;
// Commentary playback
@property (nonatomic, strong) AVPlayer *audioPlayer;
@property (nonatomic, assign) BOOL isObservingStatus;
// Promise callbacks
@property (nonatomic, copy) RCTPromiseResolveBlock pendingResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock pendingReject;
@end

@implementation AudioRecorderModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"recordingProgress", @"audioPlaybackFinished"];
}

// Required by New Architecture so events are actually delivered to JS.
- (void)startObserving {}
- (void)stopObserving {}

// ─── Player cleanup ───────────────────────────────────────────────────────────

- (void)cleanupPlayer
{
  if (self.audioPlayer) {
    [self.audioPlayer pause];

    if (self.isObservingStatus && self.audioPlayer.currentItem) {
      @try {
        [self.audioPlayer.currentItem removeObserver:self forKeyPath:@"status"];
      } @catch (NSException *e) {
        NSLog(@"[AudioRecorderModule] KVO remove exception (safe to ignore): %@", e.reason);
      }
      self.isObservingStatus = NO;
    }

    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:AVPlayerItemDidPlayToEndTimeNotification
                                                  object:self.audioPlayer.currentItem];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:AVPlayerItemFailedToPlayToEndTimeNotification
                                                  object:self.audioPlayer.currentItem];
    self.audioPlayer = nil;
  }
  self.pendingResolve = nil;
  self.pendingReject = nil;
}

// ─── Audio session helpers ────────────────────────────────────────────────────

// Take exclusive Playback ownership of AVAudioSession so react-native-video
// cannot duck or interfere with commentary audio.
// We do NOT use MixWithOthers here — we want EXCLUSIVE control while playing.
- (BOOL)activateAudioSession
{
  NSError *error = nil;
  AVAudioSession *session = [AVAudioSession sharedInstance];

  // Set category first (must be done before setActive).
  [session setCategory:AVAudioSessionCategoryPlayback
           withOptions:0   // No MixWithOthers — take exclusive control
                 error:&error];
  if (error) {
    NSLog(@"[AudioRecorderModule] setCategory error: %@", error);
    error = nil;
  }

  [session setMode:AVAudioSessionModeDefault error:&error];
  if (error) {
    NSLog(@"[AudioRecorderModule] setMode error: %@", error);
    error = nil;
  }

  // Notify others (react-native-video) so they release the route before we activate.
  [session setActive:NO withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation error:&error];
  error = nil;

  BOOL ok = [session setActive:YES error:&error];
  NSLog(@"[AudioRecorderModule] activateAudioSession success=%d error=%@", ok, error);
  return ok;
}

// After commentary, hand the session back so react-native-video can resume.
- (void)deactivateAudioSession
{
  NSError *error = nil;
  [[AVAudioSession sharedInstance] setActive:NO
                                 withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation
                                       error:&error];
  if (error) NSLog(@"[AudioRecorderModule] deactivateAudioSession error: %@", error);
}

// ─── playAudio ────────────────────────────────────────────────────────────────

RCT_EXPORT_METHOD(playAudio:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSLog(@"[AudioRecorderModule] playAudio called with URL: %@", url);

  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      // 1. Stop any previous playback.
      [self cleanupPlayer];

      // 2. Build the URL.
      NSURL *audioURL = [NSURL URLWithString:url];
      if (!audioURL) {
        NSString *encoded = [url stringByAddingPercentEncodingWithAllowedCharacters:
                              [NSCharacterSet URLQueryAllowedCharacterSet]];
        audioURL = [NSURL URLWithString:encoded];
      }
      if (!audioURL) {
        NSLog(@"[AudioRecorderModule] ERROR: Invalid URL: %@", url);
        reject(@"invalid_url", @"Invalid audio URL", nil);
        return;
      }

      // 3. Activate our audio session (exclusive Playback, interrupts RNVideo).
      [self activateAudioSession];

      // 4. Create AVPlayer.
      AVPlayerItem *item = [AVPlayerItem playerItemWithURL:audioURL];
      self.audioPlayer = [AVPlayer playerWithPlayerItem:item];
      self.audioPlayer.volume = 1.0;
      self.audioPlayer.automaticallyWaitsToMinimizeStalling = YES;

      // 5. Store promise (resolved when ReadyToPlay fires).
      self.pendingResolve = resolve;
      self.pendingReject = reject;

      // 6. KVO for item status.
      [item addObserver:self
             forKeyPath:@"status"
                options:NSKeyValueObservingOptionNew
                context:nil];
      self.isObservingStatus = YES;

      // 7. Notification for end-of-playback.
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(audioPlayerDidFinish:)
                                                   name:AVPlayerItemDidPlayToEndTimeNotification
                                                 object:item];
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(audioPlayerDidFail:)
                                                   name:AVPlayerItemFailedToPlayToEndTimeNotification
                                                 object:item];

      // 8. Start playback.
      [self.audioPlayer play];
      NSLog(@"[AudioRecorderModule] play called — rate=%f, itemStatus=%ld",
            self.audioPlayer.rate, (long)item.status);

    } @catch (NSException *exception) {
      NSLog(@"[AudioRecorderModule] EXCEPTION in playAudio: %@", exception.reason);
      reject(@"play_error", exception.reason, nil);
    }
  });
}

// ─── KVO ─────────────────────────────────────────────────────────────────────

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey,id> *)change
                       context:(void *)context
{
  if (![keyPath isEqualToString:@"status"]) return;

  AVPlayerItem *item = (AVPlayerItem *)object;
  dispatch_async(dispatch_get_main_queue(), ^{
    switch (item.status) {
      case AVPlayerItemStatusReadyToPlay:
        NSLog(@"[AudioRecorderModule] AVPlayerItem READY — duration=%.1fs",
              CMTimeGetSeconds(item.duration));
        // Kick-start if rate dropped during buffering.
        if (self.audioPlayer && self.audioPlayer.rate == 0) {
          [self.audioPlayer play];
        }
        if (self.pendingResolve) {
          self.pendingResolve(@YES);
          self.pendingResolve = nil;
          self.pendingReject = nil;
        }
        break;

      case AVPlayerItemStatusFailed:
        NSLog(@"[AudioRecorderModule] AVPlayerItem FAILED: %@", item.error);
        if (self.pendingReject) {
          self.pendingReject(@"play_failed",
                             item.error.localizedDescription ?: @"AVPlayer item failed",
                             item.error);
          self.pendingResolve = nil;
          self.pendingReject = nil;
        }
        [self sendEventWithName:@"audioPlaybackFinished"
                           body:@{@"error": item.error.localizedDescription ?: @"unknown"}];
        [self cleanupPlayer];
        [self deactivateAudioSession];
        break;

      case AVPlayerItemStatusUnknown:
        NSLog(@"[AudioRecorderModule] AVPlayerItem status UNKNOWN (buffering…)");
        break;
    }
  });
}

// ─── Playback finished ────────────────────────────────────────────────────────

- (void)audioPlayerDidFinish:(NSNotification *)notification
{
  NSLog(@"[AudioRecorderModule] Audio playback FINISHED");
  dispatch_async(dispatch_get_main_queue(), ^{
    [self cleanupPlayer];
    // Release exclusive session so react-native-video can re-take it for shlok video.
    [self deactivateAudioSession];
    // Signal JS to unpause the shlok video.
    [self sendEventWithName:@"audioPlaybackFinished" body:@{}];
  });
}

- (void)audioPlayerDidFail:(NSNotification *)notification
{
  NSLog(@"[AudioRecorderModule] Audio playback FAILED: %@", notification.userInfo);
  dispatch_async(dispatch_get_main_queue(), ^{
    [self cleanupPlayer];
    [self deactivateAudioSession];
    [self sendEventWithName:@"audioPlaybackFinished" body:@{@"error": @"playback_failed"}];
  });
}

- (void)dealloc
{
  [self cleanupPlayer];
}

// ─── stopAudio ────────────────────────────────────────────────────────────────

RCT_EXPORT_METHOD(stopAudio:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSLog(@"[AudioRecorderModule] stopAudio called");
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [self cleanupPlayer];
      [self deactivateAudioSession];
      resolve(@YES);
    } @catch (NSException *exception) {
      reject(@"stop_error", exception.reason, nil);
    }
  });
}

// ─── Recording ───────────────────────────────────────────────────────────────

RCT_EXPORT_METHOD(prepareRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      self.audioSession = [AVAudioSession sharedInstance];
      NSError *error = nil;

      [self.audioSession setCategory:AVAudioSessionCategoryPlayAndRecord
                         withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker |
                                     AVAudioSessionCategoryOptionAllowBluetooth |
                                     AVAudioSessionCategoryOptionMixWithOthers
                               error:&error];
      if (error) { reject(@"audio_session_error", @"Failed to set category", error); return; }

      [self.audioSession setMode:AVAudioSessionModeVideoRecording error:&error];
      if (error) { reject(@"audio_session_error", @"Failed to set mode", error); return; }

      [self.audioSession setActive:YES error:&error];
      if (error) { reject(@"audio_session_error", @"Failed to activate", error); return; }

      resolve(@YES);
    } @catch (NSException *exception) {
      reject(@"prepare_error", exception.reason, nil);
    }
  });
}

RCT_EXPORT_METHOD(startRecording:(NSString *)fileName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      self.audioSession = [AVAudioSession sharedInstance];
      NSError *error = nil;

      [self.audioSession setCategory:AVAudioSessionCategoryPlayAndRecord
                         withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker |
                                     AVAudioSessionCategoryOptionAllowBluetooth |
                                     AVAudioSessionCategoryOptionMixWithOthers
                               error:&error];
      if (error) NSLog(@"[AudioRecorder] Category Error: %@", error);
      [self.audioSession setMode:AVAudioSessionModeVideoRecording error:&error];
      if (error) NSLog(@"[AudioRecorder] Mode Error: %@", error);
      [self.audioSession setActive:YES error:&error];
      if (error) NSLog(@"[AudioRecorder] Activation Error: %@", error);

      NSString *cachesDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
      self.recordingPath = [cachesDirectory stringByAppendingPathComponent:fileName];
      NSURL *audioURL = [NSURL fileURLWithPath:self.recordingPath];

      NSDictionary *settings = @{
        AVFormatIDKey: @(kAudioFormatMPEG4AAC),
        AVSampleRateKey: @44100.0,
        AVNumberOfChannelsKey: @1,
        AVEncoderAudioQualityKey: @(AVAudioQualityHigh),
        AVEncoderBitRateKey: @128000
      };

      self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:audioURL settings:settings error:&error];
      if (error) { reject(@"recorder_init_error", error.localizedDescription, error); return; }

      self.audioRecorder.meteringEnabled = YES;

      BOOL success = [self.audioRecorder prepareToRecord];
      if (!success) { reject(@"prepare_error", @"Failed to prepare recorder", nil); return; }

      success = [self.audioRecorder record];
      if (!success) { reject(@"record_error", @"Failed to start recording", nil); return; }

      resolve(self.recordingPath);
    } @catch (NSException *exception) {
      reject(@"start_error", exception.reason, nil);
    }
  });
}

RCT_EXPORT_METHOD(stopRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      if (!self.audioRecorder || !self.audioRecorder.isRecording) {
        if (self.recordingPath) { resolve(self.recordingPath); return; }
        reject(@"not_recording", @"No active recording", nil);
        return;
      }

      [self.audioRecorder stop];

      // Restore audio session to Playback so video plays through speaker.
      NSError *restoreError = nil;
      [self.audioSession setCategory:AVAudioSessionCategoryPlayback
                         withOptions:AVAudioSessionCategoryOptionMixWithOthers
                               error:&restoreError];
      if (restoreError) NSLog(@"[AudioRecorder] Restore category error: %@", restoreError);
      [self.audioSession setMode:AVAudioSessionModeDefault error:&restoreError];
      [self.audioSession setActive:YES error:&restoreError];

      NSFileManager *fileManager = [NSFileManager defaultManager];
      if (![fileManager fileExistsAtPath:self.recordingPath]) {
        reject(@"file_not_found", @"Recording file not found", nil);
        return;
      }

      resolve(self.recordingPath);
    } @catch (NSException *exception) {
      reject(@"stop_error", exception.reason, nil);
    }
  });
}

@end
