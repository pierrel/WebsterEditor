//
//  NSThread+BlockAdditions.h
//  Eight
//
//  Created by bwilliams on 3/3/11.
//  Copyright 2011 Blurb. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface NSThread (BlocksAdditions)
- (void)performBlock:(void (^)())block;
- (void)performBlock:(void (^)())block waitUntilDone:(BOOL)wait;
+ (void)performBlockInBackground:(void (^)())block;
@end
