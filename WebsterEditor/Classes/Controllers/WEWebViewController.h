//
//  WEViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEActionSelectViewController.h"
#import "WebViewJavascriptBridge.h"
#import "WEColumnResizeView.h"
#import "WEImagePopoverViewController.h"

@interface WEWebViewController : UIViewController <UIWebViewDelegate,WEResizeColumnDelegate,UIPopoverControllerDelegate,WEActionSelectDelegate>
@property (strong, nonatomic) WVJBResponseCallback imagePickerCallback;
@property (strong, nonatomic) UIButton *removeButton;
@property (strong, nonatomic) UIButton *addButton;
@property (strong, nonatomic) UIButton *parentButton;
@property (strong, nonatomic) UIButton *editTextButton;
@property (strong, nonatomic) NSString *projectId;
@property (strong, nonatomic) UIPopoverController *addPopover;
@property (strong, nonatomic) WEActionSelectViewController *addSelectionController;

@property (strong, nonatomic) IBOutlet UIWebView *webView;

-(NSString*)getCurrentPage;
-(NSString*)stringFromCurrentPage;
-(void)loadPage:(NSString*)pageName;
-(void)setBackgroundWithInfo:(NSDictionary *)info;
-(void)removeBackground;
-(void)refresh;
@end

