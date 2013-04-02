//
//  WEViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEWebViewController.h"
#import "WEPageManager.h"
#import "WEColumnResizeView.h"
#import "WEViewController+ImagePicker.h"
#import "WEUtils.h"
#import "WEActionSelectViewController.h"

static const int ICON_DIM = 13;

@interface WEWebViewController ()
- (void)openDialogWithData:(id)data;
- (void)closeDialog;
- (WEColumnResizeView*)resizeViewAtIndex:(NSInteger)index;
@end

@implementation WEWebViewController
@synthesize  imagePickerCallback;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    WebViewJavascriptBridge *jsBridge = [WebViewJavascriptBridge bridgeForWebView:self.webView handler:^(id data, WVJBResponseCallback responseCallback) {
        NSLog(@"bridge enabled");
    }];
    [jsBridge send:@"A string sent from ObjC before Webview has loaded."
  responseCallback:^(id responseData) {
        NSLog(@"objc got response! %@", responseData);
    }];
    [jsBridge callHandler:@"testJavascriptHandler"
                     data:[NSDictionary dictionaryWithObject:@"before ready" forKey:@"foo"]];
    
    [jsBridge registerHandler:@"containerSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        NSLog(@"got %@", data);
        NSArray *classes = (NSArray*)[data objectForKey:@"classes"];
        if ([classes indexOfObjectPassingTest:^BOOL(id obj, NSUInteger idx, BOOL *stop) {
            return [((NSString*)obj) isEqualToString:@"image-thumb"];
        }] != NSNotFound) {
            [self openImagePickerWithData:data withCallback:responseCallback];
        } else {
            [self openDialogWithData:data];
        }
    }];
    
    [jsBridge registerHandler:@"removingMedia" handler:^(id data, WVJBResponseCallback responseCallback) {
        NSLog(@"%@", data);
        NSString *path = [data objectForKey:@"media-src"];
        NSFileManager *fs = [NSFileManager defaultManager];
        NSError *error;
        [fs removeItemAtPath:[WEUtils pathInDocumentDirectory:path withProjectId:self.projectId] error:&error];
    }];
    
    [jsBridge registerHandler:@"defaultSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self closeDialog];
    }];
    
    NSString *indexPath = [WEUtils pathInDocumentDirectory:@"development.html" withProjectId:self.projectId];
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:indexPath]]];
    //[self.webView loadHTMLString:html baseURL:base];
    self.webView.keyboardDisplayRequiresUserAction = NO;
    
    // setup the page manager
    WEPageManager *manager = [WEPageManager sharedManager];
    [manager setBridge:jsBridge];
    
    // Dialog view
    self.actionsController = [[WEActionSelectViewController alloc] init];
    self.actionsController.delegate = self;
}

- (void)openDialogWithData:(id)data {
//    [self.dialogController openWithData:data inView:self.view];
    [self.actionsController setData:data];
    if (!self.actionPopover) {
        self.actionPopover = [[UIPopoverController alloc] initWithContentViewController:self.actionsController];
        self.actionPopover.delegate = self;
        [self.actionPopover setPopoverContentSize:CGSizeMake(300, 300)];
    }
    [self.actionPopover presentPopoverFromRect:[WEUtils frameFromData:data] inView:self.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    
    // add resizers if any
    NSArray *children = [data objectForKey:@"children"];
    if (children) {
        for (int i = 0; i < children.count; i++) {
            id childData = [children objectAtIndex:i];
            CGRect columnFrame = [WEUtils frameFromData:childData];
            WEColumnResizeView *newView = [[WEColumnResizeView alloc] initWithFrame:columnFrame
                                                                   withElementIndex:i];
            newView.delegate = self;
            [self.view addSubview:newView];
            [newView position];
        }
    }

}

#pragma mark - Action selection stuff

-(void)actionSelect:(WEActionSelectViewController *)actionController didSelectAction:(NSString *)action {
    WEPageManager *pageManager = [WEPageManager sharedManager];
    if ([action isEqualToString:@"Remove"])
        [pageManager removeSelectedElement];
    else if ([action isEqualToString:@"Edit"])
        [pageManager editSelectedElement];
    else if ([action isEqualToString:@"Add Row"])
        [pageManager addRowUnderSelectedElement];
    else if ([action isEqualToString:@"Add Image Gallery"])
        [pageManager addGalleryUnderSelectedElement];
    [self.actionPopover dismissPopoverAnimated:YES];
}

-(void)popoverControllerDidDismissPopover:(UIPopoverController *)popoverController {
    WEPageManager *pageManager = [WEPageManager sharedManager];
    [pageManager deselectSelectedElement];
}



- (void)closeDialog {
    [self.actionPopover dismissPopoverAnimated:YES];
    
    for (UIView *subview in self.view.subviews) {
        if ([subview isKindOfClass:[WEColumnResizeView class]]) {
            [subview removeFromSuperview];
        }
    }
}

-(WEColumnResizeView*)resizeViewAtIndex:(NSInteger)index {
    for (UIView *view in self.view.subviews) {
        if ([view isKindOfClass:[WEColumnResizeView class]]) {
            WEColumnResizeView *resizeView = (WEColumnResizeView*)view;
            if (resizeView.elementIndex == index) {
                return resizeView;
            }
        }
    }
    return NULL;
}

-(void)resizeView:(WEColumnResizeView*)resizeView incrementSpanAtColumnIndex:(NSInteger)columnIndex {
    [[WEPageManager sharedManager] incrementSpanAtColumnIndex:columnIndex withCallback:^(id responseData) {
        [self resetResizeViews:(NSArray*)[responseData objectForKey:@"children"]];
    }];
}

-(void)resizeView:(WEColumnResizeView*)resizeView decrementSpanAtColumnIndex:(NSInteger)columnIndex {
    [[WEPageManager sharedManager] decrementSpanAtColumnIndex:columnIndex withCallback:^(id responseData) {
        [self resetResizeViews:(NSArray*)[responseData objectForKey:@"children"]];
    }];
}

-(void)resizeView:(WEColumnResizeView *)resizeView incrementOffsetAtColumnIndex:(NSInteger)columnIndex {
    [[WEPageManager sharedManager] incrementOffsetAtColumnIndex:columnIndex withCallback:^(id responseData) {
        [self resetResizeViews:(NSArray*)[responseData objectForKey:@"children"]];
    }];
}

-(void)resizeView:(WEColumnResizeView *)resizeView decrementOffsetAtColumnIndex:(NSInteger)columnIndex {
    [[WEPageManager sharedManager] decrementOffsetAtColumnIndex:columnIndex withCallback:^(id responseData) {
        [self resetResizeViews:(NSArray*)[responseData objectForKey:@"children"]];
    }];
}


-(void)resetResizeViews:(NSArray*)columns {
    for (int i = 0; i < columns.count; i++) {
        id columnData = columns[i];
        WEColumnResizeView *resizeView = [self resizeViewAtIndex:i];
        CGRect correctFrame = [WEUtils frameFromData:columnData];
        CGRect newFrame = CGRectMake(correctFrame.origin.x - ICON_DIM/2,
                                     correctFrame.origin.y,
                                     correctFrame.size.width + ICON_DIM,
                                     correctFrame.size.height);
        [resizeView resetFrame:(CGRect)newFrame];
    }
}

-(void)setBackgroundWithInfo:(NSDictionary *)info {
    WEPageManager *pageManager = [WEPageManager sharedManager];    
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    NSString* uuidStr = (NSString *)CFBridgingRelease(CFUUIDCreateString(NULL, uuid));
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"media/BG%@.jpg", uuidStr] withProjectId:self.projectId];
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 1);
    [data writeToFile:mediaPath atomically:NO];
    
    [pageManager setBackgroundImageToPath:mediaPath];
}

-(void)removeBackground {
    [[WEPageManager sharedManager] removeBackgroundImageWithCallback:nil];
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
