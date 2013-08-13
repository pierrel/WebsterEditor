//
//  WEStyleTableViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 6/15/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol WEStyleTableViewControllerDelegate <NSObject>

-(void)styleResetWithData:(id)data;

@end

@interface WEStyleTableViewController : UITableViewController<UITextFieldDelegate>
@property (nonatomic, strong) NSString *type;
@property (nonatomic, strong) NSString *tag;
@property (nonatomic, assign) id<WEStyleTableViewControllerDelegate>delegate;
-(void)setNewStyleData:(NSDictionary*)newStyleData;
@end
