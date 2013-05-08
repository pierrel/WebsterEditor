//
//  WEProjectsViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEViewController.h"
#import "WEProjectCell.h"

@interface WEProjectsViewController : UICollectionViewController<UICollectionViewDelegate,WEViewControllerDelegate,WEProjectRenameDelegate>
-(NSArray*)projects;
-(void)didSaveViewController:(WEViewController *)controller;
@end
