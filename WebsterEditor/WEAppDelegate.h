//
//  WEAppDelegate.h
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEEditorViewController.h"
#import "WEProjectsViewController.h"

@class WEWebViewController;

@interface WEAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) WEProjectsViewController *viewController;

@end
