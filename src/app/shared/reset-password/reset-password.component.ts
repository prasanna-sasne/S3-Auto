import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { Router,ActivatedRoute }   from '@angular/router';
import {ResetService} from './reset-password.service'
import { NotificationService } from './../../services/notification.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  error = [];
  responseData;
  token;

  constructor(private fb: FormBuilder, private resetService:ResetService,
     private router:Router,private toaster:NotificationService,
     private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route
    .queryParams.subscribe(params =>{
      this.token=params['token'];
    }
      );
    this.initForm();
  }

  initForm(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },{
      validator: this.ConfirmedValidator('password', 'confirmPassword')
    } );
  }

  isValidInput(fieldName): boolean {
    return this.resetForm.controls[fieldName].invalid &&
      (this.resetForm.controls[fieldName].dirty ||
        this.resetForm.controls[fieldName].touched);

  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  resetPassword(): void {
    this.validateAllFormFields (this.resetForm)

    if (this.resetForm.valid) {
    } else {

    return; }
    this.error = [];
    const url = new URL(window.location.href);
    //this.token = url.searchParams.get('token');
    const password = this.resetForm.value.password;
    var formData: any = new FormData();
    formData.append('password', password);
    formData.append('token', this.token);


    // if (!this.resetForm.valid) {
    //   //  this.error = "Enter the details";
    // }
    this.resetService.resetPassword(formData).subscribe(
      resData => {
        this.toaster.showSuccess('Your password has been successfully updated. You are being redirected to home page','Updated Successfully')
        this.redirectHomePage();
        // setting data to session .........
      },
      errorMessage => {
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
