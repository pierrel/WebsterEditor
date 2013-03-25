//
//  WEDialogViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "NSArray+WEExtras.h"
#import "WEDialogViewController.h"
#import "WEPageManager.h"
#import "WEUtils.h"

@interface WEDialogViewController ()
@property (assign, nonatomic) BOOL tableViewAdded;
@end

@implementation WEDialogViewController
@synthesize popover;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.tableViewAdded = NO;
        self.tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, 200, 300)
                                                      style:UITableViewStylePlain];
        self.tableView.delegate = self;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)openWithData:(id)data inView:(UIView*)inView {
    if (!self.tableViewAdded) {
        [self.view addSubview:self.tableView];
        self.tableViewAdded = YES;
    }
    
    if (!popover) {
        self.popover = [[UIPopoverController alloc] initWithContentViewController:self];
        [popover setPopoverContentSize:CGSizeMake(200, 300)];
        popover.delegate = self;
    }
    
    // reload
//    [self.tableView reloadData];
    
    // render
    [popover presentPopoverFromRect:[WEUtils frameFromData:data]
                             inView:inView
           permittedArrowDirections:UIPopoverArrowDirectionAny
                           animated:YES];
}


-(void)close {
//    [popover dismissPopoverAnimated:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
