import { Component, OnInit } from '@angular/core'
import { LazyLoadEvent } from 'primeng/api'
import { SellInventoryService } from './../../services/sell-inventiry.service'
import {SellInputFormService} from './../../services/sell-input-form.service'
import { ModalService } from './../../_modal/modal.service'
import { windowWhen } from 'rxjs/operators'

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
  private userId: number
  public role: string
  isLoading: boolean = true
  numberOfValue: number = 0;

  nextRecordFlag: boolean = true
  previousRecordFlag: boolean = true
  startIndex = 0
  currentPageIndex = 1
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
    private modalService: ModalService) {
    this.userId = JSON.parse(`${sessionStorage.getItem("ID")}`)
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}')
  }

  ngOnInit(): void {
    this.getSellInventory();
    this.generateYears();
    this.getMakers();
    sessionStorage.removeItem('filterOptions')
  }
  // To get previous page data
  previousPage(): void {
    this.currentPageIndex--
    this.startIndex -= 8
    //	this.getSellHistory()
  }

  // To get next page data
  nextPage(): void {
    this.currentPageIndex++
    this.startIndex += 8
    //	this.getSellHistory()
  }



  paginateView(data: any[]) {
    //deep-copy of data array to buyItems
    this.inventoryList = JSON.parse(JSON.stringify(data))
    //trim last record
    this.inventoryList.splice(8, 1)

    if (data.length % 9 == 0) {
      this.nextRecordFlag = false
    } else this.nextRecordFlag = true
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
      let sellHistoryHeader = {
        userId: this.userId,
        role: this.role,
        startIdx: this.startIndex,
        resultSize: 9
      }
      this.sellInventoryService.getInventoryData().subscribe(data => {
        console.log('data', data)
        this.paginateView(data)
        this.isLoading = false
      }, error => {
        this.isLoading = false
      })

      this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true
    }


  /* Clear all dropdowns and disable these fileds on clearing make */

  onChangeMake(event: any) {
    if (event.value == null) {
      // this.resetFilters();
    } else {
      this.sellInputFormService.getModels(this.selectedMake.makeId)
        .subscribe(data => this.models = data)
      this.modelFlag = false
    }
  }

  /* To clear state and year dropdown data and disable these fileds on clearing model */
  onChangeModel(event: any) {
    if (event.value == null) {
      this.yearStateFlag = true
      this.selectedstate = { "stateId": "*", "state": "" }
      this.selectedYear = { "yearId": -1, "year": "*" }
    } else {
      if (this.role.localeCompare("USER") === 0) {
        if (this.selectedPart !== null && this.selectedPart.part !== "")
          this.yearStateFlag = false
      } else this.yearStateFlag = false

    }
  }

  // onChangePart(event: any) {
  //   if (event.value == null) {
  //     this.yearStateFlag = true
  //   } else {
  //     if (this.selectedModel !== null && this.selectedModel.model !== "")
  //       this.yearStateFlag = false
  //   }
  // }

  search(): void {
    //sessionStorage.removeItem('filterOptions');
    //startIndex = 0;
    //currentPageIndex = 1;
    let filterQuery = {
      userId : window.sessionStorage.getItem('ID'),
      makeId: this.selectedMake.makeId,
      modelId: this.selectedModel.modelId,
      year: this.selectedYear == null ? '*' : this.selectedYear.year,
      startIdx: this.startIndex,
      resultSize: 9
    }
    //  this.storeFilterOpts();
      this.sellInventoryService.searchData(filterQuery, this.role).subscribe(data => {
      //  console.log(data.Success);
        console.log(JSON.parse(JSON.stringify(data)))
        console.log('data', data)
        this.paginateView(data)
        this.isLoading = false
      }, error => {
        this.isLoading = false
      //  this.handlePaginationOnRes(data);
      });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true;
  }

  resetFilters(): void {
    this.selectedMake = { "makeId": -1, "make": "" };
    this.selectedModel = { "modelId": -1, "model": "" };
    this.selectedstate = { "stateId": "*", "state": "" };
    this.selectedYear = { "yearId": -1, "year": "*" };
    this.selectedPart = { "partId": -1, "part": "" };

    this.modelFlag = true;
    this.yearStateFlag = true;
    //  //   this.populateFilterOptions();
    //     this.buyService.getBuyItemList({}, this.role).subscribe(data => {
    //  //     this.handlePaginationOnRes(data);
    //     });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false : this.previousRecordFlag = true;
    sessionStorage.removeItem('filterOptions');
  }

  /* Open popup..*/
  openModal(modalName) {
     this.modalService.open(modalName);
  }

  /**generate index value */
  getIndex(indexValue){
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
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        if (filesAmount > 4) {
          alert('you can select four images only ');
          return;
        } else {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            console.log(event.target)
            if (event.target.result !== undefined) {
              //this.images = [];
              this.showexistingImage[id] = true;
            }
            this.images[id]=event.target.result;
            //  console.log(event.target.result);
            // if (event.target.result.match(/image\/*/) == null) {
            //   this.msg = "Only images are supported";
            //   return;
            //   }

            //  this.sellForm.patchValue({
            //     fileSource: this.sellForm
            //  });
          }

          reader.readAsDataURL(event.target.files[i]);
          // this.selectedFile =event.target.files[i];
           this.multiImages.push(event.target.files[i]);
          console.log(this.multiImages);
          // console.log(event.target.files[i]);
        }

      }
    }
  }

  /**Duplicate the list */
  createDuplicateList(numberOfValue) {
    this.duplicateArray = [];
    console.log(numberOfValue);
    let tempo =this.inventoryList[this.actionIndex];
    for (let i = 0; i < numberOfValue; i++) {
      var temp ={id : i};
      Object.assign(temp,tempo);
      console.log(temp)
     this.duplicateArray.push(temp);
     this.showexistingImage[i]=false;
    // this.images[0]
    }

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
        alert('Uploaded Successfully.');
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
  markDataSold(partSellId){
    this.sellInventoryService.markDataSold(partSellId).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        alert('Item sold and moved to sell history');
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

   /**Delete service call.. */
   markDeleteItem(partSellId){
    this.sellInventoryService.deleteFromInventory(partSellId).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        alert('Deleted Successfully.');
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
