//
//  WEViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"
#import "WEPageManager.h"
#import "WEColumnResizeView.h"

static const int ICON_DIM = 13;

@interface WEViewController ()
- (NSString*)html;
- (void)openDialogWithData:(id)data;
- (void)closeDialog;
@end

@implementation WEViewController

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
        [self openDialogWithData:data];
    }];
    
    [jsBridge registerHandler:@"defaultSelectedHandler" handler:^(id data, WVJBResponseCallback responseCallback) {
        [self closeDialog];
    }];

    NSString *html = [self html];
    NSURL *base = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"]];
    [self.webView loadHTMLString:html baseURL:base];
    self.webView.keyboardDisplayRequiresUserAction = NO;
    
    // setup the page manager
    WEPageManager *manager = [WEPageManager sharedManager];
    [manager setBridge:jsBridge];
    
    // Dialog view
    self.dialogController = [[WEDialogViewController alloc] init];
    [self.view addSubview:self.dialogController.view];
}

- (void)openDialogWithData:(id)data {
    [self.dialogController openWithData:data andConstraints:self.view.frame];
    
    // add resizers if any
    NSArray *children = [data objectForKey:@"children"];
    if (children) {
        for (int i = 0; i < children.count; i++) {
            id childData = [children objectAtIndex:i];
            CGFloat left = [[childData objectForKey:@"left"] floatValue];
            CGFloat top = [[childData objectForKey:@"top"] floatValue];
            CGFloat width = [[childData objectForKey:@"width"] floatValue];
            CGFloat height = [[childData objectForKey:@"height"] floatValue];
            
            CGRect columnFrame = CGRectMake(left - ICON_DIM/2,
                                            top,
                                            width + ICON_DIM,
                                            height);
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

- (NSString*)html {
    // do htmly stuff
    NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"];
    NSString *bootstrapFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"css"];
    NSString *bootstrapResponsiveFile = [[NSBundle mainBundle] pathForResource:@"bootstrap-responsive.min" ofType:@"css"];
    NSString *jQueryFile = [[NSBundle mainBundle] pathForResource:@"jquery-1.9.0.min" ofType:@"js"];
    NSString *bootstrapJSFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"js"];
    NSString *customJSFile = [[NSBundle mainBundle] pathForResource:@"custom" ofType:@"js"];
    NSString *rangyJSFile = [[NSBundle mainBundle] pathForResource:@"rangy" ofType:@"js"];
    NSString *customCSSFile = [[NSBundle mainBundle] pathForResource:@"custom" ofType:@"css"];
    
    NSString *bootstrapJS = [NSString stringWithContentsOfFile:bootstrapJSFile
                                                      encoding:NSUTF8StringEncoding
                                                         error:nil];
    NSString *jQuery = [NSString stringWithContentsOfFile:jQueryFile
                                                 encoding:NSUTF8StringEncoding
                                                    error:nil];
    NSString *bootstrap = [NSString stringWithContentsOfFile:bootstrapFile
                                                    encoding:NSUTF8StringEncoding
                                                       error:nil];
    NSString *bootstrapResponsive = [NSString stringWithContentsOfFile:bootstrapResponsiveFile
                                                              encoding:NSUTF8StringEncoding
                                                                 error:nil];
    NSString *customJS = [NSString stringWithContentsOfFile:customJSFile encoding:NSUTF8StringEncoding error:nil];
    NSString *rangyJS = [NSString stringWithContentsOfFile:rangyJSFile encoding:NSUTF8StringEncoding error:nil];
    NSString *customCSS = [NSString stringWithContentsOfFile:customCSSFile encoding:NSUTF8StringEncoding error:nil];
    
    NSString *finalHTML = [NSString stringWithContentsOfFile:htmlFile
                                                    encoding:NSUTF8StringEncoding
                                                       error:nil];
    
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapCSS]]"
                                                     withString:[NSString stringWithFormat:@"<style type=\"text/css\">\n%@\n</style>", bootstrap]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapResponsiveCSS]]"
                                                     withString:[NSString stringWithFormat:@"<style type=\"text/css\">\n%@\n</style>", bootstrapResponsive]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[customCSS]]"
                                                     withString:[NSString stringWithFormat:@"<style type=\"text/css\">\n%@\n</style>", customCSS]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[jqueryJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@\n</script>", jQuery]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@\n</script>", bootstrapJS]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[customJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@</script>", customJS]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[rangyJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@</script>", rangyJS]];

    
    return finalHTML;
}

-(void)resizeView:(WEColumnResizeView*)resizeView incrementSpanAtColumnIndex:(NSInteger)columnIndex {
    [[WEPageManager sharedManager] incrementSpanAtColumnIndex:columnIndex withCallback:^(id responseData) {
        NSLog(@"got something %@", responseData);
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
