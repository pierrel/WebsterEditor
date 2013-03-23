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
    
    [jsBridge registerHandler:@"defaultSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self closeDialog];
    }];

    NSString *indexPath = [self setupFiles];
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:indexPath]]];
    //[self.webView loadHTMLString:html baseURL:base];
    self.webView.keyboardDisplayRequiresUserAction = NO;
    
    // setup the page manager
    WEPageManager *manager = [WEPageManager sharedManager];
    [manager setBridge:jsBridge];
    
    // Dialog view
    self.dialogController = [[WEDialogViewController alloc] init];
    [self.view addSubview:self.dialogController.view];
}

- (NSString*)setupFiles {
    NSArray *resources = [NSArray arrayWithObjects:
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"html", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"override", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap.min", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap-responsive.min", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"jquery-1.9.0.min", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap.min", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"rangy", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"js", @"ext", nil], nil];
    NSError *error;
    NSString *indexPath = nil;
    
    for (int i = 0, len = [resources count]; i < len; i++) {
        NSDictionary *fileInfo = [resources objectAtIndex:i];
        NSString *ext = [fileInfo objectForKey:@"ext"];
        NSString *name = [fileInfo objectForKey:@"name"];
        NSString *topLevelPath = ([ext isEqualToString:@"html"] ? @"" : [NSString stringWithFormat:@"%@/", ext]);
        NSString *path = [NSString stringWithFormat:@"/%@%@.%@", topLevelPath, name, ext];
        NSString *fullPath = [WEUtils pathInDocumentDirectory:path];
        
        NSString *contents = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:name
                                                                                                ofType:ext]
                                                       encoding:NSUTF8StringEncoding
                                                          error:&error];
        [contents writeToFile:fullPath
                   atomically:NO
                     encoding:NSStringEncodingConversionAllowLossy
                        error:&error];
        
        if (i == 0) indexPath = fullPath;
    }
    
    return indexPath;
}

- (void)openDialogWithData:(id)data {
    [self.dialogController openWithData:data andConstraints:self.view.frame];
    
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

- (void)closeDialog {
    [self.dialogController close];
    
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
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:@"/media/background.jpg"];
    
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 1);
    [data writeToFile:mediaPath atomically:NO];
    
    [[WEPageManager sharedManager] setBackgroundImageToPath:mediaPath];
}

-(void)removeBackground {
    [[WEPageManager sharedManager] removeBackgroundImage];
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
