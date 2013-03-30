//
//  UIImage+WEExtras.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/30/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "UIImage+WEExtras.h"

@implementation UIImage (WEExtras)

-(UIImage*)scaledBy:(CGFloat)scale {
    CGSize newSize = CGSizeMake(self.size.width*scale, self.size.height*scale);
    UIGraphicsBeginImageContext(newSize);
    [self drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return newImage;
}

@end
