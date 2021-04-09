import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateProfileService } from './update-profile.service';
import { Router } from '@angular/router';

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
  roleValue: string ="USER";
  roleStatus: boolean;
  states: { "stateId": number, "state": string }[] = [];
  citiesList: { "cityId": number, "city": string }[] = [];
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedcity: { "cityId": string, "city": string } = { "cityId": "*", "city": "" };
  requestData: Object = {};
  error = [];
  oldProfileData = [];

  constructor(private updateProfileService: UpdateProfileService, private fb: FormBuilder, private router:Router) { }



  ngOnInit(): void {
    this.initForm();
    this.updateProfileService.getUserData().subscribe(
      resData => {
        this.oldProfileData = resData; 
        console.log(resData);
        this.setForm(resData);
        //  this.isLoading = false;
        this.fetchState();
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        //   this.isLoading = false;
      }
      );
  }

  setForm(result): void {
    if(result.role=="USER")
    {
      this.updateProfileForm = this.fb.group({
        fname: result.firstName,
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
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
      this.setRole(false);
    }
    else
    {
      this.updateProfileForm = this.fb.group({
        fname: result.firstName,
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
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
    return this.updateProfileForm.controls[fieldName].invalid &&
    (this.updateProfileForm.controls[fieldName].dirty ||
      this.updateProfileForm.controls[fieldName].touched);
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

  setRole(role) {
    if (role) {
      this.roleValue = "JUNK_YARD_OWNER";
    } else {
      this.roleValue = "USER";
    }
    this.show=role;

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
        "state": this.selectedstate.stateId.toString(),
        "city": this.selectedcity.cityId.toString(),
        "zipCode": this.updateProfileForm.value.zipCode
      }

      if (this.show) {
        data['junkYardName'] = this.updateProfileForm.value.junkYardName; //old version
        data['newJunkYardName'] = this.updateProfileForm.value.junkYardName;
      }
      console.log(data);
      const junkYardName = this.updateProfileForm.value.junkYardName;

      // service request for registration
      this.updateProfileService.setUserData(data).subscribe(
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

    cancelPageR(){
      //navigate to homepage
      this.router.navigate(['welcome']);
    }
    resetForm(){
      this.updateProfileForm.reset();
    }

    /**...State service call...  */
    fetchState() {
      this.updateProfileService.getStates().subscribe(data => {
        this.states = data;
        this.selectedstate = { "stateId": this.oldProfileData["stateId"], 
        "state":  this.oldProfileData["state"]}
        this.fetchStates();
      });

    }

    /*....Fetch the selected state and call list of city service....*/
    selectChange(event: any) {
      if(event.value == null){
        this.selectedcity = { "cityId": "*", "city": "" };
      } else { 
        this.selectedstate = event.value;
        //fetch cities in the selectedstate state
        this.fetchStates();
      }
    }

    fetchStates(){
      this.updateProfileService.getCity(this.selectedstate.stateId).subscribe(data => {
        this.citiesList = data;
        this.selectedcity = { "cityId": this.oldProfileData["cityId"], 
        "city":  this.oldProfileData["city"]}
      });
    }

    /*........selected City Value.........*/
    selectCityChange(event: any) {

      if(event.value !== null) { 
       
        this.selectedcity = event.value;
        console.log("selectedstate option", this.selectedcity.city);
        // let stateId = this.selectedstate.stateId.toString();
      }
    }
  }
