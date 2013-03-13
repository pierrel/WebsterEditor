//
//  WEViewController+ImagePicker.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController+ImagePicker.h"
#import "WEUtils.h"

@implementation WEViewController (ImagePicker)

-(void) setupControllers {
    if (!self.imagePicker) {
        self.imagePicker = [[UIImagePickerController alloc] init];
        self.imagePicker.delegate = self;
        [self.imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
    }
    if (!self.popoverController) {
        self.popoverController = [[UIPopoverController alloc] initWithContentViewController:self.imagePicker];
    }
    
}

- (void)openImagePickerWithData:(id)data {
    [self setupControllers];
    [self.popoverController presentPopoverFromRect:[WEUtils frameFromData:data]
                                       inView:self.view
                     permittedArrowDirections:UIPopoverArrowDirectionAny
                                     animated:YES];
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    NSLog(@"%@", info);
}

-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    NSLog(@"canceled!");
}


@end
