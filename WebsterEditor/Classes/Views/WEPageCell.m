//
//  WEPageCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCell.h"
#import "WEPageBackgroundView.h"

@interface WEPageCell()
@property (nonatomic, strong) UITextField *pageNameField;
@property (nonatomic, strong) WEPageBackgroundView *bgView;
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) NSString *name;
@end

@implementation WEPageCell
@synthesize pageNameField;

int const TEXT_HEIGHT = 20;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        CGFloat buffer = TEXT_HEIGHT;
        CGRect effectiveFrame = CGRectMake(buffer,
                                           (buffer/2),
                                           frame.size.width - (buffer*2),
                                           frame.size.height - (buffer*1.5));

        self.bgView = [[WEPageBackgroundView alloc] initWithFrame:effectiveFrame];
        [self.bgView setColor:[UIColor darkGrayColor]];
        [self.bgView setHidden:YES];
        [self addSubview:self.bgView];
        
        UIView *something = [[UIView alloc] initWithFrame:effectiveFrame];
        something.backgroundColor = [UIColor blackColor];
        something.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        [self addSubview:something];
        
        self.imageView = [[UIImageView alloc] initWithFrame:effectiveFrame];
        [self.imageView setBackgroundColor:[UIColor clearColor]];
        [self addSubview:self.imageView];
                
        pageNameField = [[UITextField alloc] initWithFrame:CGRectMake(0,
                                                                     frame.size.height - TEXT_HEIGHT,
                                                                     frame.size.width,
                                                                     TEXT_HEIGHT)];
        [pageNameField setBackgroundColor:[UIColor clearColor]];
        [pageNameField setTextColor:[UIColor greenColor]];
        [pageNameField setTextAlignment:NSTextAlignmentCenter];
        [pageNameField setDelegate:self];
        
        [self addSubview:pageNameField];
    }
    return self;
}

-(void)setImage:(UIImage *)image {
    [self.imageView setImage:image];
}

-(void)setName:(NSString *)name {
    [pageNameField setText:name];
    _name = name;
}

-(void)setHighlighted:(BOOL)highlighted {
    if (highlighted) {
        [self.bgView setHidden:NO];
    } else {
        [self.bgView setHidden:YES];
    }
}

-(void)textFieldDidEndEditing:(UITextField *)textField {
    if (![textField.text isEqualToString:self.name]) {
        if (self.delegate) {
            if ([self.delegate page:_name renamedTo:textField.text]) {
                _name = textField.text;
            } else {
                textField.text = self.name;
                UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Could not rename page"
                                                                message:@"Make sure the name is not taken"
                                                               delegate:nil
                                                      cancelButtonTitle:@"OK"
                                                      otherButtonTitles:nil];
                [alert show];
            }
        } else {
            textField.text = self.name;
            NSLog(@"Error! Must set delegate to change page name");
        }
    }
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
