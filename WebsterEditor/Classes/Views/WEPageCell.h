//
//  WEPageCell.h
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol WEPageRenameDelegate <NSObject>
-(BOOL)page:(NSString*)pageName renamedTo:(NSString*)newName;
-(void)deletePage:(NSString*)pageName;
@end


@interface WEPageCell : UICollectionViewCell<UITextFieldDelegate>
@property (assign, nonatomic) id<WEPageRenameDelegate>delegate;
-(void)setName:(NSString*)name;
-(void)setImage:(UIImage *)image;
@end
