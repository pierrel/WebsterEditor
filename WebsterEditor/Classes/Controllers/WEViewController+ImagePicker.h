//
//  WEViewController+ImagePicker.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEWebViewController.h"
#import "WEImagePopoverViewController.h"

@interface WEWebViewController (ImagePicker)<WEImagePopoverControllerDelegate>
- (void)openImagePickerWithData:(id)data withCallback:(WVJBResponseCallback)callback;
-(void)imagePopoverController:(WEImagePopoverViewController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info;
-(void)imagePopoverControllerDidGetDismissed:(WEImagePopoverViewController*)picker;
@end
