import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FaceRecognitionService} from '../services/face-recognition.service';
import {ImgurService} from '../services/imgur.service';


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
  photoLimit = 6;
  validPhotos = [];
  photoshooting = false;
  base64image: string;
  imgURL: string;
  userId: string;
  userFaceId: string;
  faceError: string;
  emptyCanvasImg: string;
  noPhoto = true;
  success = false;
  isFace: boolean;
  tooManyFaces: boolean;

  constructor(
    private fb: FormBuilder,
    private msfr: FaceRecognitionService,
    private imgur: ImgurService
  ) {
    this.registration = fb.group({
      'lastname': [null, Validators.compose([Validators.required])],
      'firstname': [null, Validators.compose([Validators.required])],
      'midname': [null, Validators.compose([Validators.required])],
      'company': [null, Validators.compose([])],
      'post': [null, Validators.compose([])],
    });
  }

  ngOnInit() {
    this.camera.nativeElement.click();
    this.emptyCanvasImg = this.canvas.nativeElement.toDataURL();
  }

  onSubmit() {
    if (this.emptyCanvasImg === this.canvas.nativeElement.toDataURL()) {
      this.noPhoto = true;
    } else {
      this.noPhoto = false;
      this.msfr.createPerson({
        lastName: this.registration.controls['lastname'].value,
        name: this.registration.controls['firstname'].value,
        midName: this.registration.controls['midname'].value,
        company: this.registration.controls['company'].value,
        post: this.registration.controls['post'].value,
        imgURL: this.imgURL
      }).subscribe(user => {
        this.userId = user['personId'];
        let attachedPhoto = 0;

        this.validPhotos.forEach((base64Image) => {
          this.msfr.addUserPhoto(base64Image, this.userId).subscribe(
            result => {
              this.userFaceId = result['persistedFaceId'];
              attachedPhoto++;
            },
            error => {
              this.faceError = error.message;
            },
            () => {
              if (attachedPhoto === this.photoLimit) {
                this.msfr.trainByGroup().subscribe(() => {
                  this.validPhotos = [];
                  this.registration.reset();
                  this.canvas.nativeElement.getContext('2d').clearRect(0, 0, 640, 480);
                  this.isFace = undefined;
                });
              }
            });
        });
      });
    }
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
    this.noPhoto = false;
    this.photoshooting = true;
    const context = this.canvas.nativeElement.getContext('2d');
    let counter = 1;

    const photoTimer = setInterval(() => {
      if (counter === this.photoLimit) {
        clearInterval(photoTimer);
        this.imgur.uploadPersonImage(this.base64image).subscribe(imageData => {
          this.imgURL = imageData.data.link;
          this.photoshooting = false;
        });
      }

      context.drawImage(this.camera.nativeElement, 0, 0);
      this.base64image = this.canvas.nativeElement.toDataURL('image/jpeg');

      this.msfr.detect(this.base64image).subscribe(res => {
        switch (res.length) {
          case 1:
            this.isFace = true;
            this.tooManyFaces = false;
            this.validPhotos.push(this.base64image);
            counter++;
            break;
          case 0:
            this.isFace = false;
            this.tooManyFaces = false;
            break;
          default:
            this.isFace = false;
            this.tooManyFaces = true;
            break;
        }
      });
    }, 1000);
  }

}
