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
@property (strong, nonatomic) NSDictionary *dataSource;
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
    
    UIBarButtonItem *cancelButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(cancelTapped:)];
    [self.navigationItem setRightBarButtonItem:cancelButton];
    [self.navigationItem setTitle:@"Add Element"];
}

-(void)cancelTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:^{
        NSLog(@"cancelled add");
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Setup data source
-(void) setData:(id)data {    
    self.dataSource = [data objectForKey:@"addable"];
    [self.tableView reloadData];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return [self.dataSource count];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    // Return the number of rows in the section.
    NSString *key = [[self.dataSource allKeys] objectAtIndex:section];
    NSArray *entries = [self.dataSource objectForKey:key];
    
    return [entries count];
}

-(NSString*)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return [(NSString*)[[self.dataSource allKeys] objectAtIndex:section] capitalizedString];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] init];
    }
    NSString *key = [[self.dataSource allKeys] objectAtIndex:indexPath.section];
    NSArray *entries = [self.dataSource objectForKey:key];
    NSString *entry = [entries objectAtIndex:indexPath.row];
    
    [cell.textLabel setText:[entry capitalizedString]];
    
    return cell;
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *key = [[self.dataSource allKeys] objectAtIndex:indexPath.section];
    NSArray *entries = [self.dataSource objectForKey:key];
    NSString *item = [entries objectAtIndex:indexPath.row];
    
    if (self.delegate) [self.delegate actionSelect:self didSelectAction:item];
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}

@end
