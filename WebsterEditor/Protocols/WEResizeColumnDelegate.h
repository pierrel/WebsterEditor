//
//  WEResizeColumnDelegate.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WEColumnResizeView.h"

@protocol WEResizeColumnDelegate <NSObject>
-(void)resizeView:(WEColumnResizeView*)resizeView incrementSpanAtColumnIndex:(NSInteger)columnIndex;
@end
