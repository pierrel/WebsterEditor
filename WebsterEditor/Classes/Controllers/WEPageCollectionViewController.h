//
//  WEPageCollectionViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol PageCollectionDelegate<NSObject>

-(void)addAndSwitchToNewPage;
-(void)switchToPage:(NSString*)pageName;

@end

@interface WEPageCollectionViewController : UICollectionViewController<UICollectionViewDataSource,UICollectionViewDelegate>
@property (nonatomic, strong) NSString *projectId;
@property (nonatomic, assign) id<PageCollectionDelegate> delegate;

-(NSArray*)pages;
@end
