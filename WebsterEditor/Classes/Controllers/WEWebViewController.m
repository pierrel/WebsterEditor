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
@synthesize  imagePickerCallback, removeButton, addButton, parentButton;

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
    
    // add selection
    self.addSelectionController = [[WEActionSelectViewController alloc] init];
    self.addSelectionController.delegate = self;
    
    // popover
    self.addPopover = [[UIPopoverController alloc] initWithContentViewController:self.addSelectionController];
    self.addPopover.delegate = self;
    [self.addPopover setPopoverContentSize:CGSizeMake(300, 500)];
    
    // Buttons
    self.removeButton = [[UIButton alloc] init];
    [removeButton setImage:[UIImage imageNamed:@"delete.png"] forState:UIControlStateNormal];
    [removeButton addTarget:self action:@selector(removeButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [removeButton setHidden:YES];
    [self.view addSubview:removeButton];
    
    self.addButton = [[UIButton alloc] init];
    [addButton setImage:[UIImage imageNamed:@"add.png"] forState:UIControlStateNormal];
    [addButton addTarget:self action:@selector(addButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [addButton setHidden:YES];
    [self.view addSubview:addButton];
    
    self.parentButton = [[UIButton alloc] init];
    [parentButton setImage:[UIImage imageNamed:@"up.png"] forState:UIControlStateNormal];
    [parentButton addTarget:self action:@selector(parentButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [parentButton setHidden:YES];
    [self.view addSubview:parentButton];
    
}

- (void)openDialogWithData:(id)data {
    // position buttons
    CGSize buttonSize = CGSizeMake(25, 25);
    CGRect frame = [WEUtils frameFromData:data];
    
    removeButton.frame = CGRectMake(frame.origin.x - (buttonSize.width/2),
                                    MAX(frame.origin.y - (buttonSize.height/2), 0),
                                    buttonSize.width,
                                    buttonSize.height);
    addButton.frame = CGRectMake(frame.origin.x + frame.size.width - (buttonSize.width/2),
                                 MAX(frame.origin.y - (buttonSize.height/2), 0),
                                 buttonSize.width,
                                 buttonSize.height);
    parentButton.frame = CGRectMake(frame.origin.x + (frame.size.width/2) - (buttonSize.width/2),
                                    MAX(frame.origin.y - buttonSize.height, 0),
                                    buttonSize.width,
                                    buttonSize.height);
    [removeButton setHidden:NO];
    [addButton setHidden:NO];
    [parentButton setHidden:NO];
    
    // let the add popover know
    [self.addSelectionController setData:data];
    
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
    [removeButton setHidden:YES];
    [addButton setHidden:YES];
    [parentButton setHidden:YES];
    
    [self.addPopover dismissPopoverAnimated:YES]; // just in case
    
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

-(void)removeButtonTapped:(UIButton*)button {
    [[WEPageManager sharedManager] removeSelectedElement];
}

-(void)addButtonTapped:(UIButton*)button {
    [self.addPopover presentPopoverFromRect:button.frame
                                     inView:self.view
                   permittedArrowDirections:UIPopoverArrowDirectionAny
                                   animated:YES];
}

-(void)parentButtonTapped:(UIButton*)button{
    [[WEPageManager sharedManager] selectParentElement];
}


-(void)setBackgroundWithInfo:(NSDictionary *)info {
    WEPageManager *pageManager = [WEPageManager sharedManager];    
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    NSString* uuidStr = (NSString *)CFBridgingRelease(CFUUIDCreateString(NULL, uuid));
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"media/BG%@.jpg", uuidStr] withProjectId:self.projectId];
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 0.7);
    [data writeToFile:mediaPath atomically:NO];
    
    [pageManager setBackgroundImageToPath:mediaPath];
}

-(void)removeBackground {
    [[WEPageManager sharedManager] removeBackgroundImageWithCallback:nil];
}

-(void)actionSelect:(WEActionSelectViewController*)actionController didSelectAction:(NSString*)element {
    [[WEPageManager sharedManager] addElementUnderSelectedElement:element];
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
