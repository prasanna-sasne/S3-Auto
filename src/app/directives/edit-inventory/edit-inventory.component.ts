import { Component, OnInit, Input } from '@angular/core';
import { SellInputFormService } from './../../services/sell-input-form.service';
import { SellInventoryService } from './../../services/sell-inventiry.service';
import { FormBuilder, FormControlName, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from './../../services/notification.service';
import { Observable, Observer } from 'rxjs';


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

  editFrm;
  url: any; //Angular 11, for stricter type
  msg = "";
  shippingStatus: ShipingOption[];
  selectedShippingOption: ShipingOption;
  selectedMake: { "makeId": number, "make": string } = { "makeId": -1, "make": "" };
  selectedModel: { "modelId": number, "model": string } = { "modelId": -1, "model": "" };
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" };
  selectedYear: {"yearId": number, "year": string} = {"yearId": -1, "year": "*"};
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
    this.editFrm = new FormGroup({


      selectedMake: new FormControl([this.selectedMake,[ Validators.required]]),
      selectedModel: new FormControl([this.selectedModel,[ Validators.required]]),
      selectedstate: new FormControl([this.selectedstate,[ Validators.required]]),
      selectedYear: new FormControl([this.selectedYear,[ Validators.required]]),
      selectedPart: new FormControl([this.selectedPart,[ Validators.required]]),
      selectedShip: new FormControl([this.selectedShip,[ Validators.required]]),
      selectedMileage:new FormControl([this.selectedMileage,[ Validators.required]]),
      priceValue: new FormControl([this.priceValue,[ Validators.required]]),
      description: new FormControl([this.description,[ Validators.required]]),
      selectedVin:new FormControl([this.selectedVin,[ Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$')]])
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
      this.selectedModel = {"modelId": -1, "model": "*"};
      this.selectedYear = {"yearId": -1, "year": "*"};
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

  onChangeYear(event: any){
    this.generateYears();
    console.log(event);

    if(event.value == null){
      //this.yearStateFlag = true;
    } else {
      if(this.selectedModel !== null && this.selectedModel.model !== "")
        console.log(this.selectedModel)

        this.selectedYear ={"year": event.value.year, "yearId": event.value.yearId};

      //this.yearStateFlag = false;
    }
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
  onFileChange(event, id) {
    //this.images = [];
    if (event.target.files && event.target.files[0]) {
      if (this.roleStatus == true) {
        /**User role */
        var filesAmount = event.target.files.length;
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target)
          //  console.log(event.target.result);
          // if (event.target.result.match(/image\/*/) == null) {
          //   this.msg = "Only images are supported";
          //   return;
          //   }
          var temp = event.target;
          // temp.append("name","file + id");
          this.images[id] = (event.target.result);

          this.editFrm.patchValue({
            fileSource: this.editFrm
          });
        }

        reader.readAsDataURL(event.target.files[0]);
        this.selectedFile = event.target.files[0];
        this.multiImages[id] = (event.target.files[0]);

        console.log(this.multiImages);
      }
      else{
        // junkyard owner role
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
              this.images[0] = (event.target.result);


              this.editFrm.patchValue({
                fileSource: this.editFrm
              });
            }

            reader.readAsDataURL(event.target.files[i]);
            this.selectedFile = event.target.files[i];
            this.multiImages[0] = (event.target.files[0]);
            console.log(this.multiImages);
            // console.log(event.target.files[i]);
          }

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
  onSubmit() {
    console.log(this.editFrm.value);
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
    this.sellInventoryService.editSelectedItem(this.partSellId, this.multiImages[0], partAddRequest).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        this.toaster.showSuccess('Your form has been updated successfully ', 'Successfully Edited');
        location.reload(true);
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
    this.sellInventoryService.editSellFormVehicle(this.vhlId, this.multiImages, vehicleAddRequest).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        this.toaster.showSuccess('Your form has been updated successfully ', 'Successfully Edited');
        location.reload(true);
      },
      errorMessage => {
        console.log(errorMessage);
        this.toaster.showError(errorMessage, 'Error Occured');

        //   this.error = errorMessage;
        //   this.isLoading = false;
      }
    );
  }


  /**Initiate edit function and render form  */
  editForm() {
    this.sellInventoryService.subject.subscribe(
      res => {
        this.multiImages = [];
        this.images = [];

        this.sellInputFormService.getMakers().subscribe(data => {
          this.makers = data;
        });
        if (this.roleStatus) {
          // user role
          this.vhlId = res.vehicleSells[0].vehId;
          this.description = res.vehicleSells[0].description;
          this.priceValue = res.vehicleSells[0].price;
          this.onChangeMake(res.vehicleSells[0]);
          this.selectedVin = res.vehicleSells[0].vin;
          this.selectedMileage = res.vehicleSells[0].mileage;
          this.createImageFromBlob(res.vehicleSells[0].vehicleImages)

        } else {
          //junkyard role
          this.onChangeMake(res);
          this.partSellId = res.partSellId
          if (res.shipping === "true")
            this.selectedShippingOption = { shipping: 'YES', shippingValue: true };
          else
            this.selectedShippingOption = { shipping: 'NO', shippingValue: false }
          this.priceValue = res.price;
          this.description = res.description;
          this.createImageFromBlob(res.imageUri)
          // this.onFileChange(res.imageUri);
        }

      }

    )
  }

  /**convert images to base64...*/
  createImageFromBlob(imageValue) {
    // junkyard role
    console.log(imageValue);
    if (!this.roleStatus) {
      this.images[0] = (imageValue);
      this.toDataURL(imageValue, (temp) => {
        let blob_t = this.dataURItoBlob(temp);
        this.multiImages[0] = blob_t;
      });
    } else {
      var temp;
      var image_bs64;
      // user role
      for (let i = 0; i < imageValue.length; i++) {
        this.images[i] = imageValue[i].imageUri;
        this.toDataURL(imageValue[i].imageUri, (temp) => {
          let blob_t = this.dataURItoBlob(temp);
          this.multiImages[i] = blob_t;
        }

        );

        //this.multiImages[i]=this.dataURItoBlob(imageValue[i].imageUri);
        console.log("multimages", this.multiImages);

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

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);

      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}
