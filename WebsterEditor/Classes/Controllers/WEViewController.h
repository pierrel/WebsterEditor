//
//  WEViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEDialogViewController.h"
#import "WebViewJavascriptBridge.h"
#import "WEColumnResizeView.h"

@interface WEViewController : UIViewController <UIWebViewDelegate,WEResizeColumnDelegate>
@property (strong, nonatomic) WEDialogViewController *dialogController;

@property (strong, nonatomic) IBOutlet UIWebView *webView;
@end

