//
//  WEAppDelegate.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEAppDelegate.h"
#import "WEUtils.h"
#import "UIColor+Expanded.h"
#import "WEProjectCollectionViewLayout.h"
#import "WES3Manager.h"

@interface WEAppDelegate ()
-(void)createDirectories;
@end

@implementation WEAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [self createDirectories];
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    [self.window setTintColor:[UIColor colorWithHexString:@"#64D90A"]];
    
    // Override point for customization after application launch.
//    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
//        self.viewController = [[WEViewController alloc] initWithNibName:@"WEViewController_iPhone" bundle:nil];
//    } else {
//        WEViewController *viewController = [[WEViewController alloc] initWithNibName:@"WEViewController" bundle:nil];        
//        self.viewController = viewController;
//    }
//    WEViewController *viewController = [[WEViewController alloc] initWithNibName:@"WEViewController" bundle:nil];
//    self.viewController = viewController;
    WEProjectCollectionViewLayout *layout = [[WEProjectCollectionViewLayout alloc] init];
    WEProjectsViewController *viewController = [[WEProjectsViewController alloc] initWithCollectionViewLayout:layout];
    self.viewController = viewController;
    
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    NSString *bucketname = @"pierreshasdasdowthiasdngsinthisbucket5";
    [[[WES3Manager sharedManager] prepareBucketNamed:bucketname] continueWithBlock:^id(BFTask *task) {
        if (task.error) {
            NSLog(@"Problem preparing bucket %@: %@", bucketname, task.error);
        } else if (task.completed) {
            NSLog(@"successfully prepared bucket");
        } else {
            NSLog(@"Problem preparing bucket %@", bucketname);
        }
        
        return nil;
    }];
    
    return YES;
}

-(NSArray*)testPages {
    return @[@"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/index_prod.html"];
}

-(NSArray*)testLibs {
    return @[@"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/js/jquery-1.9.0.min.js",
                @"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/js/bootstrap.min.js",
                @"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/js/bootstrap-lightbox.js",
                @"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/css/override.css",
                @"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/css/bootstrap.min.css",
             @"/Users/pierrelarochelle/Library/Developer/CoreSimulator/Devices/DD3D7A2D-E81E-4D49-864F-239202FC3AF7/data/Containers/Data/Application/EDFD7294-CBEA-47D4-A0DC-300F7091F554/Documents/projects/D1D97CA3-178D-44C5-8033-1DAF7389501D/css/bootstrap-responsive.min.css"];
}

-(NSArray*)testMedia {
    return @[];
}

-(void)createDirectories {
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *projects = [WEUtils pathInDocumentDirectory:@"/projects"];
    NSError *error;
    
    if (![manager fileExistsAtPath:projects])
        [manager createDirectoryAtPath:projects
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
    [[NSNotificationCenter defaultCenter] postNotificationName:@"appClosing" object:self];
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
    [[NSNotificationCenter defaultCenter] postNotificationName:@"appClosing" object:self];
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
