//
//  WEBodyBackgroundCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 8/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEBodyBackgroundCell.h"

@implementation WEBodyBackgroundCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

-(void)setBackgroundImageTapped:(id)sender {
    if (self.delegate) [self.delegate bodyBackgroundWantsToSetBackground];
}

-(void)removeBackgroundImageTapped:(id)sender {
    if (self.delegate) [self.delegate bodyBackgroundWantsToRemoveBackground];
}

@end
