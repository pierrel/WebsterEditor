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
        if ([classes containsString:@"image-thumb"]) {
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
        [fs removeItemAtPath:[WEUtils pathInDocumentDirectory:path withProjectId:self.projectId] error:&error];
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
        NSLog(@"got it!: %@", data);
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
    
    // popover
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        self.addPopover = [[UIPopoverController alloc] initWithContentViewController:self.addSelectionController];
        self.addPopover.delegate = self;
        [self.addPopover setPopoverContentSize:CGSizeMake(300, 500)];
        
        self.stylePopover =  [[UIPopoverController alloc] initWithContentViewController:self.styleTable];
        self.stylePopover.delegate = self;
        [self.stylePopover setPopoverContentSize:CGSizeMake(300, 500)];
        
        self.linkPopover = [[UIPopoverController alloc] initWithContentViewController:self.linkTable];
        self.linkPopover.delegate = self;
        [self.linkPopover setPopoverContentSize:CGSizeMake(300, 500)];
    } else {
        self.navController = [[UINavigationController alloc] initWithRootViewController:self.addSelectionController];
        self.styleNav = [[UINavigationController alloc] initWithRootViewController:self.styleTable];
        self.linkNav = [[UINavigationController alloc] initWithRootViewController:self.linkTable];
    }
    
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
    
    self.editTextButton = [[UIButton alloc] init];
    [editTextButton setImage:[UIImage imageNamed:@"edit_text.png"] forState:UIControlStateNormal];
    [editTextButton addTarget:self action:@selector(editTextButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [editTextButton setHidden:YES];
    [self.view addSubview:editTextButton];
    
    self.styleButton = [[UIButton alloc] init];
    [styleButton setImage:[UIImage imageNamed:@"information.png"] forState:UIControlStateNormal];
    [styleButton addTarget:self action:@selector(styleButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [styleButton setHidden:YES];
    [self.view addSubview:styleButton];
    
    self.imageButton = [[UIButton alloc] init];
    [imageButton setTitle:@"📷" forState:UIControlStateNormal];
    [imageButton addTarget:self action:@selector(imageButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    [imageButton setHidden:YES];
    [self.view addSubview:imageButton];
    
    self.linkButton = [[UIButton alloc] init];
    [linkButton setTitle:@"🔗" forState:UIControlStateNormal];
    [linkButton addTarget:self action:@selector(showLinkDialog) forControlEvents:UIControlEventTouchUpInside];
    [linkButton setHidden:YES];
    [self.view addSubview:linkButton];
}

-(void)loadPage:(NSString*)pageName {
    [UIView animateWithDuration:0.3 animations:^{
        [self.webView setAlpha:0.0];
    }];

    self.currentPage = pageName;
    NSString *indexPath = [WEUtils pathInDocumentDirectory:pageName withProjectId:self.projectId];
    if ([self pageOverHTTP]) { // DEV MODE
        [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000"]]];
    } else {
        [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:indexPath]]];
    }
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
    [self closeActionButtons];
    self.selectedData = data;
    
    NSDictionary *addables = [data objectForKey:@"addable"];
    NSArray *classes = [data objectForKey:@"classes"];
    
    [self positionButtonsWithData:data];
    
    [removeButton setHidden:NO];
    [parentButton setHidden:NO];
    [styleButton setHidden:NO];
    
    if ([addables count] > 0) [addButton setHidden:NO];
    
    if ([classes containsString:@"text-editable"]) [editTextButton setHidden:NO];
    else if ([classes containsString:@"image"]) [imageButton setHidden:NO];
    
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

-(void)positionButtonsWithData:(id)data {
    // position buttons
    CGSize buttonSize = CGSizeMake(25, 25);
    CGRect frame = [WEUtils frameFromData:data];
    CGFloat maxX = self.view.frame.size.width - buttonSize.width;
    CGFloat maxY = self.view.frame.size.height - buttonSize.height;
    
    removeButton.frame = CGRectMake(MAX(frame.origin.x - (buttonSize.width/2), 0),
                                    MAX(frame.origin.y - (buttonSize.height/2), 0),
                                    buttonSize.width,
                                    buttonSize.height);
    addButton.frame = CGRectMake(MIN(frame.origin.x + frame.size.width - (buttonSize.width/2), maxX),
                                 MAX(frame.origin.y - (buttonSize.height/2), 0),
                                 buttonSize.width,
                                 buttonSize.height);
    parentButton.frame = CGRectMake(frame.origin.x + (frame.size.width/2) - (buttonSize.width/2),
                                    MAX(frame.origin.y - buttonSize.height, 0),
                                    buttonSize.width,
                                    buttonSize.height);
    editTextButton.frame = CGRectMake(MAX(frame.origin.x - (buttonSize.width/2), 0),
                                      MIN(frame.origin.y  + frame.size.height - (buttonSize.height/2), maxY),
                                      buttonSize.width,
                                      buttonSize.height);
    styleButton.frame = CGRectMake(MIN(frame.origin.x + frame.size.width - (buttonSize.width/2), maxX),
                                   MIN(frame.origin.y  + frame.size.height - (buttonSize.height/2), maxY),
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
    if (self.linkPopover) {
        [self.linkPopover presentPopoverFromRect:self.linkButton.frame inView:self.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    } else {
        [self presentViewController:self.linkNav animated:YES completion:^{
            NSLog(@"done with link nav");
        }];
    }
}

- (void)closeDialog {
    self.selectedData = nil;
    [self.webView endEditing:YES];
    [self closeActionButtons];
    
    if (self.addPopover) {
        [self.addPopover dismissPopoverAnimated:YES]; // just in case
    } else {
        [self.addSelectionController dismissViewControllerAnimated:YES completion:^{
            NSLog(@"something");
        }];
    }
    
    for (UIView *subview in self.view.subviews) {
        if ([subview isKindOfClass:[WEColumnResizeView class]]) {
            [subview removeFromSuperview];
        }
    }
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
        [self presentViewController:self.navController animated:YES completion:^{
            NSLog(@"showing add selection");
        }];
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
        NSDictionary *data;
        if ([responseData isKindOfClass:[NSDictionary class]])
            data = (NSDictionary*)responseData;
        else
            data = [NSDictionary dictionary];
        [self.styleTable setNewStyleData:data];
        if (self.stylePopover) {
            [self.stylePopover presentPopoverFromRect:button.frame
                                               inView:self.view
                             permittedArrowDirections:UIPopoverArrowDirectionAny
                                             animated:YES];
        } else {
            [self presentViewController:self.styleNav animated:YES completion:^{
                NSLog(@"showing style edit");
            }];
        }
    }];
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
    
    [pageManager setBackgroundImageToPath:mediaPath];
}

-(void)removeBackground {
    [[WEPageManager sharedManager] removeBackgroundImageWithCallback:nil];
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

-(void)linkViewController:(WELinkViewController *)viewController setSelectedTextURL:(NSString *)url {
    [[WEPageManager sharedManager] setSelectedTextURL:url];
}

-(void)refresh {
    [self closeDialog];
    [self.webView reload];
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
