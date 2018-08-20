import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  key: string;
  MSFR_API_HOST: string;

  constructor(private http: HttpClient) {
    this.key = 'c4117f4506b34793a16df70be1003b23';
    this.MSFR_API_HOST = 'https://northeurope.api.cognitive.microsoft.com/face/v1.0/';
  }

  detect() {
    this.http.post(this.MSFR_API_HOST, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.key
      }
    }).subscribe(res => {
      console.log(res);
    });
  }

  // создание пользователя в группе
  createPerson(user: {
    name: string;
    midName: string;
    lastName: string;
    company: string
    post: string;
  }): Observable<any> {
    return this.http.post(this.MSFR_API_HOST + 'persongroups/1534/persons', {
      name: 'copterDemoPerson',
      userData: JSON.stringify(user)
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.key
      }
    });
  }

  // добавление фото для пользователя по id пользователя
  addUserPhoto(base64img: string, userId: string): Observable<any> {
    return this.http.post(this.MSFR_API_HOST + 'persongroups/1534/persons/' + userId + '/persistedFaces',
      this.convertToBLOB(base64img),
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': this.key
        }
      });
  }

  // конвертация Base64 картинки в бинарные данные
  convertToBLOB(dataURL: string): any {
    const decodedImg = window.atob(dataURL.split(';base64,')[1]);
    const imgLength = decodedImg.length;
    const uInt8Array = new Uint8Array(imgLength);

    for (let i = 0; i < imgLength; ++i) {
      uInt8Array[i] = decodedImg.charCodeAt(i);
    }

    return new Blob([uInt8Array]);
  }
}
