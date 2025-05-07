import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { UserPhoto } from './UserPhoto';
import { readBlobAsBase64, WebView } from '@capacitor/core/types/core-plugins';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = []

  public async addNewToGallery() {
    //Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    const savedImageFile: any = await this.savePicture(capturedPhoto)

    this.photos.unshift(savedImageFile)
  }

  public async savePicture(photo: Photo) {
    //photo to base64 format
    const base64Data = await this.readAsBase64(photo);

    //write file to the data directory
    const fileName = Date.now() + '.jpeg';
    // const savedFile = await FileSystem.writeFile({
    //   path: fileName,
    //   data: base64Data,
    //   directory: Directory.Data
    // });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory

    return {
      filepath: fileName,
      WebViewPath: photo.webPath
    }
  }

  private async readAsBase64(photo:Photo) {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!)
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })
  constructor() { }
}
