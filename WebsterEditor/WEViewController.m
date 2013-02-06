//
//  WEViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"
#import "WEPageManager.h"

@interface WEViewController ()
- (NSString*)html;
- (void)openDialogWithData:(id)data;
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

    NSString *html = [self html];
    NSURL *base = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"]];
    [self.webView loadHTMLString:html baseURL:base];
    
    // setup the page manager
    WEPageManager *manager = [WEPageManager sharedManager];
    [manager setBridge:jsBridge];
    
    // Dialog view
    self.dialogController = [[WEDialogViewController alloc] init];
    [self.view addSubview:self.dialogController.view];
}

- (void)openDialogWithData:(id)data {
    [self.dialogController openWithData:data andConstraints:self.view.frame];
}

- (NSString*)html {
    // do htmly stuff
    NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"];
    NSString *bootstrapFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"css"];
    NSString *bootstrapResponsiveFile = [[NSBundle mainBundle] pathForResource:@"bootstrap-responsive.min" ofType:@"css"];
    NSString *jQueryFile = [[NSBundle mainBundle] pathForResource:@"jquery-1.9.0.min" ofType:@"js"];
    NSString *bootstrapJSFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"js"];
    NSString *customJSFile = [[NSBundle mainBundle] pathForResource:@"custom" ofType:@"js"];
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
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[customJS]]" withString:@""];
    
    return finalHTML;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
