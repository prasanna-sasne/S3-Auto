import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BuyService } from '../../../services/buy.service';

@Component({
	selector: 'app-item-details',
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.css'],
	providers: [BuyService]
})
export class ItemDetailsComponent implements OnInit {
	@Output('renderBuySection') flag = new EventEmitter<boolean>(); 
	rating: number = 0;
	selectedItemDetail: any;
	userId: number;
	
	postRequestAlert: boolean = false;
	postRatingMessage: string;
	ratingFound: boolean = true;
	showToast: boolean = false;

	constructor(private buyService: BuyService,
		private router: Router,
		private route: ActivatedRoute) { 
		this.selectedItemDetail = JSON.parse(`${sessionStorage.getItem("itemDetails")}`);
		this.userId = JSON.parse(`${sessionStorage.getItem("ID")}`);
	}

	goToBuySection(){
		sessionStorage.removeItem('itemDetails');
		//this.flag.emit(false);
		//this.router.navigate(['../buy-list'], {relativeTo: this.route});
		this.router.navigate(['../s3-auto/buy-list'], {relativeTo: this.route});
	}
	
	getPreviousRating(){
		let obj = {
			userId: this.userId,
			partSellId: this.selectedItemDetail.partSellId
		}
		this.buyService.getRating(obj)
		.subscribe(data => {
			this.rating = data.rating;
		}, error => {
			this.ratingFound = false;
		});
	}

	postRating(){
		let postRatingObj = {
			junkYardId: this.selectedItemDetail.junkYardId, 
			rating: this.rating,
			partSellId: this.selectedItemDetail.partSellId,
			userId: this.userId	
		}
		this.buyService.postRating(postRatingObj)
		.subscribe(data => {
			this.ratingFound = true;
			this.postRatingMessage = data;
			this.hideAlert();
		},
		error => {
			this.postRatingMessage = error;	
			this.hideAlert();
		});
		this.showToast = false;
	}

	hideAlert(){
		this.postRequestAlert = true;
		setTimeout(()=>{                         
			this.postRequestAlert = false;
		}, 5000);
	}

	//If user do not want to provide rating then set rating to zero
	doNotRate(){
		this.showToast = false;
		this.rating = 0;
	}

	ngOnInit(): void {
		if(this.selectedItemDetail.partSellId !== undefined){
			this.getPreviousRating();
		}	
	}
}
