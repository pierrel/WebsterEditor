//
//  WELinkViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 7/13/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WELinkViewController.h"
#import "WECustomLinkCell.h"

@interface WELinkViewController ()

@end

@implementation WELinkViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self.tableView registerNib:[UINib nibWithNibName:@"WECustomLinkCell" bundle:nil]
         forCellReuseIdentifier:@"WECustomLinkCell"];
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"Cell"];
    
    UIBarButtonItem *doneButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                                                                                target:self
                                                                                action:@selector(doneButtonTapped:)];
    [self.navigationItem setRightBarButtonItem:doneButton];
}

-(void)viewDidDisappear:(BOOL)animated {
    self.urlString = nil;
    [self.tableView reloadData];
    
    [super viewDidDisappear:animated];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)doneButtonTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:^{
        NSLog(@"linking done");
    }];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    NSArray *pages = [self pages];
    if (pages && pages.count > 0)
        return 2;
    else
        return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    // Return the number of rows in the section.
    if (section == 0)
        return 1;
    else
        return [self pages].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == 0) {
        NSString *CellIdentifier = @"WECustomLinkCell";
        WECustomLinkCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        [cell.urlField setDelegate:self];
        
        if (self.urlString && [self indexForPageNamed:self.urlString] == NSNotFound) {
            [cell.urlField setText:self.urlString];
        } else {
            [cell.urlField setText:@""];
        }
        
        return cell;
    } else {
        NSArray *pages = [self pages];
        NSString *page = [pages objectAtIndex:indexPath.row];
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];
        [cell.textLabel setText:page];
        
        if ([page isEqualToString:self.urlString]) {
            [tableView selectRowAtIndexPath:indexPath animated:NO scrollPosition:UITableViewScrollPositionNone];
        } else {
            [tableView deselectRowAtIndexPath:indexPath animated:NO];
        }
        
        return cell;
    }
}

-(NSString*)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    if (section == 0) {
        return @"Custom URL";
    } else {
        return @"Local Pages";
    }
}

-(void)textFieldDidEndEditing:(UITextField *)textField {
    if (self.delegate) [self.delegate linkViewController:self setSelectedTextURL:textField.text];
}

-(NSArray*)pages {
    if (self.delegate)
        return [self.delegate getPagesForLinkViewController:self];
    else
        return nil;
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    return NO;
}

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    return NO;
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == 1) {
        NSArray *pages = [self pages];
        NSString *page = [pages objectAtIndex:indexPath.row];
        
        // set the new url
        if (self.delegate) [self.delegate linkViewController:self setSelectedTextURL:page];
        
        // clear custom field
        WECustomLinkCell *customCell = (WECustomLinkCell *)[tableView cellForRowAtIndexPath:[NSIndexPath indexPathForItem:0
                                                                                                                inSection:0]];
        customCell.urlField.text = @"";
        
        // set current custom url and clear old one
        int oldPageIndex = [self indexForPageNamed:self.urlString];
        if (oldPageIndex != NSNotFound)
            [tableView deselectRowAtIndexPath:[NSIndexPath indexPathForItem:oldPageIndex inSection:1]
                                     animated:YES];
        self.urlString = page;
        
    } else {
        [tableView deselectRowAtIndexPath:indexPath animated:YES];
    }
}

-(int)indexForPageNamed:(NSString*)pageName {
    NSArray *pages = [self pages];
    int oldPageIndex;
    BOOL pageFound = NO;
    for (int i = 0; i < pages.count; i++) {
        NSString *oldPage = [pages objectAtIndex:i];
        if ([oldPage isEqualToString:pageName]) {
            oldPageIndex = i;
            pageFound = YES;
            break;
        }
    }
    
    if (pageFound) {
        return oldPageIndex;
    } else {
        return NSNotFound;
    }
}

@end
