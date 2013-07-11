//
//  UITableViewController+UITableViewControllerAdditions.m
//  WebsterEditor
//
//  Created by pierre larochelle on 6/16/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "UITableViewController+UITableViewControllerAdditions.h"

@implementation UITableViewController (UITableViewControllerAdditions)
-(UITableViewCell*)cellForSubview:(UIView*)view {
    UIView *upperView = view;
    while (upperView) {
        if ([upperView isKindOfClass:[UITableViewCell class]]) {
            return (UITableViewCell*)upperView;
        } else {
            upperView = upperView.superview;
        }
    }
    
    return nil;
}
@end
