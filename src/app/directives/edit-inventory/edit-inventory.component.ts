import { Component, OnInit, Input } from '@angular/core';
import { SellInputFormService } from './../../services/sell-input-form.service';
import { SellInventoryService } from './../../services/sell-inventiry.service';
import { FormBuilder, FormControlName, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from './../../services/notification.service';


interface ShipingOption {
  shipping: string,
  shippingValue: boolean
}
@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {

  sellForm;
  url: any; //Angular 11, for stricter type
  msg = "";
  shippingStatus: ShipingOption[];
  selectedShippingOption: ShipingOption;
  selectedMake: { "makeId": number, "make": string } = { "makeId": -1, "make": "" };
  selectedModel: { "modelId": number, "model": string } = { "modelId": -1, "model": "" };
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedYear: { "yearId": number, "year": number } = { "yearId": -1, "year": 1000 };
  selectedPart: { "partId": number, "part": string } = { "partId": -1, "part": "" };
  selectedShip: { "yes": 'yes', }
  modelFlag: boolean;
  makers: { "makeId": number, "make": string }[] = [];
  models: { "modelId": number, "model": string }[] = [];
  years: { "yearId": number, "year": number }[] = [];
  parts: { "partId": number, "part": string }[] = [];
  role: String = "";
  roleStatus: boolean = false;
  yearStateFlag: boolean = true;
  priceValue: string;
  description: string;
  selectedFile;
  prePopulateData: {};
  selectedVin;
  selectedMileage;
  partSellId;
  vhlId;

  imageToShow;
  images: any[] = [];
  multiImages: any[] = [];
  @Input() reSelectedData;

  constructor(private sellInputFormService: SellInputFormService, public _DomSanitizationService: DomSanitizer,
    private fb: FormBuilder, private toaster: NotificationService, private router: Router, private sellInventoryService: SellInventoryService) {
    this.shippingStatus = [
      { shipping: 'YES', shippingValue: true },
      { shipping: 'NO', shippingValue: false }

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
      vinValue: new FormControl('')
    });
    this.generateYears();
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');
    console.log(this.role);
    if (this.role == 'USER') {
      this.roleStatus = true;
    } else {
      this.roleStatus = false;
    }
    this.editForm();


  }

  onChangeMake(event: any) {

    if (event.value !== undefined) {
      this.sellInputFormService.getModels(event.value.makeId)
        .subscribe(data => {
          this.models = data
          this.onChangeModel(event);
          //   console.log(this.models)
        });
    } else {
      this.selectedMake = { make: event.make, makeId: event.makeId };
      this.sellInputFormService.getModels(this.selectedMake.makeId)
        .subscribe(data => {
          this.models = data
          this.onChangeModel(event);
          //   console.log(this.models)
        });
    }

    this.modelFlag = false;

  }

  onChangeModel(event) {
    // if(event.value == null){
    //   this.yearStateFlag = true;
    //   this.selectedstate = {"stateId": "*", "state": ""};
    //   this.selectedYear = {"yearId": -1, "year": "*"};
    //   this.yearStateFlag = true;
    // } else
    this.selectedYear = { "yearId": event.yearId, "year": event.year };
    if (event.value == null) {
      this.selectedModel = { model: event.model, modelId: event.modelId };
      this.sellInputFormService.getParts().subscribe(data => this.parts = data);
      this.generateYears();
      this.onChangePart(event)
      this.yearStateFlag = false;
    } else {
      this.sellInputFormService.getParts().subscribe(data => this.parts = data);
      this.generateYears();
      //  this.onChangePart(event)
      this.yearStateFlag = false;
    }
  }


  onChangePart(event: any) {
    if (event.value !== undefined) {

      if (this.selectedModel !== null && this.selectedModel.model !== "")
        console.log(this.selectedModel)
      this.yearStateFlag = false;
    } else
      this.selectedPart = { partId: event.partId, part: event.part }
    this.yearStateFlag = false;
    this.generateYears();
  }

  /**generate Year list */
  generateYears(): void {
    /**pre-selected data */
    let currentYear = new Date().getFullYear();
    let startYear = (currentYear - 50) || 1980;
    let index = 0;
    while (currentYear >= startYear) {
      this.years.push({ "year": currentYear--, "yearId": index++ });
    }
  }


  // image upload...
  onFileChange(event) {
    this.images = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        if (filesAmount > 4) {
          this.toaster.showError('Only four images can be uploaded', 'Upload Failure')
          return;
        } else {
          var reader = new FileReader();

          reader.onload = (event: any) => {
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
          this.selectedFile = event.target.files[i];
          this.multiImages.push(event.target.files[i]);
          console.log(this.multiImages);
          // console.log(event.target.files[i]);
        }

      }
    }
  }

  /**Navigate back */
  sellInvenPage() {
    //navigate to homepage
    this.router.navigate(['sellInventory']);
  }

  /**submit after edit */
  onSubmitForm() {
    console.log(this.sellForm.value);
    var formData: any = new FormData();
    let partAddRequest = {}
    // sell form data ...
    if (this.roleStatus) {
      this.submitVheicleForm(); // Form for User
    } else {
      this.submitPartForm();// Form for Junk-yard owner
    }
  }

  /**Edit existing form */
  submitPartForm() {
    let partAddRequest = {
      "make": this.selectedMake.make,
      "makeId": this.selectedMake.makeId,
      "model": this.selectedModel.model,
      "modelId": this.selectedModel.modelId,
      "year": this.selectedYear.year,
      "partId": String(this.selectedPart.partId),
      "part": this.selectedPart.part,
      "username": window.sessionStorage.getItem("USERNAME"),
      "price": this.priceValue,
      "description": this.description,
      "shipping": String(this.selectedShippingOption.shippingValue)
    }
    this.sellInventoryService.editSelectedItem(this.partSellId, this.selectedFile, partAddRequest).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        this.toaster.showSuccess('Your form has been updated successfully ', 'Successfully Edited');
      },
      errorMessage => {
        console.log(errorMessage);
        //   this.error = errorMessage;
        //   this.isLoading = false;
      }
    );



  }

  /**Edit vehicle form */
  submitVheicleForm() {
    let vehicleAddRequest = {
      "make": this.selectedMake.make,
      "makeId": this.selectedMake.makeId,
      "model": this.selectedModel.model,
      "modelId": this.selectedModel.modelId,
      "year": this.selectedYear.year,
      "vin": this.selectedVin,
      "mileage": String(this.selectedMileage),
      "username": window.sessionStorage.getItem("USERNAME"),
      "price": this.priceValue,
      "description": this.description

    }

    //  console.log('images',this.multiImages)
    this.sellInventoryService.editSellFormVehicle(this.vhlId,this.multiImages,vehicleAddRequest).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        this.toaster.showSuccess('Your form has been updated successfully ', 'Successfully Edited');
      },
      errorMessage => {
        console.log(errorMessage);
        //   this.error = errorMessage;
        //   this.isLoading = false;
      }
    );
  }


  /**Initiate edit function and render form  */
  editForm() {
    this.sellInventoryService.subject.subscribe(
      res => {

        this.sellInputFormService.getMakers().subscribe(data => {
          this.makers = data;
        });
        if (this.roleStatus) {
          // this.selectedVin =
this.vhlId = res.vehicleSells[0].vehId;
          this.description = res.vehicleSells[0].description;
          this.priceValue = res.vehicleSells[0].price;
          this.onChangeMake(res.vehicleSells[0]);
          this.selectedVin = res.vehicleSells[0].vin;
          this.selectedMileage = res.vehicleSells[0].mileage;
          this.createImageFromBlob(res.vehicleSells[0].vehicleImages)

        } else {
          this.onChangeMake(res);
          this.partSellId = res.partSellId
          if (res.shipping === "true")
            this.selectedShippingOption = { shipping: 'YES', shippingValue: true };
          else
            this.selectedShippingOption = { shipping: 'NO', shippingValue: false }
            this.priceValue = res.price;
            this.description = res.description;
            this.createImageFromBlob(res.imageUri)
        }

      }

    )
  }

  /**convert images to base64...*/
  createImageFromBlob(imageValue) {
    this.images = [];
    console.log(imageValue);
    if(!this.roleStatus){
      this.images.push(imageValue);
    }else{
   for(let i=0;i<imageValue.length;i++){

     this.images.push(imageValue[i].imageUri);
   }

    }
    let image = new Blob([imageValue]);
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      let image = [];
      //image.push(reader.result);
      //  this.images = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


}
