import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  registrationForm: FormGroup;
  public show: boolean = false;
  public firstName: string = "";
  yearStateFlag: boolean = false;
  roleValue: string ="USER";
  roleStatus: boolean;
  states: { "stateId": number, "state": string }[] = [];
  citiesList: { "cityId": number, "city": string }[] = [];
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedcity: { "cityId": string, "city": string } = { "cityId": "*", "city": "" };
  requestData: Object = {};
  error = [];

  constructor(private authService: AuthService, private fb: FormBuilder) { }



  ngOnInit(): void {
    this.initForm();
    this.fetchState();
  }

  /**... form controller parameter... */
  initForm(): void {
    this.registrationForm = this.fb.group({
      fname: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      username: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])],
      selectedstate: ['', Validators.required],
      selectedcity: ['', Validators.required],
      junkYardName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{5}$")]],
      address: ['', Validators.required],
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
    console.log(this.roleValue);
  }

  /**......Registration service call... */
  onSubmit() {
    this.error = [];
    // if (!this.registrationForm.valid) {
    //   return;
    // }

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
        console.log(resData);
        //  this.isLoading = false;
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        //   this.isLoading = false;
      }
    );


    //  this.registrationForm.reset();
  }

  resetForm(){
    this.registrationForm.reset();
  }

  /**...State service call...  */
  fetchState() {
    this.authService.getStates().subscribe(data => {
      this.states = data
    });
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
  }

  /*........selected City Value.........*/
  selectCityChange(event: any) {
    console.log("selected City", event.value);
    this.selectedcity = event.value;
    console.log("selectedstate option", this.selectedcity.city);
    // let stateId = this.selectedstate.stateId.toString();

  }
}