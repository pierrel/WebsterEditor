//
//  WEViewController+ImagePicker.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController+ImagePicker.h"
#import "WEUtils.h"
#import "WEPageManager.h"

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

- (void)openImagePickerWithData:(id)data withCallback:(WVJBResponseCallback)callback {
    if (callback) self.imagePickerCallback = callback;
    [self setupControllers];
    [self.popoverController presentPopoverFromRect:[WEUtils frameFromData:data]
                                       inView:self.view
                     permittedArrowDirections:UIPopoverArrowDirectionAny
                                     animated:YES];
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    NSString* uuidStr = (NSString *)CFBridgingRelease(CFUUIDCreateString(NULL, uuid));
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@.jpg", uuidStr]];
    
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 1);
    [data writeToFile:mediaPath atomically:NO];
    NSLog(@"resource path: %@", mediaPath);
    if (self.imagePickerCallback) self.imagePickerCallback([NSDictionary dictionaryWithObject:mediaPath
                                                                                       forKey:@"resource-path"]);
    self.imagePickerCallback = nil;    
}

-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
}


@end
