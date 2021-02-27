import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
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

  //Initial values for select
  selectedMake: {"makeId": number, "make": string} = {"makeId": 0, "make": ""};
  selectedModel: {"modelId": number, "model": string} = {"modelId": 0, "model": ""};
  selectedstate: {"stateId": string, "state": string} = {"stateId": "*", "state": ""};
  selectedYear: {"yearId": number, "year": string} = {"yearId": 0, "year": "*"};
  selectedPart: {"partId": number, "part": string} = {"partId": 0, "part": ""};

  //Flag for validation of select control
  modelFlag:boolean = true;
  yearStateFlag: boolean = true;
  rating: number = 2;
  nextRecordFlag: boolean = true;
  previousRecordFlag: boolean = true;
  startIndex = 0;
  currentPageIndex = 1;

  constructor(private buyService: BuyService) { 
    this.generateYears();
    this.resetFilters();
  }

  // Generate list of past 50 years from current year 
  generateYears():void {
    var currentYear = new Date().getFullYear();
    let startYear = (currentYear-50) || 1980;  
    let index = 0;
    while ( currentYear >= startYear ) {
      this.years.push({"year": currentYear--, "yearId": index++});
    }
  }

  /* Clear all dropdowns and disable these fileds on clearing make */ 
  onChangeMake(event: any) {
    if(event.value == null){
      this.selectedModel = {"modelId": 0, "model": ""};
      this.selectedstate = {"stateId": "*", "state": ""};
      this.selectedYear = {"yearId": 0, "year": "*"};
      this.modelFlag = true;
      this.yearStateFlag = true; 
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
      this.selectedYear = {"yearId": 0, "year": "*"};
    } else {
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

  // Filter query for invetory buy
  search() : void {
    let filterQuery = {
      makeId : this.selectedMake.makeId,
      modelId: this.selectedModel.modelId,
      year: this.selectedYear == null? '*': this.selectedYear.year,
      stateId: this.selectedstate == null ? '*': this.selectedstate.stateId,
      startIdx: this.startIndex,
      resultSize: 9
    }
    this.buyService.getBuyVehicles(filterQuery).subscribe(data => {
      //deep-copy of data array to buyItems
      this.buyItems = JSON.parse(JSON.stringify(data));
      //trim last record
      this.buyItems.splice(8, 1);

      // console.log(this.buyItems);
      if(data.length % 9 == 0){
        this.nextRecordFlag = false;
      } else this.nextRecordFlag = true;  
    });
    this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true; 
    
  }

  // To reset all filterdata and load data without filter
  resetFilters(): void {
    this.selectedMake = {"makeId": 0, "make": ""};
    this.selectedModel = {"modelId": 0, "model": ""};
    this.selectedstate = {"stateId": "*", "state": ""};
    this.selectedYear = {"yearId": 0, "year": "*"};
    this.modelFlag = true;
    this.buyService.getMakers().subscribe(data => this.makers = data);
    this.buyService.getStates().subscribe(data => this.states = data);
    this.buyService.getParts().subscribe(data => this.parts = data);
    this.buyService.getBuyVehicles({}).subscribe(data => this.buyItems= data);
  }

  ngOnInit(): void { }

}
