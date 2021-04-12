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
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedcity: { "cityId": string, "city": string } = { "cityId": "*", "city": "" };
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
      fname: ['', [Validators.required  ]],
      password: ['', [Validators.required,  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])],
      selectedstate: ['',[ Validators.required]],
      selectedcity: ['', [Validators.required]],
      junkYardName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$") ]],
      address: ['', Validators.required]
    }, {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
      updateOn: 'blur'
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
    console.log(this.roleValue);
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
    debugger;
    this.error = [];

    if (!this.registrationForm.pristine) {
      if (this.registrationForm.valid)
      {
        console.log('form submitted');

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
        console.log('form submitted');

        //this.registrationForm.
      }

    } else {
      this.validateAllFormFields (this.registrationForm)

      console.log(this.registrationForm.valid);

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
    console.log(data);
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
        console.log("test error ",errorMessage);
        this.error = errorMessage;
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

    console.log("selected State", event.value);
    this.selectedstate = event.value;
    console.log("selectedstate option", this.selectedstate.stateId);
    // let stateId = this.selectedstate.stateId.toString();
    this.authService.getCity(this.selectedstate.stateId).subscribe(data => {
      this.citiesList = data;
      console.log(data);
    });
  
  // else 
  //   this.selectedstate= { "stateId": "", "state": "" };
  }

  save() {
    console.log('Now we can save');
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
    console.log("selected City", event.value);
    this.selectedcity = event.value;
    console.log("selectedstate option", this.selectedcity.city);
    // let stateId = this.selectedstate.stateId.toString();

  }
}
