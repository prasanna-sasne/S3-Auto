import { Component, OnInit } from '@angular/core';
import { SellHistoryService } from '../../services/sell-history.service';

@Component({
	selector: 'app-sell-history',
	templateUrl: './sell-history.component.html',
	styleUrls: ['./sell-history.component.css'],
	providers: [SellHistoryService]
})
export class SellHistoryComponent implements OnInit {
	soldItems: any[] = [];
	private userId: number;
	private role: string;
	isLoading: boolean = true;

	nextRecordFlag: boolean = true;
	previousRecordFlag: boolean = true;
	startIndex = 0;
	currentPageIndex = 1;

	constructor(private sellService: SellHistoryService) {
		this.userId = JSON.parse(`${sessionStorage.getItem("ID")}`);
		this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');
	}

	// To get previous page data
	previousPage(): void {
		this.currentPageIndex--;
		this.startIndex -= 8;
		this.getSellHistory();
	}

	// To get next page data
	nextPage(): void {
		this.currentPageIndex++;
		this.startIndex += 8;
		this.getSellHistory();
	}

	getSellHistory(): void{
		let sellHistoryHeader = {
			userId: this.userId,
			role: this.role,
			startIdx: this.startIndex,
			resultSize: 9
		}
		this.sellService.getSoldInventory(sellHistoryHeader).subscribe(data => {
			this.paginateView(data);
			this.isLoading = false;
		}, error=> {
			this.isLoading = false;
		});
		
		this.currentPageIndex > 1 ? this.previousRecordFlag = false: this.previousRecordFlag = true;
	}

	paginateView(data: any[]){
		//deep-copy of data array to buyItems
		this.soldItems = JSON.parse(JSON.stringify(data));
		//trim last record
		this.soldItems.splice(8, 1);

		if(data.length % 9 == 0){
			this.nextRecordFlag = false;
		} else this.nextRecordFlag = true;
	}

	ngOnInit(): void {
		this.getSellHistory();
		sessionStorage.removeItem('filterOptions');
	}

}
