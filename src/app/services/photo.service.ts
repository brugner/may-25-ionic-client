import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Photo } from '../models/users/photo.model';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';

@Injectable({ providedIn: 'root' })
export class PhotoService {

  constructor(private camera: Camera, private alertCtrl: AlertController) {

  }

  async takePhotoWithCamera(): Promise<Photo> {
    return await this.takePhoto(true);
  }

  async takePhotoFromGallery(): Promise<Photo> {
    return await this.takePhoto(false);
  }

  private async takePhoto(camera: boolean): Promise<Photo> {
    const options: CameraOptions = {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: camera ? PictureSourceType.CAMERA : PictureSourceType.PHOTOLIBRARY
    };

    return await this.camera.getPicture(options).then((imageData) => {
      const photo = new Photo();
      photo.base64 = 'data:image/jpeg;base64,' + imageData;

      return photo;
    }, (err) => {
      console.log('err', err);
      return new Photo();
    });
  }
}
