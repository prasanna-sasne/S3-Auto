import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UpdateProfileService } from './update-profile.service';
import { Router } from '@angular/router';
import { NotificationService } from './../../services/notification.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})


export class UpdateProfileComponent {
  updateProfileForm: FormGroup;
  public show: boolean = false;
  public firstName: string = "";
  yearStateFlag: boolean = false;
  roleValue: string = "USER";
  roleStatus: boolean;
  states: { "stateId": number, "state": string }[] = [];
  citiesList: { "cityId": number, "city": string }[] = [];
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedcity: { "cityId": string, "city": string } = { "cityId": "*", "city": "" };
  requestData: Object = {};
  error = [];
  private oldProfileData = [];
  
  constructor(private updateProfileService: UpdateProfileService, private fb: FormBuilder, private router: Router, private toaster: NotificationService,) { }



  ngOnInit(): void {
    this.initForm();
    this.updateProfileService.getUserData().subscribe(
      resData => {
        this.oldProfileData = resData;
        this.setForm(resData);
        //  this.isLoading = false;
        this.fetchState();
      },
      errorMessage => {
        this.error = errorMessage;
        //   this.isLoading = false;
      }
      );
  }

  setForm(result): void {
    if (result.role == "USER") {
      this.updateProfileForm.patchValue({
        fname: result.firstName,
        password: '',
        confirmPassword: '',
        lastName: result.lastName,
        username: result.username,
        phoneNumber: result.phone,
        email: result.email,
        show: false,
        selectedstate: result.stateId,
        selectedcity: result.cityId,
        //junkYardName: result.junkYardName,
        zipCode: result.zip,
        address: result.street,
      });
      this.updateProfileForm.removeControl('junkYardName');
      this.setRole(false);
    }
    else {
      this.updateProfileForm.patchValue({
        fname: result.firstName,
        password: '',
        confirmPassword: '',
        lastName: result.lastName,
        username: result.username,
        phoneNumber: result.phone,
        email: result.email,
        show: true,
        selectedstate: result.stateId,
        selectedcity: result.cityId,
        junkYardName: result.junkYardName,
        zipCode: result.zip,
        address: result.street,
      });
      this.setRole(true);

    }
  }
  /**... form controller parameter... */
  initForm(): void {
    this.updateProfileForm = this.fb.group({
      fname: ['', [Validators.required]],
      password: ['', []],
      confirmPassword: ['', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])],
      selectedstate: ['', [Validators.required]],
      selectedcity: ['', [Validators.required]],
      junkYardName: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")]],
      address: ['', [Validators.required]],
    }
    );
  }

  /**.... Validation for input fields... */
  isValidInput(fieldName): boolean {
    return this.updateProfileForm.controls[fieldName].invalid &&
    (this.updateProfileForm.controls[fieldName].dirty ||
      this.updateProfileForm.controls[fieldName].touched);
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
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

  setRole(role) {
    if (role) {
      this.roleValue = "JUNK_YARD_OWNER";
    } else {
      this.roleValue = "USER";

    }
    this.show = role;

  }

  validateAllFormFields(formGroup: FormGroup, type) {         //{1}
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (type == 1) {//{2}{}
      const control = formGroup.get(field);             //{3}
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
  } else if (control instanceof FormGroup) {        //{5}
  this.validateAllFormFields(control, type);            //{6}
}
} else {
  if ((field == "password") || (field == "confirmPassword")) {
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
  } else if (control instanceof FormGroup) {        //{5}
  this.validateAllFormFields(control, type);

}
} else {
  if (control instanceof FormControl && type != 3) {             //{4}
    control.markAsTouched({ onlySelf: true });
} else if (control instanceof FormGroup) {        //{5}
this.validateAllFormFields(control, type);

}
}
}
});
}

/**......Registration service call... */
onSubmit() {
  this.error = [];
  if (this.updateProfileForm.controls.password.value != "") {
    this.updateProfileForm.controls.confirmPassword.setValidators([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
  } else {
    this.updateProfileForm.controls.confirmPassword.clearValidators();
    if (this.updateProfileForm.controls.confirmPassword.value != "") {
      this.updateProfileForm.controls.confirmPassword.setValidators([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
      this.updateProfileForm.controls.password.setValidators([Validators.required]);
    } else {
      this.updateProfileForm.controls.password.clearValidators();
    }

  }
  this.validateAllFormFields(this.updateProfileForm, 3);

  if (!this.updateProfileForm.pristine) 
  {
    //this.validateAllFormFields (this.registrationForm);
    if (this.updateProfileForm.controls.password.value == "" &&   this.updateProfileForm.controls.confirmPassword.value == "") 
    {
      if (this.roleValue == "USER" &&
        (this.updateProfileForm.controls.address.value == "" ||
          this.updateProfileForm.controls.email.value == "" ||
          this.updateProfileForm.controls.fname.value == "" ||
          this.updateProfileForm.controls.lastName.value == "" ||
          this.updateProfileForm.controls.phoneNumber.value == "" ||
          this.updateProfileForm.controls.selectedcity.value.city == "" ||
          this.updateProfileForm.controls.selectedstate.value.state == "" ||
          this.updateProfileForm.controls.username.value == "" ||
          this.updateProfileForm.controls.zipCode.value == "")) {
        this.toaster.showError('Empty Fields in the form', 'Empty Fields')
      this.validateAllFormFields(this.updateProfileForm, 0);
      return;
    }

    if (this.roleValue == "JUNK_YARD_OWNER" &&
      (this.updateProfileForm.controls.address.value == "" ||
        this.updateProfileForm.controls.email.value == "" ||
        this.updateProfileForm.controls.fname.value == "" ||
        this.updateProfileForm.controls.junkYardName.value == "" ||
        this.updateProfileForm.controls.lastName.value == "" ||
        this.updateProfileForm.controls.phoneNumber.value == "" ||
        this.updateProfileForm.controls.selectedcity.value.city == "" ||
        this.updateProfileForm.controls.selectedstate.value.state == "" ||
        this.updateProfileForm.controls.username.value == "" ||
        this.updateProfileForm.controls.zipCode.value == "")) 
    {
      this.validateAllFormFields(this.updateProfileForm, 0);
      this.toaster.showError('Empty Fields in the form', 'Empty Fields')
      return;
    }

    
  } else {
    
    this.validateAllFormFields(this.updateProfileForm, 0);
    this.validateAllFormFields(this.updateProfileForm, 3);
    if (this.updateProfileForm.controls.password.value == "" ||
      this.updateProfileForm.controls.confirmPassword.value == "") {
      this.toaster.showError('Either Password Fields is Empty', 'Empty Fields')
    return;
  }

  if (this.updateProfileForm.controls.password.invalid ||
    this.updateProfileForm.controls.confirmPassword.invalid) 
  {
    this.toaster.showError('Either Password Fields is Invalid', 'Invalid Fields')
    return;
  }

  if (this.roleValue == "USER" &&
    (this.updateProfileForm.controls.address.value == "" ||
      this.updateProfileForm.controls.email.value == "" ||
      this.updateProfileForm.controls.fname.value == "" ||
      this.updateProfileForm.controls.lastName.value == "" ||
      this.updateProfileForm.controls.phoneNumber.value == "" ||
      this.updateProfileForm.controls.selectedcity.value.city == "" ||
      this.updateProfileForm.controls.selectedstate.value.state == "" ||
      this.updateProfileForm.controls.username.value == "" ||
      this.updateProfileForm.controls.zipCode.value == "")) {
    this.toaster.showError('Empty Fields in the form', 'Empty Fields')
  this.validateAllFormFields(this.updateProfileForm, 0);
  return;
}

if (this.roleValue == "JUNK_YARD_OWNER" &&
  (this.updateProfileForm.controls.address.value == "" ||
    this.updateProfileForm.controls.email.value == "" ||
    this.updateProfileForm.controls.fname.value == "" ||
    this.updateProfileForm.controls.junkYardName.value == "" ||
    this.updateProfileForm.controls.lastName.value == "" ||
    this.updateProfileForm.controls.phoneNumber.value == "" ||
    this.updateProfileForm.controls.selectedcity.value.city == "" ||
    this.updateProfileForm.controls.selectedstate.value.state == "" ||
    this.updateProfileForm.controls.username.value == "" ||
    this.updateProfileForm.controls.zipCode.value == "")) 
{
  this.validateAllFormFields(this.updateProfileForm, 0);
  this.toaster.showError('Empty Fields in the form', 'Empty Fields')
  return;
}
}
}

else {
  //this.validateAllFormFields (this.updateProfileForm)
  this.toaster.showError('No Changes made in Form ', 'Error Occured')

  return;
}

/*..InitiLize list of value from thr form..*/
let data = {
  "userId": JSON.parse(sessionStorage.getItem('ID') || '{}'),
  "username": this.updateProfileForm.value.username,
  "firstName": this.updateProfileForm.value.fname,
  "lastName": this.updateProfileForm.value.lastName,
  "email": this.updateProfileForm.value.email,
  "password": this.updateProfileForm.value.password,
  "newPassword": this.updateProfileForm.value.confirmPassword,
  "role": this.roleValue,
  "phoneNumber": this.updateProfileForm.value.phoneNumber,
  "street": this.updateProfileForm.value.address,
  "stateId": this.selectedstate.stateId.toString(),
  "cityId": this.selectedcity.cityId.toString(),
  "state": this.selectedstate.state.toString(),
  "city": this.selectedcity.city.toString(),
  "zipCode": this.updateProfileForm.value.zipCode
}

if (this.show) {
  data['junkYardName'] = this.updateProfileForm.value.junkYardName; //old version
  data['newJunkYardName'] = this.updateProfileForm.value.junkYardName;
}
const junkYardName = this.updateProfileForm.value.junkYardName;

// service request for registration
this.updateProfileService.setUserData(data).subscribe(
  resData => {
    this.toaster.showSuccess('All Fields have been Updated', 'User Profile Updated')
    this.router.navigate(['welcome']);      //  this.isLoading = false;
  },
  errorMessage => {
    this.toaster.showError(errorMessage, 'Error Occured')

    //this.error = errorMessage;
    //   this.isLoading = false;
  }
  );




//  this.registrationForm.reset();
}

//Reset Update functionality
resetUpdate(){
  this.setForm(this.oldProfileData);
  if (this.states.length !== 0 && this.citiesList.length !== 0) {
    this.selectedstate = {
      "stateId": this.oldProfileData["stateId"],
      "state": this.oldProfileData["state"]
    }
    this.fetchCities();
    // this.selectedcity = { "cityId": this.oldProfileData["cityId"], 
    // "city":  this.oldProfileData["city"]}
  }
}

resetForm(){
  this.updateProfileForm.reset();

  this.updateProfileService.getUserData().subscribe(
    resData => {
      this.oldProfileData = resData;
      this.setForm(resData);
      //  this.isLoading = false;
      this.fetchState();
    },
    errorMessage => {
      this.error = errorMessage;
      //   this.isLoading = false;
    }
    );
}

/**...State service call...  */
fetchState() {
  this.updateProfileService.getStates().subscribe(data => {
    this.states = data;
    this.selectedstate = { "stateId": this.oldProfileData["stateId"], 
    "state":  this.oldProfileData["state"]}
    this.fetchCities();
  });

}

/*....Fetch the selected state and call list of city service....*/
selectChange(event: any) {
  this.selectedcity = { "cityId": "*", "city": "" };
  this.citiesList = [];
  if(event.value !== null){
    this.selectedstate = event.value;
    //fetch cities in the selectedstate state
    this.fetchCities();
  } else {
  }
}

fetchCities(){
  this.updateProfileService.getCity(this.selectedstate.stateId).subscribe(data => {
    this.citiesList = data;
    if(this.citiesList.some(city => city.city === this.oldProfileData["city"])){
      this.selectedcity = { "cityId": this.oldProfileData["cityId"], 
      "city":  this.oldProfileData["city"]}
    } 
  });
}

/*........selected City Value.........*/
selectCityChange(event: any) {

  if(event.value !== null) { 

    this.selectedcity = event.value;
    // let stateId = this.selectedstate.stateId.toString();
  }
}
}

