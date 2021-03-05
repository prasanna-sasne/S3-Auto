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
  constructor(private authService: AuthService,private fb: FormBuilder) {}
  public show:boolean = false;
  public firstName:string = "";
  yearStateFlag: boolean = false;
  states: {"stateId": number, "state": string}[] = [];
  citiesList:{"cityId":number,"city":string}[]=[];

  selectedstate: {"stateId": string, "state": string} = {"stateId": "*", "state": ""};
  selectedcity:{"cityId": string, "city": string} = {"cityId": "*", "city": ""};

  checkCheckBoxvalue(event){
    console.log(event);
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchState();
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      fname: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]],
      password: ['', Validators.required],
      username:['', Validators.required],
      email:['', Validators.required,Validators.email],
      selectedstate:['', Validators.required],
      selectedcity:['', Validators.required]
    });
  }
  isValidInput(fieldName): boolean {
    return this.registrationForm.controls[fieldName].invalid &&
      (this.registrationForm.controls[fieldName].dirty ||
        this.registrationForm.controls[fieldName].touched);

  }

  toggle() {
    this.show = !this.show;
  }

  onSubmit() {
  //  debugger;
    if (!this.registrationForm.valid) {
      return;
    }
    const email = this.registrationForm.value.email;
    const password = this.registrationForm.value.password;

      this.authService.signup().subscribe(
        resData => {
          console.log(resData);
        //  this.isLoading = false;
        },
        errorMessage => {
          console.log(errorMessage);
        //  this.error = errorMessage;
       //   this.isLoading = false;
        }
      );


      this.registrationForm.reset();
  }

  fetchState(){
    this.authService.getStates().subscribe(data => {
      this.states = data
      console.log(this.states);
    });
  }
  selectChange(event: any){
    console.log("selected State" , event.value);
    this.selectedstate = event.value;
    console.log("selectedstate option" , this.selectedstate.stateId);
// let stateId = this.selectedstate.stateId.toString();
this.authService.getCity(this.selectedstate.stateId).subscribe(data => {
      this.citiesList = data;
      console.log(data);
    });
  }
  selectCityChange(event: any){
    console.log("selected City" , event.value);
    this.selectedcity = event.value;
    console.log("selectedstate option" , this.selectedcity.city);
// let stateId = this.selectedstate.stateId.toString();

  }
}
