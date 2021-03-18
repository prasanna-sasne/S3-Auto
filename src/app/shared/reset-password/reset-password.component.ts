import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute }   from '@angular/router';
import {ResetService} from './reset-password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  error = [];
  responseData;

  constructor(private fb: FormBuilder, private resetService:ResetService,
     private router:Router) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.resetForm = this.fb.group({
      confirmPassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]],
      password: ['', Validators.required]
    },{
      validator: this.ConfirmedValidator('password', 'confirmPassword')
    } );
  }

  isValidInput(fieldName): boolean {
    return this.resetForm.controls[fieldName].invalid &&
      (this.resetForm.controls[fieldName].dirty ||
        this.resetForm.controls[fieldName].touched);

  }

  resetPassword(): void {
    this.error = [];
    const url = new URL(window.location.href);
    console.log(url.searchParams.get('token'));
    let token = url.searchParams.get('token');
    const password = this.resetForm.value.password;
    var formData: any = new FormData();
    formData.append('password', password);
    formData.append('token', token);


    // if (!this.resetForm.valid) {
    //   //  this.error = "Enter the details";
    // }
    this.resetService.resetPassword(formData).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        //   this.isLoading = false;
      }
    );
  }

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

redirectHomePage() {
  this.router.navigate(['/welcome']);
}

}
