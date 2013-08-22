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
#import "WEStyleTableViewController.h"
#import "WELinkViewController.h"

typedef void (^WEWithResizer)(WEColumnResizeView *resizeView);

@protocol WEWebViewDelegate <NSObject>

-(void)webViewDidLoad;
-(NSArray*)getPages;

@end

@interface WEWebViewController : UIViewController <UIWebViewDelegate,WEResizeColumnDelegate,UIPopoverControllerDelegate,WEActionSelectDelegate,UINavigationControllerDelegate,WEStyleTableViewControllerDelegate,WELinkViewControllerDelegate>
@property (strong, nonatomic) id<WEWebViewDelegate> delegate;
@property (strong, nonatomic) WVJBResponseCallback imagePickerCallback;
@property (strong, nonatomic) id pickerData;
@property (strong, nonatomic) NSString *projectId;
@property (strong, nonatomic) UIPopoverController *addPopover;
@property (strong, nonatomic) WEActionSelectViewController *addSelectionController;

@property (strong, nonatomic) IBOutlet UIWebView *webView;

-(NSString*)getCurrentPage;
-(NSString*)stringFromCurrentPage;
-(void)currentPageRenamedTo:(NSString*)newName;
-(void)loadPage:(NSString*)pageName;
-(void)setBackgroundWithInfo:(NSDictionary *)info;
-(void)removeBackground;
-(void)refresh;
@end

