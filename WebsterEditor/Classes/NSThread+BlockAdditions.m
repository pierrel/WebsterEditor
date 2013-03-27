//
//  NSThread+BlockAdditions.m
//  Eight
//
//  Created by bwilliams on 3/3/11.
//  Copyright 2011 Blurb. All rights reserved.
//

#import "NSThread+BlockAdditions.h"


@implementation NSThread (BlocksAdditions)
- (void)performBlock:(void (^)())block
{
	if ([[NSThread currentThread] isEqual:self])
		block();
	else
		[self performBlock:block waitUntilDone:NO];
}
- (void)performBlock:(void (^)())block waitUntilDone:(BOOL)wait
{
    [NSThread performSelector:@selector(ng_runBlock:)
                     onThread:self
                   withObject:[block copy]
                waitUntilDone:wait];
}
+ (void)ng_runBlock:(void (^)())block
{
	block();
}
+ (void)performBlockInBackground:(void (^)())block
{
	[NSThread performSelectorInBackground:@selector(ng_runBlock:)
	                           withObject:[block copy]];
}
@end