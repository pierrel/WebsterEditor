//
//  WEDialogViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEDialogViewController : UIViewController<UITableViewDelegate,UITableViewDataSource,UIPopoverControllerDelegate>
@property (strong, nonatomic) UITableView *tableView;

@property (strong, nonatomic) UIPopoverController *popover;
- (void)openWithData:(id)data inView:(UIView*)inView;
-(void)close;
@end
