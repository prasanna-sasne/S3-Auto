import { Component, OnInit,Output, EventEmitter  } from '@angular/core'
import { SellInventoryService } from './../../services/sell-inventiry.service'
import {SellInputFormService} from './../../services/sell-input-form.service'
import { ModalService } from './../../_modal/modal.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from './../../services/notification.service';

interface inventoryObject {

  "userId": number,
  "username": String,
  "imageId": number,
  "imageUri": string,
  "partId": number,
  "part": string,
  "partSellId": number,
  "description": string,
  "soldDate": string,
  "makeId": number,
  "make": string,
  "modelId": number,
  "model": string,
  "yearId": number,
  "year": number,
  "sellStatusId": number,
  "sellStatus": string,
  "price": number,
  "shipping": true,
  "junkYardId": number,
  "junkYardName": string,
  "junkYardRating": number,
  "street": string,
  "state": string,
  "city": string,
  "zip": string,
  "email": string,
  "phone": string
}


@Component({
  selector: 'app-sell-inventory',
  templateUrl: './sell-inventory.component.html',
  styleUrls: ['./sell-inventory.component.css']
})
export class SellInventoryComponent implements OnInit {
  inventoryList: any[] = []
  selectedPartList: any[] = [];
  duplicateArray: any[] = []
  propertObject: any[] = [];
  multiImages:any[]=[];
  images:any[]=[];
  actionIndex;
  deleteIndex;
  private userId: number
  public role: string
  isLoading: boolean = true
  numberOfValue: number = 0;
  duplicateFlag:boolean;
  nextRecordFlag: boolean = true
  previousRecordFlag: boolean = true
  startIndex = 0;
  currentPageIndex = 1;
  msg:String;
  isReadMore:any[]=[];
  closeCollapse:boolean[]=[]
  closeDuplicateWindow:boolean[]=[];

  formdata;
  //Search parameters.....
  makers: { "makeId": number, "make": string }[] = []
  years: { "yearId": number, "year": number }[] = []
  models: { "modelId": number, "model": string }[] = []
  parts: { "partId": number, "part": string }[] = []
  states: { "stateId": number, "state": string }[] = []
  contactSeller: boolean = false
  username: string = ""

  //Initial values for select
  selectedMake: { "makeId": number, "make": string } = { "makeId": -1, "make": "" }
  selectedModel: { "modelId": number, "model": string } = { "modelId": -1, "model": "" }
  selectedstate: { "stateId": string, "state": string } = { "stateId": "*", "state": "" }
  selectedYear: { "yearId": number, "year": string } = { "yearId": -1, "year": "*" }
  selectedPart: { "partId": number, "part": string } = { "partId": -1, "part": "" }

  //Flag for validation of select control
  modelFlag: boolean = true
  yearStateFlag: boolean = true
  itemDetails: any = []
  stars: number[] = []
  showexistingImage:any[]=[false];

  //showexistingImage: false;
  constructor( private sellInventoryService: SellInventoryService,
    private sellInputFormService:SellInputFormService,
    private router:Router,private route: ActivatedRoute,
    private toaster:NotificationService,
    private modalService: ModalService) {
    this.userId = JSON.parse(`${sessionStorage.getItem("ID")}`)
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}')
  }

  ngOnInit(): void {
    this.getSellInventory();
    this.generateYears();
    this.getMakers();
    sessionStorage.removeItem('filterOptions')
    //this.editFormData(1);
  }
  // To get previous page data
  previousPage(): void {
    this.currentPageIndex--
    this.startIndex -= 8
  this.getSellInventory()
  }

  // To get next page data
  nextPage(): void {
    this.currentPageIndex++
    this.startIndex += 8
    this.getSellInventory()
  }



  paginateView(data: any[]) {
    //deep-copy of data array to buyItems
    console.log(data)
    if(this.role == 'USER'){
      this.inventoryList = JSON.parse(JSON.stringify(data))
     // this.getvehicleInventory();
    }else {
       this.inventoryList = JSON.parse(JSON.stringify(data))
    }
    //trim last record
    this.inventoryList.splice(8, 1)

    if (data.length % 9 == 0) {
      this.nextRecordFlag = false;
    } else this.nextRecordFlag = true;
  }

  /**get make list  */
  getMakers(){
    this.sellInputFormService.getMakers().subscribe(data =>{
      this.makers = data;
      //  console.log(this.makers)
    } );
  }
  //Generate year list
  generateYears(): void {
    let currentYear = new Date().getFullYear()
    let startYear = (currentYear - 50) || 1980
    let index = 0
    while (currentYear >= startYear) {
      this.years.push({ "year": currentYear--, "yearId": index++ })
    }
  }

    /**Fetch inventory list*/
    getSellInventory(): void {
      if(this.role == 'USER'){
        this.getvehicleInventory();
      }else {

      let inventoryParam = {
        userId: this.userId,
        role: this.role,
        startIdx: this.startIndex,
        resultSize: 9
      }
      this.sellInventoryService.getInventoryData(inventoryParam).subscribe(data => {
        console.log('data', data)
        this.paginateView(data)
        this.isLoading = false
      }, error => {
        this.isLoading = false
      })


    }
      this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true
    }

    getvehicleInventory(){
      let inventoryParam = {
        userId: this.userId,
        role: this.role,
        startIdx: this.startIndex,
        resultSize: 9
      }
      this.sellInventoryService.getUserInventoryData(inventoryParam).subscribe(data => {
        console.log('data', data)
        this.paginateView(data)
        this.isLoading = false
      }, error => {
        this.isLoading = false
      })
    }


  /* Clear all dropdowns and disable these fileds on clearing make */

  onChangeMake(event: any) {
    if (event.value == null) {
      // this.resetFilters();
    } else {
      this.sellInputFormService.getModels(this.selectedMake.makeId)
        .subscribe(data => this.models = data)
      this.modelFlag = false
    //  this.yearStateFlag = false
    }
  }

  /* To clear state and year dropdown data and disable these fileds on clearing model */
  onChangeModel(event: any) {
    this.generateYears();
    if (event.value == null) {
     this.yearStateFlag = false
      this.selectedstate = { "stateId": "*", "state": "" }
      this.selectedYear = { "yearId": -1, "year": "*" }
    }  else this.yearStateFlag = false


  }

  search(): void {
    //sessionStorage.removeItem('filterOptions');
    //startIndex = 0;
    //currentPageIndex = 1;
    let filterQuery = {
      userId : window.sessionStorage.getItem('ID'),
      makeId: this.selectedMake.makeId,
      modelId: this.selectedModel.modelId,
      year: this.selectedYear == null ? 'wildcard' : this.selectedYear.year,
      startIdx: this.startIndex,
      resultSize: 9
    }
    //  this.storeFilterOpts();
      this.sellInventoryService.searchData(filterQuery, this.role).subscribe(data => {
       console.log(data.Success);
      //  console.log(JSON.parse(JSON.stringify(data)))
        console.log('data', data)
        this.paginateView(data)
        this.isLoading = false
      }, error => {
        this.isLoading = false
      //  this.handlePaginationOnRes(data);
      });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true;
  }



  populateFilterOptions(){
    this.sellInventoryService.getMakers().subscribe(data => this.makers = data);
    this.sellInventoryService.getStates().subscribe(data => this.states = data);
    this.sellInventoryService.getParts().subscribe(data => this.parts = data);
  }

  resetFilters(): void {
    this.selectedMake = { "makeId": -1, "make": "" };
    this.selectedModel = { "modelId": -1, "model": "" };
    this.selectedstate = { "stateId": "*", "state": "" };
    this.selectedYear = { "yearId": -1, "year": "*" };
    this.selectedPart = { "partId": -1, "part": "" };

    this.modelFlag = true;
    this.yearStateFlag = true;
    this.populateFilterOptions();
    this.getSellInventory();

    this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true;
    sessionStorage.removeItem('filterOptions');
  }

  /* Open popup..*/
  openModal(modalName,parentIndx) {
    this.deleteIndex = parentIndx;
     this.modalService.open(modalName);
  }

  /**generate index value */
  getIndex(indexValue){
    this.closeDuplicateWindow[indexValue]=true;
    this.closeCollapse[indexValue]=false;

    this.actionIndex = indexValue;
    console.log(indexValue);
    console.log(this.inventoryList[indexValue]);
    this.selectedPartList.push(this.inventoryList[indexValue]);
    console.log(this.selectedPartList);
  }

  /**Close modal using id */
  closeModal(id: string) {
    this.modalService.close(id);
  }

  /**Upload Image file */
  onFileChange(event,id) {

    if (event.target.files && event.target.files[0]) {
        /**User role */
        var filesAmount = event.target.files.length;
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target);
          this.showexistingImage[id] = true;
          //  console.log(event.target.result);
          // if (event.target.result.match(/image\/*/) == null) {
          //   this.msg = "Only images are supported";
          //   return;
          //   }
          var temp = event.target;
          // temp.append("name","file + id");
          this.images[id] = (event.target.result);

          // this.sellForm.patchValue({
          //   fileSource: this.sellForm
          // });
        }

        reader.readAsDataURL(event.target.files[0]);
       // this.selectedFile = event.target.files[0];
        this.multiImages[id] = (event.target.files[0]);

        console.log(this.multiImages);
      }
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     if (filesAmount > 4) {
    //       this.toaster.showError('Only four images can be uploaded','Upload Failure')
    //       return;
    //     } else {
    //       var reader = new FileReader();

    //       reader.onload = (event: any) => {
    //         console.log(event.target)
    //         if (event.target.result !== undefined) {
    //           //this.images = [];
    //           this.showexistingImage[id] = true;
    //         }
    //         this.images[id]=event.target.result;
    //         //  console.log(event.target.result);
    //         // if (event.target.result.match(/image\/*/) == null) {
    //         //   this.msg = "Only images are supported";
    //         //   return;
    //         //   }

    //         //  this.sellForm.patchValue({
    //         //     fileSource: this.sellForm
    //         //  });
    //       }

    //       reader.readAsDataURL(event.target.files[i]);
    //       // this.selectedFile =event.target.files[i];
    //        this.multiImages.push(event.target.files[i]);
    //       console.log(this.multiImages);
    //       // console.log(event.target.files[i]);
    //     }

    //   }
    // }
  }

  /**Duplicate the list */
  createDuplicateList(numberOfValue) {
    this.duplicateArray = [];
    this.multiImages=[];
    console.log(numberOfValue);
    if(numberOfValue >0 && numberOfValue <11) {
      this.duplicateFlag= true;
      let tempo =this.inventoryList[this.actionIndex];
      for (let i = 0; i < numberOfValue; i++) {
        var temp ={id : i};
        Object.assign(temp,tempo);
        console.log(temp)
       this.duplicateArray.push(temp);
       this.showexistingImage[i]=false;
       this.toDataURL(tempo.imageUri, (temp) => {
        let blob_t = this.dataURItoBlob(temp);
        this.multiImages[i] = blob_t;
      }

      );
      }
    }else{
      this.duplicateFlag= false;
      this.msg= "Value is greater than 10    "
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

  createDataSet(duplicateArray) {
   this.propertObject = [];
    for (let i = 0; i < duplicateArray.length; i++) {
      let vehicleAddRequest = {
        "make": duplicateArray[i].make,
        "makeId": duplicateArray[i].makeId,
        "model": duplicateArray[i].model,
        "modelId": duplicateArray[i].modelId,
        "year": duplicateArray[i].year,
        "partId": duplicateArray[i].partId,
        "part": duplicateArray[i].part,
        "username": window.sessionStorage.getItem("USERNAME"),
        "price":duplicateArray[i].price,
        "description": duplicateArray[i].description,
        "shipping": String(duplicateArray[i].shipping)
      }
      this.propertObject.push(vehicleAddRequest);
     // return
    }
  }

  submitDuplicateData() {
    console.log(this.duplicateArray)
    this.createDataSet(this.duplicateArray); // request object for duplicate..
    const frmdata = new FormData();
    console.log(this.propertObject);
    frmdata.append('partAddRequest',JSON.stringify(this.propertObject));
    for (var i = 0; i < this.multiImages.length; i++) {
      frmdata.append('images', this.multiImages[i], this.multiImages[i].name);
    }

    //  console.log('images',this.multiImages)
    this.sellInventoryService.submitDuplicateData(frmdata).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........

        this.toaster.showSuccess('Duplicate items have been uploaded successfully','Duplication Success')
        location.reload(true);
      },
      errorMessage => {
        console.log(errorMessage);
        //   this.error = errorMessage;
        //   this.isLoading = false;
      }
    );
  }

  /// table
  onRowEditInit(product) {
    //   this.clonedProducts[product.id] = {...product};
  }

  onRowEditSave(product) {
    if (product.price > 0) {
      //     delete this.clonedProducts[product.id];
      //    this.messageService.add({severity:'success', summary: 'Success', detail:'Product is updated'});
    }
    else {
      //     this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Price'});
    }
  }

  onRowEditCancel(product, index: number) {
    //    this.products2[index] = this.clonedProducts[product.id];
    //   delete this.products2[product.id];
  }

  /**Sold service call.. */
  markDataSold(partSellI){
    if(this.role== "JUNK_YARD_OWNER"){
      this.sellInventoryService.markDataSold(this.inventoryList[this.deleteIndex].partSellId).subscribe(
        resData => {
          console.log("resData", resData);

          this.toaster.showSuccess('Item sold and moved to sell history','Item Sold')
          this.closeModal('sold_modal');
          location.reload(true);

        },
        errorMessage => {
          console.log(errorMessage);
          //   this.error = errorMessage;
          //   this.isLoading = false;
        }
      );
    }else {
      this.sellInventoryService.markVehicleDataSold(this.inventoryList[this.deleteIndex].vehicleSells[0].sellId).subscribe(
        resData => {
          console.log("resData", resData);
          // setting data to session .........

          this.toaster.showSuccess('Item sold and moved to vehicle history','Item Sold')
        this.closeModal('sold_modal');
          location.reload(true);

        },
        errorMessage => {
          console.log(errorMessage);
          //   this.error = errorMessage;
          //   this.isLoading = false;
        }
      );

    }

  }

   /**Delete service call.. */
   markDeleteItem(partSellId){
     debugger;
     if(this.role== "JUNK_YARD_OWNER"){
      this.inventoryList[this.deleteIndex]
       let partSellIdValue = this.inventoryList[this.deleteIndex].partSellId;
      this.sellInventoryService.deleteFromInventory(partSellIdValue).subscribe(
        resData => {
          console.log("resData", resData);
          // setting data to session .........

          this.toaster.showSuccess('Item Deleted Successfully','Item Deleted')
          this.closeModal('delete_item');
          location.reload(true);
        },
        errorMessage => {
          console.log(errorMessage);
          //   this.error = errorMessage;
          //   this.isLoading = false;
        }
      );
     }else{
       debugger;
       console.log(partSellId);
       console.log( this.inventoryList[this.deleteIndex]);
      let vehId =  this.inventoryList[this.deleteIndex].vehicleSells[0].vehId;
      console.log( this.inventoryList[partSellId]);
      this.sellInventoryService.deleteVehicleFromInventory(vehId).subscribe(
        resData => {
          debugger;
          console.log("resData", resData);
          // setting data to session .........
          this.toaster.showSuccess('Item Deleted Successfully','Item Deleted')
         this.closeModal('delete_item');
          location.reload(true);
        },
        errorMessage => {
          console.log(errorMessage);
          //   this.error = errorMessage;
          //   this.isLoading = false;
        }
      );
     }

  }

  editFormData(indexValue){
 // collasple show and hide.
 this.closeDuplicateWindow[indexValue]=false;

 this.closeCollapse[indexValue]=true;
    console.log(this.inventoryList[indexValue]);
    this.formdata=this.inventoryList;
    this.sellInventoryService.subject.emit(this.inventoryList[indexValue]);
  }

  goToSellSection(){
    this.router.navigate(['../sell-form'], {relativeTo: this.route});
  }

  showText(id){
    this.isReadMore[id] = !this.isReadMore[id]
  }

  closeCollapsefun(index){
    if(this.closeCollapse[index] == undefined){
      this.closeCollapse[index] = false;
    }else {

      this.closeCollapse[index]=!this.closeCollapse[index];
    }
  }

  closeDuplicateCollapse(index){
    if(this.closeDuplicateWindow[index] == undefined){
      this.closeDuplicateWindow[index] = false;
    }else {

      this.closeDuplicateWindow[index]=!this.closeDuplicateWindow[index];
    }
  }


}
