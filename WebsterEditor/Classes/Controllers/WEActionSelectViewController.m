//
//  WESelecrtionActionViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/25/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEActionSelectViewController.h"
#import "NSArray+WEExtras.h"
#import "WEPageManager.h"

@interface WEActionSelectViewController ()
@property (strong, nonatomic) NSArray *dataSource;
@end

@implementation WEActionSelectViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Setup data source
-(void) setData:(id)data {
    self.dataSource = [NSArray arrayWithObjects:@"Row", @"Image Gallery", nil];
    [self.tableView reloadData];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    // Return the number of rows in the section.
    return self.dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] init];
    }
    
    [cell.textLabel setText:[self.dataSource objectAtIndex:indexPath.row]];
    
    return cell;
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *item = (NSString*)[self.dataSource objectAtIndex:indexPath.row];
    if (self.delegate) [self.delegate actionSelect:self didSelectAction:item];    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}

@end
