import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {BuyService} from '../../services/buy.service';


@Component({
	selector: 'app-welcom-page',
	templateUrl: './welcom-page.component.html',
	styleUrls: ['./welcom-page.component.css'],
	providers: [BuyService]
})
export class WelcomPageComponent implements OnInit, AfterViewChecked {
	@ViewChild('divToScroll') private divToScroll: ElementRef;

	makers: {"makeId": number, "make": string}[] = [];
	models: {"modelId": number, "model": string}[] = [];
	parts: {"partId": number, "part": string}[] = [];
	isLoading: boolean = false;
	modelFlag = true;
	partFlag = true;
	yearStateFlag = true;
	footerFlag: boolean = false;

	filteredData: any[] = [];
	selectedMake: {"makeId": number, "make": string} = {"makeId": -1, "make": ""};
	selectedModel: {"modelId": number, "model": string} = {"modelId": -1, "model": ""};
	selectedPart: {"partId": number, "part": string} = {"partId": -1, "part": ""};
	
	dataFlag: boolean = false;
	showToast: boolean = false;
	
	constructor(private buyService: BuyService) { }

	ngOnInit(): void {
		this.populateFilterOptions();
	}
	
	populateFilterOptions(){
		this.buyService.getMakers().subscribe(data => this.makers = data);
		this.buyService.getParts().subscribe(data => this.parts = data);
	}

	onChangeMake(event: any) {
		if(event.value == null){
			this.selectedMake = {"makeId": -1, "make": ""};
			this.selectedModel = {"modelId": -1, "model": ""};
			this.modelFlag = true;
			this.yearStateFlag = true;
			this.partFlag = true;
			this.filteredData = [];
		} else {
			this.buyService.getModels(this.selectedMake.makeId)
			.subscribe(data =>{
				this.models = data
			} );
			this.modelFlag = false;
		}
		this.selectedPart = {"partId": -1, "part": ""};
	}

	/* To clear state and year dropdown data and disable these fileds on clearing model */
	onChangeModel(event: any) {
		if(event.value == null){
			this.partFlag = true;
			this.yearStateFlag = true;
		} else {
			this.partFlag = false;
		}
	}
	
	onChangePart(event: any){
		if(event.value == null){
			this.yearStateFlag = true;
		} else {
			this.yearStateFlag = false;
		}
	}

	search(): void {
		this.isLoading = true;
		let filterQuery = {
			makeId : this.selectedMake.makeId,
			modelId: this.selectedModel.modelId,
			year: '*',
			stateId: '*',
			partId: this.selectedPart.partId,
			startIdx: 0,
			resultSize: 4
		}

		this.buyService.getBuyItemList(filterQuery, 'USER').subscribe(data => {
			this.filteredData = data;
			if(this.filteredData.length === 0)
				this.dataFlag = true;
			else this.dataFlag = false;
			this.isLoading = false;
		}, error => {
			console.log("Some error occured");
		});
	}
	//The AfterViewChecked triggers every time the view was checked
	ngAfterViewChecked() {        
		this.scrollToBottom();        
	} 

	displayFooter(){
		this.footerFlag = !this.footerFlag;
		//this.scrollToBottom();
	}

	scrollToBottom(): void {
		try {
			this.divToScroll.nativeElement.scrollTop = this.divToScroll.nativeElement.scrollHeight;
		} catch(err) { }                 
	}

}
