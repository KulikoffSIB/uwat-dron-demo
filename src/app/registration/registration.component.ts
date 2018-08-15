import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registration: FormGroup;

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

}
