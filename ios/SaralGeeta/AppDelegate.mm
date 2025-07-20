#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"SaralGeeta";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Google Sign-In configuration
  NSString *path = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info" ofType:@"plist"];
  NSDictionary *plist = [NSDictionary dictionaryWithContentsOfFile:path];
  if (plist[@"CLIENT_ID"]) {
    [GIDSignIn.sharedInstance configureWithConfiguration:[[GIDConfiguration alloc] initWithClientID:plist[@"CLIENT_ID"]]];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Handle Google Sign-In URL
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }
  // Add other custom URL handling if needed
  return NO;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
