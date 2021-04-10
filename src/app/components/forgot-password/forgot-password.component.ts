import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormControl} from '@angular/forms';
import { ModalService } from './../../_modal/modal.service';
import { first, finalize } from 'rxjs/operators';
import {ForgotPasswordService} from './forgot-password.service';
import { Router,ActivatedRoute }   from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPwform: FormGroup;
  loading = false;
  submitted = false;
  error:String;
  mailSentMessage:String;
  constructor( private formBuilder: FormBuilder,private modalService:ModalService,
    private forgotPasswordService:ForgotPasswordService,private router:Router) { }

  ngOnInit(): void {
    this.forgotPwform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
  });
  }
  get f() { return this.forgotPwform.controls; }

  isValidInput(fieldName): boolean {
    return this.forgotPwform.controls[fieldName].invalid &&
      (this.forgotPwform.controls[fieldName].dirty ||
        this.forgotPwform.controls[fieldName].touched);
  }

closeModal (modalId) {
  this.modalService.close(modalId);

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

onSubmit(){


  if (this.forgotPwform.valid) {
    console.log('form submitted');
  } else {
    console.log(this.forgotPwform.valid);
    this.validateAllFormFields (this.forgotPwform)

  return;  }
  const email = this.forgotPwform.value.email;
  var formData: any = new FormData();
  formData.append('email', email);
  // formData.append("email", this.form.get('name').value);
  this.forgotPasswordService.forgotPw(formData).subscribe(
    resData => {
      console.log("resData", resData);
this.mailSentMessage ="We have sent a reset password link to your email. Please Check"

    },
    errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
      //   this.isLoading = false;
    }
  );
}

// redirectHomePage() {
//   this.router.navigate(['/welcome']);
// }

}
