//
//  WEAppDelegate.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEAppDelegate.h"
#import "WEViewController.h"
#import "WEUtils.h"

@interface WEAppDelegate ()
-(void)createDirectories;
@end

@implementation WEAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    // Override point for customization after application launch.
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        self.viewController = [[WEViewController alloc] initWithNibName:@"WEViewController_iPhone" bundle:nil];
    } else {
        self.viewController = [[WEViewController alloc] initWithNibName:@"WEViewController_iPad" bundle:nil];
    }
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    [self createDirectories];
    return YES;
}

-(void)createDirectories {
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *media = [WEUtils pathInDocumentDirectory:@"/media"];
    NSString *css = [WEUtils pathInDocumentDirectory:@"/css"];
    NSString *js = [WEUtils pathInDocumentDirectory:@"/js"];
    NSError *error;
    
    if (![manager fileExistsAtPath:media]) [manager createDirectoryAtPath:media
                                              withIntermediateDirectories:NO
                                                               attributes:nil
                                                                    error:&error];
    
    if (![manager fileExistsAtPath:css]) [manager createDirectoryAtPath:css
                                            withIntermediateDirectories:NO
                                                             attributes:nil
                                                                  error:&error];
    
    if (![manager fileExistsAtPath:js]) [manager createDirectoryAtPath:js
                                           withIntermediateDirectories:NO
                                                            attributes:nil
                                                                 error:&error];
}

- (void)applicationWillResignActive:(UIApplication *)application
{
  // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
  // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
  // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
