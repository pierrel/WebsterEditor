//
//  WEViewController+ImagePicker.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"

@interface WEViewController (ImagePicker)
- (void)openImagePickerWithData:(id)data withCallback:(WVJBResponseCallback)callback;
@end
