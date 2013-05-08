//
//  WEProjectCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEProjectCell.h"

@interface WEProjectCell()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UITextField *nameView;
@end

@implementation WEProjectCell

CGFloat const NAME_HEIGHT = 20;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0,
                                                                       0,
                                                                       frame.size.width,
                                                                       frame.size.height - NAME_HEIGHT)];
        self.imageView.backgroundColor = [UIColor whiteColor];
        [self.contentView addSubview:self.imageView];
        self.contentView.backgroundColor = [UIColor clearColor];
        
        self.nameView = [[UITextField alloc] initWithFrame:CGRectMake(0,
                                                                      frame.size.height - NAME_HEIGHT,
                                                                      frame.size.width,
                                                                      NAME_HEIGHT)];
        [self.nameView setBackgroundColor:[UIColor clearColor]];
        [self.nameView setTextAlignment:NSTextAlignmentCenter];
        [self.nameView setTextColor:[UIColor whiteColor]];
        [self.nameView setDelegate:self];
        [self.contentView addSubview:self.nameView];
    }
    return self;
}

-(void)setImage:(UIImage *)image {
    CGSize size = image.size;
    CGRect frame = self.frame;
    CGFloat width = (frame.size.height/size.height) * size.width;
    self.imageView.backgroundColor = [UIColor clearColor];
    [self.imageView setFrame:CGRectMake((frame.size.width - width)/2, 0, width, frame.size.height - NAME_HEIGHT)];
    [self.imageView setImage:image];
}

-(void)setName:(NSString *)name {
    [self.nameView setText:name];
}

-(void)textFieldDidEndEditing:(UITextField *)textField {
    if (self.delegate) [self.delegate project:self.projectId renamedTo:textField.text];
}


/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end
