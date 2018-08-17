import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @ViewChild('camera') camera: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('photo') photo: ElementRef;
  registration: FormGroup;
  videoURL = window.URL;

  constructor(
    private fb: FormBuilder
  ) {
    this.registration = fb.group({
      'lastname': [null, Validators.compose([Validators.required])],
      'firstname': [null, Validators.compose([Validators.required])],
      'middlename': [null, Validators.compose([Validators.required])],
      'company': [null, Validators.compose([Validators.required])],
      'post': [null, Validators.compose([Validators.required])],
      'phone': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.registration.valid);
    console.log(this.registration.controls.name.value);
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
    this.photo.nativeElement.src = this.canvas.nativeElement.toDataURL();
  }
}
