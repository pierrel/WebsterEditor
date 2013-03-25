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
    // content
    self.tag = [data valueForKey:@"tag"];
    if ([self.tag isEqualToString:@"H1"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Up", @"Edit", @"Remove", nil];
    }
    self.classes = [data valueForKey:@"classes"];
    if ([self.classes containsString:@"container-fluid"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Remove", @"Add Row", @"Add Image Gallery",nil];
    } else if ([self.classes containsString:@"row-fluid"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Remove", nil];
    }
    
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
    WEPageManager *pageManager = [WEPageManager sharedManager];
    if ([item isEqualToString:@"Remove"])
        [pageManager removeSelectedElement];
    else if ([item isEqualToString:@"Edit"])
        [pageManager editSelectedElement];
    else if ([item isEqualToString:@"Add Row"])
        [pageManager addRowUnderSelectedElement];
    else if ([item isEqualToString:@"Add Image Gallery"])
        [pageManager addGalleryUnderSelectedElement];
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}

@end
