//
//  WEDialogViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEDialogViewController : UIViewController<UITableViewDelegate,UITableViewDataSource,UIPopoverControllerDelegate>
@property (strong, nonatomic) IBOutlet UITableView *tableView;

@property (strong, nonatomic) UIPopoverController *popover;
@property (strong, atomic) NSArray *classes;
@property (strong, atomic) NSString *tag;

- (void)openWithData:(id)data inView:(UIView*)inView;
-(void)close;
@end
