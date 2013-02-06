//
//  WEDialogViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEDialogViewController : UIViewController<UITableViewDelegate,UITableViewDataSource>
@property (strong, atomic) IBOutlet UITableView *tableView;

-(void)openWithData:(id)data andConstraints:(CGRect)constraints;
-(void)close;
@end
