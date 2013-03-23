//
//  WEDialogViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEDialogViewController.h"
#import "WEPageManager.h"
#import "WEUtils.h"

@interface WEDialogViewController ()
@property (strong, nonatomic) NSArray *dataSource;
@property (assign, nonatomic) BOOL wantsOpen;
@end

@implementation WEDialogViewController
@synthesize popover;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.popover = [[UIPopoverController alloc] initWithContentViewController:self];
        [popover setPopoverContentSize:CGSizeMake(200, 300)];
        popover.delegate = self;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
        // positional
    [self.view addSubview:self.tableView];
}

- (void)openWithData:(id)data inView:(UIView*)inView {
    // content
    self.tag = [data valueForKey:@"tag"];
    if ([self.tag isEqualToString:@"H1"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Up", @"Edit", @"Remove", nil];
    }
    self.classes = [data valueForKey:@"classes"];
    if ([self.classes containsObject:@"container-fluid"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Remove", @"Add Row", @"Add Image Gallery",nil];
    } else if ([self.classes containsObject:@"row-fluid"]) {
        self.dataSource = [NSArray arrayWithObjects:@"Remove", nil];
    }

    // reload
    [self.tableView reloadData];
    
    // render
    [popover presentPopoverFromRect:[WEUtils frameFromData:data]
                             inView:inView
           permittedArrowDirections:UIPopoverArrowDirectionAny
                           animated:YES];
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
    else if ([item isEqualToString:@"Add Row"])
        [pageManager addRowUnderSelectedElement];
    else if ([item isEqualToString:@"Add Image Gallery"])
        [pageManager addGalleryUnderSelectedElement];
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    [self close];
}

-(void)close {
    [popover dismissPopoverAnimated:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
