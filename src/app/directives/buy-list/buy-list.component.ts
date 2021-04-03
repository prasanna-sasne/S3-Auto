import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BuyItems } from '../../shared/models/buyItems.model';
import { BuyService } from '../../services/buy.service';

@Component({
  selector: 'app-buy-list',
  templateUrl: './buy-list.component.html',
  styleUrls: ['./buy-list.component.css'],
  providers: [BuyService]
})

export class BuyListComponent implements OnInit {
  makers: {"makeId": number, "make": string}[] = [];
  years: {"yearId": number, "year": number}[] = [];
  models: {"modelId": number, "model": string}[] = [];
  parts: {"partId": number, "part": string}[] = [];
  states: {"stateId": number, "state": string}[] = [];
  buyItems: BuyItems[] = [];
  isLoading: boolean = true;
  contactSeller: boolean = false;
  username: string = "";

  //Initial values for select
  selectedMake: {"makeId": number, "make": string} = {"makeId": -1, "make": ""};
  selectedModel: {"modelId": number, "model": string} = {"modelId": -1, "model": ""};
  selectedstate: {"stateId": string, "state": string} = {"stateId": "*", "state": ""};
  selectedYear: {"yearId": number, "year": string} = {"yearId": -1, "year": "*"};
  selectedPart: {"partId": number, "part": string} = {"partId": -1, "part": ""};

  //Flag for validation of select control
  modelFlag:boolean = true;
  yearStateFlag: boolean = true;
  nextRecordFlag: boolean = true;
  previousRecordFlag: boolean = true;
  startIndex = 0;
  currentPageIndex = 1;
  itemDetails: any = [];
  stars: number[] = [];

  role: string = "";

  constructor(private buyService: BuyService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.stars = Array(5).fill(0).map((x,i)=>i);
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');
  }

  // Generate list of past 50 years from current year
  generateYears():void {
    let currentYear = new Date().getFullYear();
    let startYear = (currentYear-50) || 1980;
    let index = 0;
    while ( currentYear >= startYear ) {
      this.years.push({"year": currentYear--, "yearId": index++});
    }
  }


  /* Clear all dropdowns and disable these fileds on clearing make */

  onChangeMake(event: any) {
    if(event.value == null){
      this.resetFilters();
    } else {
      this.buyService.getModels(this.selectedMake.makeId)
      .subscribe(data => this.models = data);
      this.modelFlag = false;
    }
  }

  /* To clear state and year dropdown data and disable these fileds on clearing model */
  onChangeModel(event: any) {
    if(event.value == null){
      this.yearStateFlag = true;
      this.selectedstate = {"stateId": "*", "state": ""};
      this.selectedYear = {"yearId": -1, "year": "*"};
    } else {
      if(this.role.localeCompare("USER") === 0){
        if(this.selectedPart !== null && this.selectedPart.part !== "")
          this.yearStateFlag = false;
      } else this.yearStateFlag = false;

    }
  }

  onChangePart(event: any){
    if(event.value == null){
      this.yearStateFlag = true;
    } else {
      if(this.selectedModel !== null && this.selectedModel.model !== "")
        this.yearStateFlag = false;
    }
  }

  // To get previous page data
  previousPage(): void {
    this.currentPageIndex--;
    this.startIndex -= 8;
    this.search();
  }

  // To get next page data
  nextPage(): void {
    this.currentPageIndex++;
    this.startIndex += 8;
    this.search();
  }

  // To select the filter option by default on page load
  storeFilterOpts(){
    let filterOptions = {
      make : this.selectedMake,
      model : this.selectedModel,
      year : this.selectedYear,
      state: this.selectedstate,
      startIdx: this.startIndex,
      resultSize: 9,
      currentPage : this.currentPageIndex
    }
    if(this.selectedPart.part != ""){
      filterOptions["part"] = this.selectedPart;
    }
    sessionStorage.setItem('filterOptions', JSON.stringify(filterOptions));
  }

  // Filter query for invetory buy
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
    this.storeFilterOpts();
    this.buyService.getBuyItemList(filterQuery, this.role).subscribe(data => {
      this.handlePaginationOnRes(data);
    });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true;
  }

  handlePaginationOnRes(data: BuyItems[]){
    //deep-copy of data array to buyItems
    this.buyItems = JSON.parse(JSON.stringify(data));
   
    //trim last record
    this.buyItems.splice(8, 1);
    if(data.length % 9 == 0){
      this.nextRecordFlag = false;
    } else this.nextRecordFlag = true;
     this.isLoading = false;
  }

  populateFilterOptions(){
    this.buyService.getMakers().subscribe(data => this.makers = data);
    this.buyService.getStates().subscribe(data => this.states = data);
    this.buyService.getParts().subscribe(data => this.parts = data);
  }

  // To reset all filterdata and load data without filter
  resetFilters(): void {
    this.selectedMake = {"makeId": -1, "make": ""};
    this.selectedModel = {"modelId": -1, "model": ""};
    this.selectedstate = {"stateId": "*", "state": ""};
    this.selectedYear =  {"yearId": -1, "year": "*"};
    this.selectedPart = {"partId": -1, "part": ""};

    this.modelFlag = true;
    this.yearStateFlag = true;
    this.populateFilterOptions();
    this.buyService.getBuyItemList({}, this.role).subscribe(data => {
      this.handlePaginationOnRes(data);
    });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true;
    sessionStorage.removeItem('filterOptions');
  }

  navigateItemDetails(item: BuyItems) {
    this.itemDetails = this.buyService.getItemResponse(item);
    sessionStorage.setItem('itemDetails', JSON.stringify(this.itemDetails));
    // this.router.navigate(['../item-details'], {relativeTo: this.route});
    this.router.navigate(['../../item-details'], {relativeTo: this.route});
  }

  setFilterData(filterOpts: any){
    this.selectedMake = filterOpts.make;
    this.buyService.getModels(this.selectedMake.makeId)
    .subscribe(data => {
      this.models = data;
      this.selectedModel = filterOpts.model;
      this.modelFlag = false;
      this.selectedstate = filterOpts.state;
      this.selectedYear = filterOpts.year;
      this.yearStateFlag = false;
      if(filterOpts.part != undefined){
        this.selectedPart = filterOpts.part;
      }
      this.startIndex = filterOpts.startIdx;
      this.currentPageIndex = filterOpts.currentPage;
      this.search();    
    });
    
  }

  closeNav(closeChatWindow: {closeNav:boolean}){
    this.contactSeller = closeChatWindow.closeNav;
  }

  connectWithSeller(user: string){
    this.contactSeller = true;
    this.username = user;
  }

  newMsgPresent(showBell: {notificationPresent: boolean}){
    console.log(showBell.notificationPresent);
  }

  ngOnInit(): void { 
    this.generateYears();
    let filterOpts = JSON.parse(`${sessionStorage.getItem("filterOptions")}`);
    if(filterOpts !== null && filterOpts !== undefined){
      this.populateFilterOptions();
      this.setFilterData(filterOpts);
    } else {
      this.resetFilters();
    }
  }

}
