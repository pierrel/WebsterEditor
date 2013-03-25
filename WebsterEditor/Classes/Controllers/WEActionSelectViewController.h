//
//  WESelecrtionActionViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/25/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEActionSelectViewController : UITableViewController
@property (strong, atomic) NSArray *classes;
@property (strong, atomic) NSString *tag;

-(void) setData:(id)data;
@end
