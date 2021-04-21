import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormControl} from '@angular/forms';
import { LoginService } from './login.service';
import { ModalService } from './../_modal/modal.service';
import { Router }          from '@angular/router';
import { NotificationService } from './../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error = [];
  responseData;
  @Output() userEmail: EventEmitter<any> = new EventEmitter();
  @Output() userRole: EventEmitter<string> = new EventEmitter();

  constructor(private fb: FormBuilder,private modalService:ModalService,
    private loginService: LoginService,
    private router:Router, private toaster:NotificationService,) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loginForm.reset();

  }

  initForm(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]],
      password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
    (this.loginForm.controls[fieldName].dirty ||
      this.loginForm.controls[fieldName].touched);

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



  login(): void {
    this.error = [];
    this.validateAllFormFields (this.loginForm)

    if (this.loginForm.valid) {
    } else {

    return; }
    const userName = this.loginForm.value.userName;
    const password = this.loginForm.value.password;


    if (!this.loginForm.valid) {
      //  this.error = "Enter the details";
    }
    this.loginService.login(userName, password).subscribe(
      resData => {
        this.toaster.showSuccess('You have been Logged-In successfully.','Success')

        // setting data to session .........
        for (let i = 0; i < resData.Success.length; i++) {
          this.responseData = resData.Success[i];
          window.sessionStorage.setItem("TOKEN",this.responseData.token);
          window.sessionStorage.setItem("ID", this.responseData.id);
          window.sessionStorage.setItem("ROLE", JSON.stringify(this.responseData.role));
          window.sessionStorage.setItem("EMAIL", this.responseData.email);
          window.sessionStorage.setItem("USERNAME", this.responseData.username);

          // Update email on header....
          this.userEmail.emit(this.responseData.username);
          this.userRole.emit(this.responseData.role);

          // reditecting according to the role....
          if(this.responseData.role === "JUNK_YARD_OWNER" || this.responseData.role === "USER"){
            this.router.navigate(['s3-auto/buy-list']);
            this.modalService.close('signUp_modal');
          } else if(this.responseData.role === "ADMIN") {
            this.router.navigate(['tickets']);
            this.modalService.close('signUp_modal');
          } else {
            this.modalService.close('signUp_modal');
            // this.router.navigate(['/s3-auto']);
          }
        }

        //  this.isLoading = false;
      },
      errorMessage => {
        this.toaster.showError(errorMessage,'Error Occured')
        this.error = errorMessage;
        //   this.isLoading = false;
      }
      );
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModal(id: string) {
    this.closeModal('signUp_modal')
    this.modalService.open(id);
  }
}


