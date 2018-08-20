import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FaceRecognitionService} from '../services/face-recognition.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [FaceRecognitionService]
})
export class RegistrationComponent implements OnInit {
  @ViewChild('camera') camera: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('photo') photo: ElementRef;
  registration: FormGroup;
  videoURL = window.URL;
  userId: string;
  userFaceId: string;

  constructor(
    private fb: FormBuilder,
    private msfr: FaceRecognitionService
  ) {
    this.registration = fb.group({
      'lastname': [null, Validators.compose([])],
      'firstname': [null, Validators.compose([])],
      'midname': [null, Validators.compose([])],
      'company': [null, Validators.compose([])],
      'post': [null, Validators.compose([])],
    });
  }

  ngOnInit() {
    this.camera.nativeElement.click();
  }

  onSubmit() {
    this.msfr.createPerson({
      lastName: this.registration.controls['lastname'].value,
      name: this.registration.controls['firstname'].value,
      midName: this.registration.controls['midname'].value,
      company: this.registration.controls['company'].value,
      post: this.registration.controls['post'].value
    }).subscribe(user => {
      this.userId = user['personId'];

      this.msfr.addUserPhoto(this.canvas.nativeElement.toDataURL('image/jpeg'), this.userId)
        .subscribe(result => {
          this.userFaceId = result['persistedFaceId'];
        });
    });
  }

  getVideoStream() {
    // @ts-ignore
    navigator.getMedia = (navigator.getUserMedia ||
      navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] ||
      navigator['msGetUserMedia']);

    // @ts-ignore
    navigator.getMedia(
      {
        video: true
      },
      (stream) => {
        this.camera.nativeElement.src = this.videoURL.createObjectURL(stream);
        this.camera.nativeElement.play();
      },
      (err) => console.log(err.message));
  }

  takePhoto() {
    const context = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.camera.nativeElement, 0, 0);
  }

}
