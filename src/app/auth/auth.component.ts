import { Component,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './../services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  registrationForm: FormGroup;
  public show: boolean = false;
  public firstName: string = "";
  submitFlag: boolean = false;
  roleValue: string ="USER";
  roleStatus: boolean;
  states: { "stateId": number, "state": string }[] = [];
  citiesList: { "cityId": number, "city": string }[] = [];
  selectedstate: { "stateId": number, "state": string } = { "stateId": -1, "state": "" };
  selectedcity: { "cityId": number, "city": string } = { "cityId": -1, "city": "" };
  requestData: Object = {};
  error = [];
  success;
  @Output() successRegister: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService,
    private fb: FormBuilder,private router:Router,
    private toaster:NotificationService ) { }



  ngOnInit(): void {
    this.initForm();
    this.fetchState();
    this.registrationForm.reset();
  }

  /**... form controller parameter... */
  initForm(): void {
    this.registrationForm = this.fb.group({
      fname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])],
      selectedstate: ['',[ Validators.required]],
      selectedcity: ['', [Validators.required]],
      junkYardName: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$") ]],
      address: ['',[Validators.required]]
    }, {
      validator: this.ConfirmedValidator('password', 'confirmPassword')
    });

  }

  /**.... Validation for input fields... */
  isValidInput(fieldName): boolean {
    return this.registrationForm.controls[fieldName].invalid &&
      (this.registrationForm.controls[fieldName].dirty ||
        this.registrationForm.controls[fieldName].touched);
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
  /**...Junyard owner option toggle... */
  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.roleValue = "JUNK_YARD_OWNER";
    } else {
      this.roleValue = "USER";
    }
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

  /**......Registration service call... */
  onSubmit() {
    this.error = [];

    if (!this.registrationForm.pristine) {
      if (this.registrationForm.valid)
      {

      }else
      {
        //this.validateAllFormFields (this.registrationForm);
        if(this.roleValue=="USER" &&
        (this.registrationForm.controls.address.status== "INVALID" ||
        this.registrationForm.controls.confirmPassword.status=="INVALID"||
        this.registrationForm.controls.email.status== "INVALID" ||
        this.registrationForm.controls.fname.status== "INVALID"||
        this.registrationForm.controls.lastName.status== "INVALID"||
        this.registrationForm.controls.password.status== "INVALID"||
        this.registrationForm.controls.phoneNumber.status== "INVALID"||
        this.registrationForm.controls.selectedcity.status== "INVALID"||
        this.registrationForm.controls.selectedstate.status== "INVALID"||
        this.registrationForm.controls.username.status== "INVALID"||
        this.registrationForm.controls.zipCode.status== "INVALID" ) )
        {
          this.validateAllFormFields (this.registrationForm)
          return;
        }
        this.validateAllFormFields (this.registrationForm);
        if(this.roleValue=="JUNK_YARD_OWNER" &&
        (this.registrationForm.controls.address.status== "INVALID" ||
        this.registrationForm.controls.confirmPassword.status=="INVALID"||
        this.registrationForm.controls.email.status== "INVALID" ||
        this.registrationForm.controls.fname.status== "INVALID"||
        this.registrationForm.controls.junkYardName.status== "INVALID"||
        this.registrationForm.controls.lastName.status== "INVALID"||
        this.registrationForm.controls.password.status== "INVALID"||
        this.registrationForm.controls.phoneNumber.status== "INVALID"||
        this.registrationForm.controls.selectedcity.status== "INVALID"||
        this.registrationForm.controls.selectedstate.status== "INVALID"||
        this.registrationForm.controls.username.status== "INVALID"||
        this.registrationForm.controls.zipCode.status== "INVALID" ) )
        {
          this.validateAllFormFields (this.registrationForm)
          return;
        }

        //this.registrationForm.
      }

    } else {
      this.validateAllFormFields (this.registrationForm)


    return;  }



    /*..InitiLize list of value from thr form..*/
    let data = {
      "username": this.registrationForm.value.username,
      "firstName": this.registrationForm.value.fname,
      "lastName": this.registrationForm.value.lastName,
      "email": this.registrationForm.value.email,
      "password": this.registrationForm.value.password,
      "role": this.roleValue,
      "phoneNumber": this.registrationForm.value.phoneNumber,
      "street": this.registrationForm.value.address,
      "stateId": this.selectedstate.stateId.toString(),
      "cityId": this.selectedcity.cityId.toString(),
      "zipCode": this.registrationForm.value.zipCode
    }

    if (this.show) {
      data['junkYardName'] = this.registrationForm.value.junkYardName;
    }
    const junkYardName = this.registrationForm.value.junkYardName;

    // service request for registration
    this.authService.signup(data).subscribe(
      resData => {
       this.toaster.showSuccess('You have been registered successfully.Please proceed with login','Success')
        this.successRegister.emit(true);
      //  this.router.navigate(['welcome']);
        //  this.isLoading = false;
      },
      errorMessage => {
        this.error = errorMessage;
        this.toaster.showError(errorMessage,'Registration Failure');

        //   this.isLoading = false;
      }
    );
    //  this.registrationForm.reset();
  }

  resetForm(){
    this.registrationForm.reset();
this.error =[];
  }

  /**...State service call...  */
  fetchState() {
    this.authService.getStates().subscribe(data => {
      this.states = data
    });
  }


  onBlurevent(event: any){
    //if( event.value == undefined)
   // this.state.
  }
  /*....Fetch the selected state and call list of city service....*/
  selectChange(event: any) {
   // this.registrationForm.controls.selectedState.reset();
   // this.registrationForm.controls.selectecity.reset();
    this.selectedcity= { "cityId": -1, "city": "" };
    this.registrationForm.controls['selectedcity'].setErrors({required : true});
    this.selectedstate = event.value;
    // let stateId = this.selectedstate.stateId.toString();
    this.authService.getCity(this.selectedstate.stateId).subscribe(data => {
      this.citiesList = data;
    });
  
  // else 
  //   this.selectedstate= { "stateId": "", "state": "" };
  }

  save() {
    this.success = 'Yay! We can save now!'
  }


  // onFormChange(){
  //   if   ( this.registrationForm.valid == true)
  //   this.submitFlag = true;
  //   else
  //   this.submitFlag = false;

  // }
  /*........selected City Value.........*/
  selectCityChange(event: any) {
    this.selectedcity = event.value;
    // let stateId = this.selectedstate.stateId.toString();

  }
}
