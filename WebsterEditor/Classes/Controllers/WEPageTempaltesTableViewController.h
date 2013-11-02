//
//  WEPageTempaltesTableViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 11/2/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol WEPageTempaltesTableViewControllerDelegate;

@interface WEPageTempaltesTableViewController : UITableViewController
@property (nonatomic, assign) id<WEPageTempaltesTableViewControllerDelegate> delegate;
@end

@protocol WEPageTempaltesTableViewControllerDelegate <NSObject>
-(void)templateViewController:(WEPageTempaltesTableViewController*)controller didSelectPageAtPath:(NSString*)pageTemplatePath;
@end