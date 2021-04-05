import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  alert:boolean=false
  public email: string;
  public description: string;
  contactusForm: FormGroup;
  constructor(private fb: FormBuilder,private http: HttpClient) { }
  onSubmit (data)
  {

    const email = this.contactusForm.value.email;
    const description = this.contactusForm.value.description;
    console.log("const" ,this.email);
    console.log("const" ,this.description);

    console.warn(data);
    this.http.post('http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp/issues/add' , data)
      .subscribe((result)=>
      {
        console.warn("result" , data);
      })
    this.alert=true
    this.email="";
    this.description="";
    this.contactusForm.reset();
  }

  closeAlert()
  {
    this.alert=false
  }
  ngOnInit(): void {
    this.validationForm();
  }
  validationForm(): void {
    this.contactusForm = this.fb.group({
      /*email: ['', [Validators.required]],*/
      email: ['', Validators.compose([Validators.required, Validators.email])],
      description: ['', Validators.required]
    });
  }

  isValidInput(fieldValue): boolean {

    return this.contactusForm.controls[fieldValue].invalid &&
      (this.contactusForm.controls[fieldValue].dirty ||
        this.contactusForm.controls[fieldValue].touched);

  }
}
