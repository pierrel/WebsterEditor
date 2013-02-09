//
//  WEDialogViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEDialogViewController.h"
#import "WEPageManager.h"

@interface WEDialogViewController ()
@property (strong, nonatomic) NSArray *dataSource;
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
    // positional
    CGFloat dialogWidth = 100;
    CGFloat dialogHeight = 50;
    CGFloat x = [[data valueForKey:@"left"] floatValue] + ([[data valueForKey:@"width"] floatValue]/2) - (dialogWidth/2);
    CGFloat y = [[data valueForKey:@"top"] floatValue] + [[data valueForKey:@"height"] floatValue];
    CGRect viewR = CGRectMake(x,
                              y,
                              dialogWidth,
                              dialogHeight);
    
    // content
    self.tag = [data valueForKey:@"tag"];
    if ([self.tag isEqualToString:@"H1"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Up", @"Edit", @"Remove", nil];
    }
    self.classes = [data valueForKey:@"classes"];
    if ([self.classes containsObject:@"container-fluid"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Remove", nil];
    }

    // reload
    [self.tableView reloadData];
    
    // render
    [self.view setFrame:viewR];
    [self.view setHidden:NO];
}

// Data source stuff
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}
-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return self.dataSource.count;
}
-(UITableViewCell *)tableView:(UITableView *)tableView
        cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] init];
    }
    
    [cell.textLabel setText:[self.dataSource objectAtIndex:indexPath.row]];
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    NSString *item = (NSString*)[self.dataSource objectAtIndex:indexPath.row];
    WEPageManager *pageManager = [WEPageManager sharedManager];
    if ([item isEqualToString:@"Remove"])
        [pageManager removeSelectedElement];
    else if ([item isEqualToString:@"Edit"])
        [pageManager editSelectedElement];

    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    [self close];
}

-(void)close {
    [UIView animateWithDuration:0.2 animations:^{
        [self.view setAlpha:0];
    } completion:^(BOOL finished) {
        if (finished) {
            [self.view setHidden:YES];
            [self.view setAlpha:1];
        }
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
