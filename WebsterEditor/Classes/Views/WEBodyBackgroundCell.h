//
//  WEBodyBackgroundCell.h
//  WebsterEditor
//
//  Created by pierre larochelle on 8/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEBodyBackgroundCell : UITableViewCell
@property (nonatomic, retain) IBOutlet UIButton *deleteButton;

-(IBAction)setBackgroundImageTapped:(id)sender;
-(IBAction)removeBackgroundImageTapped:(id)sender;
@end
