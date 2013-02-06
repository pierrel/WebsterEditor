//
//  WEDialogViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEDialogViewController.h"

@interface WEDialogViewController ()

@end

@implementation WEDialogViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.view setHidden:YES];
}

- (void)openWithData:(id)data andConstraints:(CGRect)constraints {
    CGFloat dialogWidth = 100;
    CGFloat dialogHeight = 50;
    CGFloat x = [[data valueForKey:@"left"] floatValue] + ([[data valueForKey:@"width"] floatValue]/2) - (dialogWidth/2);
    CGFloat y = [[data valueForKey:@"top"] floatValue] + [[data valueForKey:@"height"] floatValue];
    CGRect viewR = CGRectMake(x,
                              y,
                              dialogWidth,
                              dialogHeight);
    [self.view setFrame:viewR];
    [self.view setHidden:NO];
}

// Data source stuff
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}
-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return 1;
}
-(UITableViewCell *)tableView:(UITableView *)tableView
        cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] init];
    }
    
    [cell.textLabel setText:@"remove"];
    
    return cell;
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
