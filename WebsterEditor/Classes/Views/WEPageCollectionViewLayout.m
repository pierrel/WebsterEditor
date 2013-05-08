//
//  WEPageCollectionViewLayout.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCollectionViewLayout.h"

@implementation WEPageCollectionViewLayout
-(id)init {
    if (!(self = [super init])) return nil;
    
    self.itemSize = CGSizeMake(130, 130);
    self.sectionInset = UIEdgeInsetsMake(10, 0, 0, 40);
    self.scrollDirection = UICollectionViewScrollDirectionVertical;
    self.minimumInteritemSpacing = 0.5f;
    self.minimumLineSpacing = 0.5f;
    
    return self;
}
@end