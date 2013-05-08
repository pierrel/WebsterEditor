//
//  WEProjectCell.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol WEProjectRenameDelegate <NSObject>
-(void)project:(NSString*)projectId renamedTo:(NSString*)newName;
@end


@interface WEProjectCell : UICollectionViewCell<UITextFieldDelegate>
@property (assign, nonatomic) id<WEProjectRenameDelegate>delegate;
@property (strong, nonatomic) NSString *projectId;
-(void)setImage:(UIImage*)image;
-(void)setName:(NSString*)name;
@end

