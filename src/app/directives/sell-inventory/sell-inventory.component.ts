import { Component, OnInit } from '@angular/core'
import { LazyLoadEvent } from 'primeng/api'
import {SellInventoryService} from './../../services/sell-inventiry.service'
import {SellHistoryService} from './../../services/sell-history.service'
import {ModalService } from'./../../_modal/modal.service'
@Component({
  selector: 'app-sell-inventory',
  templateUrl: './sell-inventory.component.html',
  styleUrls: ['./sell-inventory.component.css']
})
export class SellInventoryComponent implements OnInit {
	inventoryList: any[] = []
	private userId: number
	public role: string
	isLoading: boolean = true
  actionIndex;
  selectedPartList;

	nextRecordFlag: boolean = true
	previousRecordFlag: boolean = true
	startIndex = 0
	currentPageIndex = 1


  //Search parameters.....
  makers: {"makeId": number, "make": string}[] = []
  years: {"yearId": number, "year": number}[] = []
  models: {"modelId": number, "model": string}[] = []
  parts: {"partId": number, "part": string}[] = []
  states: {"stateId": number, "state": string}[] = []
  contactSeller: boolean = false
  username: string = ""

  //Initial values for select
  selectedMake: {"makeId": number, "make": string} = {"makeId": -1, "make": ""}
  selectedModel: {"modelId": number, "model": string} = {"modelId": -1, "model": ""}
  selectedstate: {"stateId": string, "state": string} = {"stateId": "*", "state": ""}
  selectedYear: {"yearId": number, "year": string} = {"yearId": -1, "year": "*"}
  selectedPart: {"partId": number, "part": string} = {"partId": -1, "part": ""}

  //Flag for validation of select control
  modelFlag:boolean = true
  yearStateFlag: boolean = true
  itemDetails: any = []
  stars: number[] = []

	constructor(private sellService: SellHistoryService,private sellInventoryService:SellInventoryService,
    private modalService:ModalService) {
		this.userId = JSON.parse(`${sessionStorage.getItem("ID")}`)
		this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}')
	}

	ngOnInit(): void {
		this.getSellInventory()
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

	getSellInventory(): void{
		let sellHistoryHeader = {
			userId: this.userId,
			role: this.role,
			startIdx: this.startIndex,
			resultSize: 9
		}
		this.sellInventoryService.getInventoryData().subscribe(data => {
      console.log('data',data)
			this.paginateView(data)
			this.isLoading = false
		}, error=> {
			this.isLoading = false
		})

		this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true
	}

	paginateView(data: any[]){
		//deep-copy of data array to buyItems
		this.inventoryList = JSON.parse(JSON.stringify(data))
		//trim last record
		this.inventoryList.splice(8, 1)

		if(data.length % 9 == 0){
			this.nextRecordFlag = false
		} else this.nextRecordFlag = true
	}

  generateYears():void {
    let currentYear = new Date().getFullYear()
    let startYear = (currentYear-50) || 1980
    let index = 0
    while ( currentYear >= startYear ) {
      this.years.push({"year": currentYear--, "yearId": index++})
    }
  }


  /* Clear all dropdowns and disable these fileds on clearing make */

  onChangeMake(event: any) {
    if(event.value == null){
     // this.resetFilters();
    } else {
      this.sellInventoryService.getModels(this.selectedMake.makeId)
      .subscribe(data => this.models = data)
      this.modelFlag = false
    }
  }

  /* To clear state and year dropdown data and disable these fileds on clearing model */
  onChangeModel(event: any) {
    if(event.value == null){
      this.yearStateFlag = true
      this.selectedstate = {"stateId": "*", "state": ""}
      this.selectedYear = {"yearId": -1, "year": "*"}
    } else {
      if(this.role.localeCompare("USER") === 0){
        if(this.selectedPart !== null && this.selectedPart.part !== "")
          this.yearStateFlag = false
      } else this.yearStateFlag = false

    }
  }

  onChangePart(event: any){
    if(event.value == null){
      this.yearStateFlag = true
    } else {
      if(this.selectedModel !== null && this.selectedModel.model !== "")
        this.yearStateFlag = false
    }
  }

  search() : void {
    //sessionStorage.removeItem('filterOptions');
    //startIndex = 0;
    //currentPageIndex = 1;
    let filterQuery = {
      makeId : this.selectedMake.makeId,
      modelId: this.selectedModel.modelId,
      year: this.selectedYear == null? '*': this.selectedYear.year,
      stateId: this.selectedstate == null ? '*': this.selectedstate.stateId,
      startIdx: this.startIndex,
      resultSize: 9
    }

    if(this.selectedPart.part != ""){
      filterQuery["partId"] = this.selectedPart.partId;
    }
  // //  this.storeFilterOpts();
  //   this.buyService.getBuyItemList(filterQuery, this.role).subscribe(data => {
  // //    this.handlePaginationOnRes(data);
  //   });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true;
  }

  resetFilters(): void {
    this.selectedMake = {"makeId": -1, "make": ""};
    this.selectedModel = {"modelId": -1, "model": ""};
    this.selectedstate = {"stateId": "*", "state": ""};
    this.selectedYear =  {"yearId": -1, "year": "*"};
    this.selectedPart = {"partId": -1, "part": ""};

    this.modelFlag = true;
    this.yearStateFlag = true;
//  //   this.populateFilterOptions();
//     this.buyService.getBuyItemList({}, this.role).subscribe(data => {
//  //     this.handlePaginationOnRes(data);
//     });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true;
    sessionStorage.removeItem('filterOptions');
  }

  openModal(id: string,indexValue) {
   this.actionIndex =indexValue;
   console.log(indexValue);
    this.modalService.open(id);
   console.log(this.inventoryList[indexValue]);
this.selectedPartList = this.inventoryList[indexValue];
  }

  closeModal(id: string){
    this.modalService.close(id);
  }


}
