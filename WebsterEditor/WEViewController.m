//
//  WEViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 1/29/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"

@interface WEViewController ()
- (NSString*)html;
@end

@implementation WEViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSString *html = [self html];
    NSURL *base = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"]];
    [self.webView loadHTMLString:html baseURL:base];
}

- (NSString*)html {
    // do htmly stuff
    NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"starter" ofType:@"html"];
    NSString *bootstrapFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"css"];
    NSString *bootstrapResponsiveFile = [[NSBundle mainBundle] pathForResource:@"bootstrap-responsive.min" ofType:@"css"];
    NSString *jQueryFile = [[NSBundle mainBundle] pathForResource:@"jquery-1.9.0.min" ofType:@"js"];
    NSString *bootstrapJSFile = [[NSBundle mainBundle] pathForResource:@"bootstrap.min" ofType:@"js"];
    
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
    NSString *finalHTML = [NSString stringWithContentsOfFile:htmlFile
                                                    encoding:NSUTF8StringEncoding
                                                       error:nil];
    
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapCSS]]"
                                                     withString:[NSString stringWithFormat:@"<style type=\"text/css\">\n%@\n</style>", bootstrap]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapResponsiveCSS]]"
                                                     withString:[NSString stringWithFormat:@"<style type=\"text/css\">\n%@\n</style>", bootstrapResponsive]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[jqueryJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@\n</script>", jQuery]];
    finalHTML = [finalHTML stringByReplacingOccurrencesOfString:@"[[bootstrapJS]]"
                                                     withString:[NSString stringWithFormat:@"<script type=\"text/javascript\">\n%@\n</script>", bootstrapJS]];
    
    return finalHTML;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
