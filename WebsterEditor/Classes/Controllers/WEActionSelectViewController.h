//
//  WESelecrtionActionViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/25/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@class WEActionSelectViewController;
@protocol WEActionSelectDelegate <NSObject>
-(void)actionSelect:(WEActionSelectViewController*)actionController didSelectAction:(NSString*)action;
@end


@interface WEActionSelectViewController : UITableViewController
@property (strong, nonatomic) NSArray *classes;
@property (strong, nonatomic) NSString *tag;
@property (assign, nonatomic) id delegate;

-(void) setData:(id)data;
@end
