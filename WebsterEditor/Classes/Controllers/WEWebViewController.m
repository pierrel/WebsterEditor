//
//  WEViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEWebViewController.h"
#import "WEPageManager.h"
#import "UIColor+Expanded.h"
#import "WEColumnResizeView.h"
#import "WEViewController+ImagePicker.h"
#import "WEUtils.h"
#import "WEActionSelectViewController.h"

#import "NSArray+WEExtras.h"

static const int ICON_DIM = 13;

@interface WEWebViewController ()
@property (strong, nonatomic) UIButton *removeButton;
@property (strong, nonatomic) UIButton *addButton;
@property (strong, nonatomic) UIButton *parentButton;
@property (strong, nonatomic) UIButton *editTextButton;
@property (strong, nonatomic) UIButton *styleButton;
@property (strong, nonatomic) UIButton *imageButton;
@property (strong, nonatomic) UIButton *linkButton;
@property (strong, nonatomic) NSString *currentPage;
@property (strong, nonatomic) UINavigationController *navController;
@property (strong, nonatomic) UIPopoverController *stylePopover;
@property (strong, nonatomic) UIPopoverController *linkPopover;
@property (strong, nonatomic) UINavigationController *linkNav;
@property (strong, nonatomic) UINavigationController *styleNav;
@property (strong, nonatomic) WEStyleTableViewController *styleTable;
@property (strong, nonatomic) WELinkViewController *linkTable;
@property (strong, nonatomic) id selectedData;

@property (copy, nonatomic) WVJBResponseCallback linkSelectCallback;

- (void)openDialogWithData:(id)data;
- (void)closeDialog;
- (WEColumnResizeView*)resizeViewAtIndex:(NSInteger)index;
@end

@implementation WEWebViewController
@synthesize  imagePickerCallback, removeButton, addButton, parentButton, editTextButton, styleButton, imageButton, linkButton;

- (void)viewDidLoad
{
    [super viewDidLoad];
    WebViewJavascriptBridge *jsBridge = [WebViewJavascriptBridge bridgeForWebView:self.webView
                                                                  webViewDelegate:self
                                                                          handler:^(id data, WVJBResponseCallback responseCallback) {
        NSLog(@"bridge enabled");
    }];
    [jsBridge registerHandler:@"containerSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        NSLog(@"got %@", data);
        NSArray *classes = (NSArray*)[data objectForKey:@"classes"];
        if (classes && [classes containsString:@"image-thumb"]) {
            [self closeDialog];
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
        if ([fs fileExistsAtPath:path]) {
            [fs removeItemAtPath:[WEUtils pathInDocumentDirectory:path withProjectId:self.projectId] error:&error];
        }
    }];
    
    [jsBridge registerHandler:@"defaultSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self closeDialog];
    }];
    
    [jsBridge registerHandler:@"showLinkButton" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self showLinkButton];
    }];
    [jsBridge registerHandler:@"hideLinkButton" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self hideLinkButton];
    }];
    
    [jsBridge registerHandler:@"linkSelected" handler:^(id data, WVJBResponseCallback responseCallback) {
        NSString *url = (NSString*)[[(NSDictionary*)data objectForKey:@"attrs"] objectForKey:@"href"];
        [self showLinkDialogOver:[WEUtils frameFromData:data] withURLString:url];
        self.linkSelectCallback = responseCallback;
    }];
    
    [jsBridge registerHandler:@"scrolled" handler:^(id data, WVJBResponseCallback responseCallback) {
        if (self.selectedData) [self closeDialog];
    }];

    
    // setup the page manager
    WEPageManager *manager = [WEPageManager sharedManager];
    [manager setBridge:jsBridge];
    
    // add selection
    self.addSelectionController = [[WEActionSelectViewController alloc] init];
    self.addSelectionController.delegate = self;
    
    self.styleTable = [[WEStyleTableViewController alloc] initWithStyle:UITableViewStylePlain];
    self.styleTable.delegate = self;
    
    self.linkTable = [[WELinkViewController alloc] initWithStyle:UITableViewStylePlain];
    self.linkTable.delegate = self;
    
    self.styleNav = [[UINavigationController alloc] initWithRootViewController:self.styleTable];
    
    // popover
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        self.addPopover = [[UIPopoverController alloc] initWithContentViewController:self.addSelectionController];
        self.addPopover.delegate = self;
        [self.addPopover setPopoverContentSize:CGSizeMake(300, 500)];
        
        self.stylePopover =  [[UIPopoverController alloc] initWithContentViewController:self.styleNav];
        self.stylePopover.delegate = self;
        [self.stylePopover setPopoverContentSize:CGSizeMake(300, 500)];
        self.styleTable.parentPopover = self.stylePopover;
        
        self.linkPopover = [[UIPopoverController alloc] initWithContentViewController:self.linkTable];
        self.linkPopover.delegate = self;
        [self.linkPopover setPopoverContentSize:CGSizeMake(300, 500)];
    } else {
        self.navController = [[UINavigationController alloc] initWithRootViewController:self.addSelectionController];
        self.linkNav = [[UINavigationController alloc] initWithRootViewController:self.linkTable];
    }
    
    // Buttons
    self.removeButton = [self buttonWithImageNamed:@"delete.png" withAction:@selector(removeButtonTapped:)];
    [removeButton setHidden:YES];
    [self.view addSubview:removeButton];
    
    self.addButton = [self buttonWithImageNamed:@"add.png" withAction:@selector(addButtonTapped:)];
    [addButton setHidden:YES];
    [self.view addSubview:addButton];
    
    self.parentButton = [self buttonWithImageNamed:@"up.png" withAction:@selector(parentButtonTapped:)];
    [parentButton setHidden:YES];
    [self.view addSubview:parentButton];
    
    self.editTextButton = [self buttonWithImageNamed:@"edit_text.png" withAction:@selector(editTextButtonTapped:)];
    [editTextButton setHidden:YES];
    [self.view addSubview:editTextButton];
    
    self.styleButton = [self buttonWithImageNamed:@"information.png" withAction:@selector(styleButtonTapped:)];
    [styleButton setHidden:YES];
    [self.view addSubview:styleButton];
    
    self.imageButton = [self buttonWithImageNamed:@"add_image.png" withAction:@selector(imageButtonTapped:)];
    [imageButton setHidden:YES];
    [self.view addSubview:imageButton];
    
    self.linkButton = [self buttonWithImageNamed:@"link.png" withAction:@selector(showLinkDialog)];
    [linkButton setHidden:YES];
    [self.view addSubview:linkButton];
}

-(void)loadPage:(NSString*)pageName {
    [UIView animateWithDuration:0.3 animations:^{
        [self.webView setAlpha:0.0];
    }];

    self.currentPage = pageName;
    NSString *indexPath = [WEUtils pathInDocumentDirectory:pageName withProjectId:self.projectId];
#ifndef DEBUG
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:indexPath]]];
#else
    if ([self pageOverHTTP]) { // DEV MODE
        [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000"]]];
    } else {
        [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:indexPath]]];
    }
#endif
    self.webView.keyboardDisplayRequiresUserAction = NO;
}

-(void)currentPageRenamedTo:(NSString *)newName {
    self.currentPage = newName;
}

#pragma mark UIWebViewDelegate

-(void)webViewDidFinishLoad:(UIWebView *)webView {    
    if (![webView isLoading]) {
        if (self.delegate) [self.delegate webViewDidLoad];
        
        [UIView animateWithDuration:0.3 animations:^{
            [self.webView setAlpha:1.0];
        }];
    }
}

-(NSString*)stringFromCurrentPage {
    NSString *html = [self.webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.outerHTML"];
    NSString *document = [NSString stringWithFormat:@"<!DOCTYPE html>%@", html];

    return document;
}

-(NSString*)getCurrentPage {
    return self.currentPage;
}

- (void)openDialogWithData:(id)data {
    [self closeAddController];
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(dialogOpened)])
        [self.delegate dialogOpened];
    [self closeActionButtons];
    self.selectedData = data;
    
    NSDictionary *addables = [data objectForKey:@"addable"];
    NSArray *classes = [data objectForKey:@"classes"];
    NSString *tag = [data objectForKey:@"tag"];
    
    [self positionButtonsWithData:data];
    
    [removeButton setHidden:NO];
    [styleButton setHidden:NO];
    
    if ([addables count] > 0) [addButton setHidden:NO];
    
    if ([classes containsString:@"text-editable"]) [editTextButton setHidden:NO];
    else if ([classes containsString:@"image"]) [imageButton setHidden:NO];
    
    if (![tag isEqualToString:@"BODY"]) [parentButton setHidden:NO];
    
    // let the add popover know
    [self.addSelectionController setData:data];
    
    // remove resizers
    [self removeResizers];
    
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

-(void)positionButtonsWithData:(id)data {
    // position buttons
    CGSize buttonSize = CGSizeMake(40, 40);
    CGRect frame = [WEUtils frameFromData:data];
    CGFloat maxX = self.view.frame.size.width - buttonSize.width;
    CGFloat maxY = self.view.frame.size.height - buttonSize.height;
    
    CGFloat heightOffset = 0;
    if (frame.size.height < buttonSize.height)
        heightOffset = (buttonSize.height - frame.size.height)/2;
    
    removeButton.frame = CGRectMake(MAX(frame.origin.x - (buttonSize.width/2), 0),
                                    MAX(frame.origin.y - (buttonSize.height/2) - heightOffset, 0),
                                    buttonSize.width,
                                    buttonSize.height);
    addButton.frame = CGRectMake(MIN(frame.origin.x + frame.size.width - (buttonSize.width/2), maxX),
                                 MAX(frame.origin.y - (buttonSize.height/2) - heightOffset, 0),
                                 buttonSize.width,
                                 buttonSize.height);
    parentButton.frame = CGRectMake(frame.origin.x + (frame.size.width/2) - (buttonSize.width/2),
                                    MAX(frame.origin.y - buttonSize.height, 0),
                                    buttonSize.width,
                                    buttonSize.height);
    editTextButton.frame = CGRectMake(MAX(frame.origin.x - (buttonSize.width/2), 0),
                                      MIN(frame.origin.y  + frame.size.height - (buttonSize.height/2) + heightOffset, maxY),
                                      buttonSize.width,
                                      buttonSize.height);
    styleButton.frame = CGRectMake(MIN(frame.origin.x + frame.size.width - (buttonSize.width/2), maxX),
                                   MIN(frame.origin.y  + frame.size.height - (buttonSize.height/2) + heightOffset, maxY),
                                   buttonSize.width,
                                   buttonSize.height);
    imageButton.frame = CGRectMake(MAX(frame.origin.x - (buttonSize.width/2), 0),
                                   MIN(frame.origin.y  + frame.size.height - (buttonSize.height/2), maxY),
                                   buttonSize.width,
                                   buttonSize.height);
    linkButton.frame = CGRectMake(MIN(frame.origin.x + (frame.size.width/2) - (buttonSize.width/2), maxX),
                                  MIN(frame.origin.y  + frame.size.height, maxY),
                                  buttonSize.width,
                                  buttonSize.height);

}

-(void)showLinkButton {
    if (self.selectedData) {
        [linkButton setAlpha:0];
        [linkButton setHidden:NO];
        [UIView animateWithDuration:0.2 animations:^{
            [linkButton setAlpha:1];
        }];
    }
}

-(void)hideLinkButton {
    if (![linkButton isHidden]) {
        [UIView animateWithDuration:0.2 animations:^{
            [linkButton setAlpha:1];
        } completion:^(BOOL finished) {
            [linkButton setHidden:YES];
        }];
    }
}

-(void)showLinkDialog {
    [self showLinkDialogOver:self.linkButton.frame withURLString:nil];
}

-(void)showLinkDialogOver:(CGRect)frame withURLString:(NSString*)url {
    if (url) self.linkTable.urlString = url;
    
    if (self.linkPopover) {
        [self.linkPopover presentPopoverFromRect:frame inView:self.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    } else {
        if (self.delegate) [self.delegate webViewControllerPresentViewController:self.linkNav];
    }
}

- (void)closeDialog {
    if (self.delegate && [self.delegate respondsToSelector:@selector(dialogClosed)])
        [self.delegate dialogClosed];
    self.selectedData = nil;
    [self.webView endEditing:YES];
    [self closeActionButtons];
    [[WEPageManager sharedManager] deselectSelectedElement];
    [self removeResizers];
    
    [self closeAddController];
}

-(void)closeAddController {
    if (self.addPopover) {
        [self.addPopover dismissPopoverAnimated:YES];
    } else {
        [self.addSelectionController dismissViewControllerAnimated:YES completion:^{
            NSLog(@"something");
        }];
    }
}

-(void)doToResizers:(WEWithResizer)withResizerCallback {
    NSMutableArray *safeArray = [[NSMutableArray alloc] init];
    for (UIView *subview in self.view.subviews) {
        if ([subview isKindOfClass:[WEColumnResizeView class]]) {
            [safeArray addObject:subview];
        }
    }
    
    for (WEColumnResizeView *resizeView in safeArray) {
        withResizerCallback(resizeView);
    }
}

-(void)removeResizers {
    [self doToResizers:^(WEColumnResizeView *resizeView) {
        [resizeView removeFromSuperview];
    }];
}

-(void)closeActionButtons {
    [removeButton setHidden:YES];
    [addButton setHidden:YES];
    [parentButton setHidden:YES];
    [editTextButton setHidden:YES];
    [styleButton setHidden:YES];
    [imageButton setHidden:YES];
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
    if (self.addPopover) {
        [self.addPopover presentPopoverFromRect:button.frame
                                         inView:self.view
                       permittedArrowDirections:UIPopoverArrowDirectionAny
                                       animated:YES];
    } else {
        if (self.delegate)
            [self.delegate webViewControllerPresentViewController:self.navController];
    }
}

-(void)parentButtonTapped:(UIButton*)button {
    [[WEPageManager sharedManager] selectParentElement];
}

-(void)editTextButtonTapped:(UIButton*)button {
    [[WEPageManager sharedManager] editSelectedElement];
}

-(void)styleButtonTapped:(UIButton*)button {
    [[WEPageManager sharedManager] getSelectedNodeStyleWithCallback:^(id responseData) {
        [self resetNodeStyle:responseData];
        [self showStyleDialogFrom:button];
    }];
}

-(void)resetNodeStyle:(id)responseData {
    NSDictionary *data;
    if ([responseData isKindOfClass:[NSDictionary class]])
        data = (NSDictionary*)responseData;
    else
        data = [NSDictionary dictionary];
    self.styleTable.type = [WEUtils getObjectInDictionary:(NSDictionary*)self.selectedData
                                                 withPath:@"attrs", @"data-type", nil];
    self.styleTable.tag = [WEUtils getObjectInDictionary:(NSDictionary*)self.selectedData withPath:@"tag", nil];
    [self.styleTable setNewStyleData:data];
}

-(void)showStyleDialogFrom:(UIButton*)button {
    if (self.stylePopover) {
        [self.stylePopover presentPopoverFromRect:button.frame
                                           inView:self.view
                         permittedArrowDirections:UIPopoverArrowDirectionAny
                                         animated:YES];
    } else {
        if (self.delegate) {
            [self.delegate webViewControllerPresentViewController:self.styleNav];
        }
    }
}

-(void)imageButtonTapped:(UIButton*)button {
    [self openImagePickerWithData:self.selectedData withCallback:^(id responseData) {
        [[WEPageManager sharedManager] setSrcForSelectedImage:(NSString*)[responseData objectForKey:@"resource-path"]];
    }];
}

-(void)setBackgroundWithInfo:(NSDictionary *)info {
    WEPageManager *pageManager = [WEPageManager sharedManager];    
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    NSString* uuidStr = (NSString *)CFBridgingRelease(CFUUIDCreateString(NULL, uuid));
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"media/BG%@.jpg", uuidStr] withProjectId:self.projectId];
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 1);
    [data writeToFile:mediaPath atomically:NO];
    
    [pageManager setBackgroundImageToPath:mediaPath withCallback:^(id responseData) {
        [self resetNodeStyle:responseData];
    }];
}

-(void)removeBackground {
    [[WEPageManager sharedManager] removeBackgroundImageWithCallback:^(id responseData) {
        [self resetNodeStyle:responseData];
    }];
}

-(void)actionSelect:(WEActionSelectViewController*)actionController didSelectAction:(NSString*)element {
    [[WEPageManager sharedManager] addElementUnderSelectedElement:element];
}

-(BOOL)pageOverHTTP {
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000"]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
                                                       timeoutInterval:10];
    
    [request setHTTPMethod: @"GET"];
    
    NSError *requestError;
    NSURLResponse *urlResponse = nil;
    
    
    NSData *response1 = [NSURLConnection sendSynchronousRequest:request
                                              returningResponse:&urlResponse
                                                          error:&requestError];
    if (response1) {
        return YES;
    } else {
        return NO;
    }
}

-(void)styleResetWithData:(id)data {
    [self positionButtonsWithData:data];
}

-(void)doneWithStyleTableController:(WEStyleTableViewController *)controller {
    if (self.stylePopover) {
        [self.stylePopover dismissPopoverAnimated:YES];
    } else {
        [self.styleNav dismissViewControllerAnimated:YES completion:nil];
    }
}

-(void)linkViewController:(WELinkViewController *)viewController setSelectedTextURL:(NSString *)url {
    if (self.linkSelectCallback) {
        self.linkSelectCallback(url);
        self.linkSelectCallback = nil;
    } else {
        [[WEPageManager sharedManager] setSelectedTextURL:url];
    }
}

-(NSArray*)getPagesForLinkViewController:(WELinkViewController *)viewController {
    if (self.delegate) {
        return [self.delegate getPages];
    } else {
        return nil;
    }
}

-(void)refresh {
    [self closeDialog];
    [self.webView reload];
}

-(void)resetSelectedButtons {
    [[WEPageManager sharedManager] getSelectedElementDataWithCallback:^(id responseData) {
        NSDictionary *el = (NSDictionary*)responseData;
        if ([el count] > 0)
            [self positionButtonsWithData:responseData];
    }];
}

-(UIButton*)buttonWithImageNamed:(NSString*)filename withAction:(SEL)action {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.layer.cornerRadius = 20;
    button.backgroundColor = [UIColor colorWithRed:255 green:255 blue:255 alpha:0.7];
    button.layer.masksToBounds = NO;
    button.layer.shadowColor = [UIColor blackColor].CGColor;
    button.layer.shadowOpacity = 0.5;
    button.layer.shadowRadius = 12;
    button.layer.shadowOffset = CGSizeMake(2.0f, 2.0f);
    [button setImage:[WEUtils tintedImageNamed:filename] forState:UIControlStateNormal];
    [button addTarget:self action:action forControlEvents:UIControlEventTouchUpInside];
    [button.imageView setContentMode:UIViewContentModeCenter];

    return button;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
