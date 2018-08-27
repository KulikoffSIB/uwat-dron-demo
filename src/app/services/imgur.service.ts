import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgurService {
  secret: string;

  constructor(private http: HttpClient) {
    this.secret = 'c50f473fe51b67a2a8f0ceab8902fbd758c8ddb5';
  }

  uploadPersonImage(base64image: string): Observable<any> {
    return this.http.post('https://api.imgur.com/3/image', {
      image: base64image.split(';base64,')[1],
      type: 'base64'
    }, {
      headers: {
        'Authorization': 'Client-ID 2a1c5a5fbcbef50'
      }
    });
  }
}
