//
//  WEColumnResizeView.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

static const int ICON_DIM = 25;

#import "WEColumnResizeView.h"
#import <QuartzCore/QuartzCore.h>

@interface WEColumnResizeView ()
@property (assign, nonatomic) CGFloat touchOriginX;
@property (assign, nonatomic) CGFloat handleOriginX;
@property (assign, nonatomic) BOOL changeRequestSent;
@property (strong, nonatomic) UIButton *movingHandle;
@property (strong, nonatomic) UIColor *stillColor;
@property (strong, nonatomic) UIColor *movingColor;

-(void)longPressed:(UILongPressGestureRecognizer*)recognizer;
@end


@implementation WEColumnResizeView
@synthesize rightResize, leftResize, movingHandle;
@synthesize delegate;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.movingColor = [UIColor colorWithRed:0 green:0 blue:1 alpha:0.2];
        self.stillColor = [UIColor clearColor];
        [self setBackgroundColor:self.stillColor];
        
        rightResize = [[UIButton alloc] init];
        [rightResize setTitle:@"🔴" forState:UIControlStateNormal];
        leftResize = [[UIButton alloc] init];
        [leftResize setTitle:@"🔴" forState:UIControlStateNormal];
        
        [self addSubview:rightResize];
        [self addSubview:leftResize];
        
        UILongPressGestureRecognizer *rightLongPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressed:)];
        UILongPressGestureRecognizer *leftLongPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressed:)];
        [rightLongPress setMinimumPressDuration:0.2];
        [leftLongPress setMinimumPressDuration:0.2];
        [rightResize addGestureRecognizer:rightLongPress];
        [leftResize addGestureRecognizer:leftLongPress];

        self.changeRequestSent = NO;
    }
    return self;
}

- (id)initWithFrame:(CGRect)frame withElementIndex:(NSInteger)elementIndex {
    self = [self initWithFrame:frame];
    if (self) {
        self.elementIndex = elementIndex;
}
    return self;
}

-(void)positionRight {
    CGFloat y = (self.frame.size.height/2) - (ICON_DIM/2);
    [rightResize setFrame:CGRectMake(self.frame.size.width - ICON_DIM,
                                     y,
                                     ICON_DIM,
                                     ICON_DIM)];
}

-(void)positionLeft {
    CGFloat y = (self.frame.size.height/2) - (ICON_DIM/2);
    [leftResize setFrame:CGRectMake(0,
                                    y,
                                    ICON_DIM,
                                    ICON_DIM)];
}

-(void)position {
    [self positionLeft];
    [self positionRight];
    [self setNeedsDisplay];
}

- (void)resetFrame:(CGRect)newFrame {
    self.frame = newFrame;
    if (movingHandle) {
        if (movingHandle == rightResize) {
            self.touchOriginX = newFrame.size.width - ICON_DIM;
            [self positionLeft];
        } else {
            self.touchOriginX = 0;
            [self positionRight];
        }
        self.handleOriginX = self.touchOriginX;
    } else {
        [self position];
    }
    self.changeRequestSent = NO;
}

-(void)longPressed:(UILongPressGestureRecognizer *)recognizer {
    if (recognizer.state == UIGestureRecognizerStateBegan) {
        [self showBackground:YES];
        self.changeRequestSent = NO;
        if (recognizer.view == rightResize) {
            movingHandle = rightResize;
        } else {
            movingHandle = leftResize;
        }
                
        // record where the touch is
        self.touchOriginX = [recognizer locationInView:self].x;
        self.handleOriginX = movingHandle.frame.origin.x;
    } else if (recognizer.state == UIGestureRecognizerStateChanged && movingHandle) {
        CGPoint currentLocation = [recognizer locationInView:self];
        CGFloat delta = currentLocation.x - self.touchOriginX;
        
        movingHandle.frame = CGRectMake(self.handleOriginX + delta,
                                        movingHandle.frame.origin.y,
                                        movingHandle.frame.size.width,
                                        movingHandle.frame.size.height);
        
        if (delta > 60 && delegate && !self.changeRequestSent) {
            self.changeRequestSent = YES;
            if (movingHandle == rightResize) {
                [delegate resizeView:self incrementSpanAtColumnIndex:self.elementIndex];
            } else if (movingHandle == leftResize) {
                [delegate resizeView:self incrementOffsetAtColumnIndex:self.elementIndex];
            }
        } else if (delta < -60 && delegate && !self.changeRequestSent) {
            self.changeRequestSent = YES;
            if (movingHandle == rightResize) {
                [delegate resizeView:self decrementSpanAtColumnIndex:self.elementIndex];
            } else if (movingHandle == leftResize) {
                [delegate resizeView:self decrementOffsetAtColumnIndex:self.elementIndex];
            }
        }
    } else if (recognizer.state == UIGestureRecognizerStateEnded) {
        [self showBackground:NO];
        [UIView animateWithDuration:0.3 animations:^{
            movingHandle.frame = CGRectMake(self.handleOriginX,
                                            movingHandle.frame.origin.y,
                                            movingHandle.frame.size.width,
                                            movingHandle.frame.size.height);
        } completion:^(BOOL finished) {
            movingHandle = nil;
        }];
    } else {
        [self showBackground:NO];
        movingHandle = nil;
        NSLog(@"whatttt?");
    }
}

-(void)showBackground:(BOOL)show {
    UIColor *newColor = (show ? self.movingColor : self.stillColor);
    [UIView animateWithDuration:0.2 animations:^{
        [self setBackgroundColor:newColor];
    }];
}

-(id)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    id hitView = [super hitTest:point withEvent:event];
    if (hitView == self) return nil;
    else return hitView;
}
@end
