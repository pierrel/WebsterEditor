//
//  WEUtils.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEUtils.h"

@implementation WEUtils
+ (NSString*)html {
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

+ (CGRect)frameFromData:(id)data {
    CGFloat left = [[data objectForKey:@"left"] floatValue];
    CGFloat top = [[data objectForKey:@"top"] floatValue];
    CGFloat width = [[data objectForKey:@"width"] floatValue];
    CGFloat height = [[data objectForKey:@"height"] floatValue];
    
    return CGRectMake(left,
                      top,
                      width,
                      height);
}
@end
