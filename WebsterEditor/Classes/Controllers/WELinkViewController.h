//
//  WELinkViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 7/13/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@class WELinkViewController;

@protocol WELinkViewControllerDelegate<NSObject>
-(void)linkViewController:(WELinkViewController*)viewController setSelectedTextURL:(NSString*)url;
@end

@interface WELinkViewController : UITableViewController<UITextFieldDelegate>
@property (nonatomic, assign) id<WELinkViewControllerDelegate>delegate;
@end