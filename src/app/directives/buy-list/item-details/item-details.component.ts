import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-item-details',
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
	@Output('renderBuySection') flag = new EventEmitter<boolean>(); 
	rating: number = 0;
	selectedItemDetail = JSON.parse(`${sessionStorage.getItem("itemDetails")}`);
	constructor() { }

	ngOnInit(): void {}

	goToBuySection(){
		sessionStorage.removeItem('itemDetails');
		this.flag.emit(false);
	}

	postRating(){
		console.log("rating clicked");
	}
}
