//
//  WEPageCollectionViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WEPageCollectionViewController : UICollectionViewController<UICollectionViewDataSource,UICollectionViewDelegate>
@property (nonatomic, strong) NSString *projectId;
@end
