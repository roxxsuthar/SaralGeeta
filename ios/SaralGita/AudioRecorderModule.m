#import "AudioRecorderModule.h"
#import <AVFoundation/AVFoundation.h>

@interface AudioRecorderModule ()
@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, strong) AVAudioSession *audioSession;
@property (nonatomic, strong) NSString *recordingPath;
@end

@implementation AudioRecorderModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"recordingProgress"];
}

RCT_EXPORT_METHOD(prepareRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      // Configure audio session for recording while playing video
      self.audioSession = [AVAudioSession sharedInstance];
      NSError *error = nil;
      
      // Set category to PlayAndRecord with options
      [self.audioSession setCategory:AVAudioSessionCategoryPlayAndRecord
                         withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker |
                                    AVAudioSessionCategoryOptionAllowBluetooth |
                                    AVAudioSessionCategoryOptionMixWithOthers
                               error:&error];
      
      if (error) {
        reject(@"audio_session_error", @"Failed to set category", error);
        return;
      }
      
      // Set mode for better quality
      [self.audioSession setMode:AVAudioSessionModeVideoRecording error:&error];
      
      if (error) {
        reject(@"audio_session_error", @"Failed to set mode", error);
        return;
      }
      
      // Activate session
      [self.audioSession setActive:YES error:&error];
      
      if (error) {
        reject(@"audio_session_error", @"Failed to activate", error);
        return;
      }
      
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
      // 1. Configure Session (Atomic: Ensure active right before recording)
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

      // 2. Create file path
      NSString *cachesDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
      self.recordingPath = [cachesDirectory stringByAppendingPathComponent:fileName];
      NSURL *audioURL = [NSURL fileURLWithPath:self.recordingPath];
      
      NSLog(@"[AudioRecorder] Path: %@", self.recordingPath);

      // 3. Audio settings - Switch to MONO (1 Channel) for reliability
      NSDictionary *settings = @{
        AVFormatIDKey: @(kAudioFormatMPEG4AAC),
        AVSampleRateKey: @44100.0,
        AVNumberOfChannelsKey: @1, 
        AVEncoderAudioQualityKey: @(AVAudioQualityHigh),
        AVEncoderBitRateKey: @128000
      };
      
      self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:audioURL
                                                        settings:settings
                                                           error:&error];
      
      if (error) {
        reject(@"recorder_init_error", error.localizedDescription, error);
        return;
      }
      
      self.audioRecorder.meteringEnabled = YES;
      
      BOOL success = [self.audioRecorder prepareToRecord];
      if (!success) {
        NSLog(@"[AudioRecorder] prepareToRecord returned NO");
        reject(@"prepare_error", @"Failed to prepare recorder (System rejected settings or path)", nil);
        return;
      }
      
      success = [self.audioRecorder record];
      if (!success) {
        reject(@"record_error", @"Failed to start recording", nil);
        return;
      }
      
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
        // Fallback if state is inconsistent, but if path exists return it
        if (self.recordingPath) {
             resolve(self.recordingPath);
             return;
        }
        reject(@"not_recording", @"No active recording", nil);
        return;
      }
      
      [self.audioRecorder stop];
      
      // Check if file exists
      NSFileManager *fileManager = [NSFileManager defaultManager];
      if (![fileManager fileExistsAtPath:self.recordingPath]) {
        reject(@"file_not_found", @"Recording file not found", nil);
        return;
      }
      
      // Return path directly to match expected interface or object
      resolve(self.recordingPath);
      
    } @catch (NSException *exception) {
      reject(@"stop_error", exception.reason, nil);
    }
  });
}
@end
