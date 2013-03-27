//
//  WEPageController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WebViewJavascriptBridge.h"

typedef void (^WEResponseCallback)(id responseData);

@interface WEPageManager : NSObject
@property (strong, nonatomic) WebViewJavascriptBridge *bridge;

-(void)removeSelectedElement;
-(void)deselectSelectedElement;
-(void)editSelectedElement;
-(void)addGalleryUnderSelectedElement;

/*
 *  Row edits
 */
-(void)addRowUnderSelectedElement;
-(void)incrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback;
-(void)decrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback;
-(void)incrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback;
-(void)decrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback;

/*
 *  Background handling
 */
-(void)setBackgroundImageToPath:(NSString*)path;
-(void)removeBackgroundImageWithCallback:(WEResponseCallback)callback;
-(void)hasBackgroundWithCallback:(WEResponseCallback)callback;

-(void)exportMarkup:(WEResponseCallback)callback;

+(WEPageManager *)sharedManager;
@end
