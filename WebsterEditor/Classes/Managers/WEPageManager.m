//
//  WEPageController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageManager.h"

static WEPageManager *gSharedManager;

@implementation WEPageManager
@synthesize bridge;

-(void)deselectSelectedElement {
    [bridge callHandler:@"deselectSelectedElement" data:[NSDictionary dictionary]];
}

-(void)removeSelectedElement {
    [bridge callHandler:@"removeElementHandler" data:[NSDictionary dictionary]];
}

-(void)selectParentElement {
    [bridge callHandler:@"selectParentElement" data:[NSDictionary dictionary]];
}

-(void)editSelectedElement {
    [bridge callHandler:@"editElementHandler" data:[NSDictionary dictionary]];
}

-(void)addElementUnderSelectedElement:(NSString*)elementName {
    [bridge callHandler:@"addElementUnderSelectedElement" data:[NSDictionary dictionaryWithObject:elementName
                                                                                           forKey:@"element-name"]];
}

-(void)getSelectedElementDataWithCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"getSelectedElementData" data:[NSDictionary dictionary] responseCallback:responseCallback];
}


-(void)addGalleryUnderSelectedElement {
    [bridge callHandler:@"addGalleryUnderSelectedElement" data:[NSDictionary dictionary]];
}

-(void)incrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"incrementColumn"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)decrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"decrementColumn"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}


-(void)incrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"incrementColumnOffset"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)decrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"decrementColumnOffset"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)setBackgroundImageToPath:(NSString *)path withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"setBackgroundImage"
                   data:[NSDictionary dictionaryWithObject:path forKey:@"path"]
       responseCallback:^(id responseData) {
           responseCallback(responseData);
       }];
}

-(void)setSrcForSelectedImage:(NSString *)path {
    [bridge callHandler:@"setSelectedImageSrc"
                   data:[NSDictionary dictionaryWithObject:path forKey:@"path"]];
}

-(void)getSelectedNodeStyleWithCallback:(WEResponseCallback)callback {
    [bridge callHandler:@"getSelectedNodeStyle" data:[NSDictionary dictionary] responseCallback:^(id responseData) {
        callback(responseData);
    }];
}

-(void)setSelectedNodeStyle:(NSDictionary*)styleDict withCallback:(WEResponseCallback)callback {
    [bridge callHandler:@"setSelectedNodeStyle" data:styleDict responseCallback:^(id responseData) {
        callback(responseData);
    }];
}

-(void)setSelectedTextURL:(NSString *)url {
    NSDictionary *data = [NSDictionary dictionaryWithObject:url forKey:@"url"];
    [bridge callHandler:@"setSelectedTextLink" data:data responseCallback:^(id responseData) {
    }];
}

-(void)removeBackgroundImageWithCallback:(WEResponseCallback)callback {
    [bridge callHandler:@"removeBackgroundImage"
                   data:[NSDictionary dictionary]
       responseCallback:^(id responseData) {
            if (callback) callback(responseData);
        }];
}

-(void)hasBackgroundWithCallback:(WEResponseCallback)callback {
    [bridge callHandler:@"hasBackgroundImage"
                   data:[NSDictionary dictionary]
       responseCallback:^(id responseData) {
           return callback(responseData);
    }];
}

-(void)setMode:(NSString *)modeName {
    [bridge callHandler:@"setMode"
                   data:[NSDictionary dictionaryWithObject:modeName forKey:@"mode"]
       responseCallback:^(id responseData) {
         NSLog(@"mode changed to %@", modeName);
    }];
}

-(void)exportMarkup:(WEResponseCallback)callback {
    [bridge callHandler:@"exportMarkup"
                   data:[NSDictionary dictionary]
       responseCallback:^(id responseData) {
         return callback(responseData);
    }];
}

+(WEPageManager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WEPageManager alloc] init];
    }
    
    return gSharedManager;
}
@end
