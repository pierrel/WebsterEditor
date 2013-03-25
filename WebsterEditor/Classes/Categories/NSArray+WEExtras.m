//
//  NSArray+WEExtras.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "NSArray+WEExtras.h"

@implementation NSArray (WEExtras)
-(BOOL)containsString:(NSString*)string {
    for (NSObject *object in self) {
        if ([object isKindOfClass:[NSString class]] && [(NSString*)object isEqualToString:string])
            return YES;
    }
    return NO;
}
@end
