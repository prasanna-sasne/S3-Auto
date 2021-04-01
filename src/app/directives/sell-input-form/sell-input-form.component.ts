import { Component, OnInit } from '@angular/core';
import { SellInputFormService } from './../../services/sell-input-form.service';
import { FormBuilder, FormControlName, FormControl, FormGroup, Validators } from '@angular/forms';
interface ShipingOption {
  shipping: string,
  shippingValue :boolean
}

@Component({
  selector: 'app-sell-input-form',
  templateUrl: './sell-input-form.component.html',
  styleUrls: ['./sell-input-form.component.css']
})


export class SellInputFormComponent implements OnInit {
  sellForm;
  url: any; //Angular 11, for stricter type
	msg = "";
  shippingStatus: ShipingOption[];
  selectedShippingOption: ShipingOption ;
  selectedMake: {"makeId": number, "make": string} = {"makeId": -1, "make": ""};
  selectedModel: {"modelId": number, "model": string} = {"modelId": -1, "model": ""};
  selectedstate: {"stateId": string, "state": string} = {"stateId": "*", "state": ""};
  selectedYear: {"yearId": number, "year": string} = {"yearId": -1, "year": "*"};
  selectedPart: {"partId": number, "part": string} = {"partId": -1, "part": ""};
  selectedShip: {"yes":'yes',}
  modelFlag:boolean;
  makers: {"makeId": number, "make": string}[] = [];
  models: {"modelId": number, "model": string}[] = [];
  years: {"yearId": number, "year": number}[] = [];
  parts: {"partId": number, "part": string}[] = [];
  role:String="";
  roleStatus:boolean = false;
  yearStateFlag:boolean;
  priceValue:string;
  selectedFile;

  images :any[] =[];
  multiImages:any[]=[];

  constructor( private sellInputFormService:SellInputFormService, private fb:FormBuilder) {
    this.shippingStatus = [
      {shipping: 'YES', shippingValue: true},
      {shipping: 'NO', shippingValue: false}

  ];


  }

  ngOnInit(): void {
    this.sellForm = new FormGroup({
      makers: new FormControl(''),
      models: new FormControl(''),
      partName: new FormControl(''),
      years: new FormControl(''),
      shipping: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      mileage: new FormControl(''),
      vinValue:new FormControl('')
    });


    this.sellInputFormService.getMakers().subscribe(data =>{
      this.makers = data;
    //  console.log(this.makers)
    } );

    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');
    console.log(this.role);
    if(this.role == 'USER'){
      this.roleStatus = true;
    }else {
      this.roleStatus = false;
    }

  }

  onChangeMake(event: any) {
    if(event.value == null){
      // this.selectedModel = {"modelId": 0, "model": ""};
      // this.selectedstate = {"stateId": "*", "state": ""};
      // this.selectedYear = {"yearId": 0, "year": "*"};
      // this.modelFlag = true;
      // this.yearStateFlag = true;
      // this.resetFilters();
    } else {
      this.sellInputFormService.getModels(this.selectedMake.makeId)
      .subscribe(data =>{
        this.models = data
     //   console.log(this.models)
      } );
      this.modelFlag = false;
    }
  }

  onChangeModel(event) {
    if(event.value == null){
      this.yearStateFlag = true;
      this.selectedstate = {"stateId": "*", "state": ""};
      this.selectedYear = {"yearId": 0, "year": "*"};
    } else {
      this.sellInputFormService.getParts().subscribe(data => this.parts = data);
      this.generateYears();
    }
  }

  generateYears():void {
    let currentYear = new Date().getFullYear();
    let startYear = (currentYear-50) || 1980;
    let index = 0;
    while ( currentYear >= startYear ) {
      this.years.push({"year": currentYear--, "yearId": index++});
    }
  }

  onChangePart(event: any){
    if(event.value == null){
      this.yearStateFlag = true;
    } else {
      if(this.selectedModel !== null && this.selectedModel.model !== "")
    console.log(this.selectedModel)
       this.yearStateFlag = false;
       this.generateYears();
    }
  }


  // image upload...
  onFileChange(event) {
    this.images=[];
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          if(filesAmount >4) {
            alert('you can select four images only ');
             return;
          }else {
            var reader = new FileReader();

            reader.onload = (event:any) => {
              console.log(event.target)
            //  console.log(event.target.result);
            // if (event.target.result.match(/image\/*/) == null) {
            //   this.msg = "Only images are supported";
            //   return;
         //   }
              this.images.push(event.target.result);

               this.sellForm.patchValue({
                  fileSource: this.sellForm
               });
            }

            reader.readAsDataURL(event.target.files[i]);
            this.selectedFile =event.target.files[i];
            this.multiImages.push(event.target.files[i]);
            console.log(this.multiImages);
           // console.log(event.target.files[i]);
          }

        }
    }
  }

  // submit form ..
  onSubmitForm() {
    console.log(this.sellForm.value);
    var formData: any = new FormData();
    let partAddRequest = {}
    // sell form data ...
    if(this.roleStatus) {
      this.submitVheicleForm(); // Form for User
    }else {
      this.submitPartForm();// Form for Junk-yard owner
    }
  }

  submitPartForm(){
   let partAddRequest = {
      "make": this.sellForm.value.makers.make,
      "makeId": this.sellForm.value.makers.makeId,
      "model": this.sellForm.value.models.model,
      "modelId": this.sellForm.value.models.modelId,
      "year": this.sellForm.value.years.year,
      "partId":this.sellForm.value.partName.partId,
      "part": this.sellForm.value.partName.part,
      "username": window.sessionStorage.getItem("USERNAME"),
      "price": this.sellForm.value.price,
      "description": this.sellForm.value.description,
      "shipping":this.sellForm.value.shipping.shippingValue
  }
  this.sellInputFormService.submitSellFormPart(this.selectedFile,partAddRequest).subscribe(
    resData => {
     console.log("resData", resData);
      // setting data to session .........
      alert('Uploaded Successfully.');
    },
    errorMessage => {
      console.log(errorMessage);
   //   this.error = errorMessage;
      //   this.isLoading = false;
    }
  );


  }
  submitVheicleForm() {
   let  vehicleAddRequest = {
        "make": this.sellForm.value.makers.make,
        "makeId": this.sellForm.value.makers.makeId,
        "model": this.sellForm.value.models.model,
        "modelId": this.sellForm.value.models.modelId,
        "year": this.sellForm.value.years.year,
        "vin":this.sellForm.value.vinValue,
        "mileage": this.sellForm.value.mileage,
        "username": window.sessionStorage.getItem("USERNAME"),
        "price": this.sellForm.value.price,
        "description": this.sellForm.value.description,

      }
      const frmdata = new FormData();
      frmdata.append('vehicleAddRequest', JSON.stringify(vehicleAddRequest));

      for (var i = 0; i < this.multiImages.length; i++) {
      frmdata.append('images',  this.multiImages[i] ,this.multiImages[i].name);
      }

      //  console.log('images',this.multiImages)
      this.sellInputFormService.submitSellFormVehicle(frmdata).subscribe(
        resData => {
          console.log("resData", resData);
          // setting data to session .........
          alert('Uploaded Successfully.');
        },
        errorMessage => {
          console.log(errorMessage);
       //   this.error = errorMessage;
          //   this.isLoading = false;
        }
      );
  }


}
