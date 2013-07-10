//
//  WEStyleTableViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 6/15/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEStyleTableViewController.h"
#import "UITableViewController+UITableViewControllerAdditions.h"
#import "WEStyleCell.h"
#import "WEPageManager.h"

@interface WEStyleTableViewController ()
@property (nonatomic, strong) NSMutableDictionary *styleData;
@property (nonatomic, strong) UITextField *editingField;
@end

@implementation WEStyleTableViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

-(void)setNewStyleData:(NSDictionary *)newStyleData {
    self.styleData = [NSMutableDictionary dictionaryWithDictionary:newStyleData];
    [self.tableView reloadData];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.tableView registerNib:[UINib nibWithNibName:@"WEStyleCell" bundle:nil] forCellReuseIdentifier:@"StyleCell"];
    if (self.navigationItem) {
        UIBarButtonItem *doneButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(doneTapped:)];
        [self.navigationItem setRightBarButtonItem:doneButton];
        [self.navigationItem setTitle:@"Edit Styles"];
    }
    
    UITapGestureRecognizer *dismissTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tappedOnTableView:)];
    [self.tableView addGestureRecognizer:dismissTap];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
}

-(void)doneTapped:(id)button {
    [self.navigationController dismissViewControllerAnimated:YES completion:^{
        NSLog(@"done editing styles");
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
    return self.styleData.count + 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    WEStyleCell *cell = (WEStyleCell*)[tableView dequeueReusableCellWithIdentifier:@"StyleCell"
                                                                      forIndexPath:indexPath];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    if (indexPath.row == self.styleData.count) {
        cell.styleName.text = @"style";
        cell.styleValue.text = @"value";
    } else {
        NSString *cssStyle = [self.styleData.allKeys objectAtIndex:indexPath.row];
        NSString *cssVal = [self.styleData objectForKey:cssStyle];
        cell.styleName.text = cssStyle;
        cell.styleValue.text = cssVal;
    }
    
    cell.styleValue.delegate = self;
    cell.styleNameField.delegate = self;
    [cell.styleValue addTarget:self action:@selector(textFinished:) forControlEvents:UIControlEventEditingDidEndOnExit];
    
    UITapGestureRecognizer *labelTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(styleNameSelected:)];
    [cell.styleName addGestureRecognizer:labelTap];
    return cell;
}

-(void)textFinished:(id)sender {
    [sender resignFirstResponder];
}

-(void)tappedOnTableView:(UITapGestureRecognizer*)dismissTap {
    if (self.editingField) {
        [self.editingField endEditing:YES];
    }
}

-(void)textFieldDidEndEditing:(UITextField *)textField {
    self.editingField = nil;
    WEStyleCell *cell = (WEStyleCell*)[self cellForSubview:textField];
    if (textField == cell.styleValue) {
        NSString *name = cell.styleName.text;
        NSString *newValue = textField.text;
    
        [self.styleData setObject:newValue forKey:name];
        [[WEPageManager sharedManager] setSelectedNodeStyle:self.styleData withCallback:^(id responseData) {
            if (self.delegate) [self.delegate styleResetWithData:responseData];
        }];
    } else if (textField == cell.styleNameField) {
        cell.styleName.text = textField.text;
        [textField setHidden:YES];
        [cell.styleName setHidden:NO];
    }
}

-(void)textFieldDidBeginEditing:(UITextField *)textField {
    self.editingField = textField;
    WEStyleCell *cell = (WEStyleCell*)[self cellForSubview:textField];
    if (textField == cell.styleNameField) {
        [cell.styleName setHidden:YES];
        textField.text = cell.styleName.text;
        [textField setHidden:NO];
    }
}

-(void)styleNameSelected:(UITapGestureRecognizer*)labelTap {
    WEStyleCell *cell = (WEStyleCell*)[self cellForSubview:labelTap.view];
    [cell.styleNameField setHidden:NO];
    [cell.styleNameField becomeFirstResponder];
}



/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

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

// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return NO;
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Navigation logic may go here. Create and push another view controller.
    /*
     <#DetailViewController#> *detailViewController = [[<#DetailViewController#> alloc] initWithNibName:@"<#Nib name#>" bundle:nil];
     // ...
     // Pass the selected object to the new view controller.
     [self.navigationController pushViewController:detailViewController animated:YES];
     */
}

@end
