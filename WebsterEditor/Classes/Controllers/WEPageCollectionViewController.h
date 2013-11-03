//
//  WEPageCollectionViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEPageCell.h"

@protocol PageCollectionDelegate;

@interface WEPageCollectionViewController : UICollectionViewController<UICollectionViewDataSource,UICollectionViewDelegate,WEPageRenameDelegate,UIAlertViewDelegate>
@property (nonatomic, strong) NSString *projectId;
@property (nonatomic, assign) id<PageCollectionDelegate> delegate;

-(void)refreshAfterAddingPage;
-(NSArray*)pages;
@end

@protocol PageCollectionDelegate<NSObject>

-(void)addAndSwitchToNewPageFromController:(WEPageCollectionViewController*)controller;
-(void)switchToPage:(NSString*)pageName;
-(void)page:(NSString *)pageName renamedTo:(NSString *)newName;
-(void)pageDeleted:(NSString*)pageName;

@end

