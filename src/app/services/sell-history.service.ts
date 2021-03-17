import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { BuyItems } from '../shared/models/buyItems.model';

@Injectable({
	providedIn: 'root'
})
export class SellHistoryService {
	private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp';  // URL to web api
	private handleError: HandleError;
	private soldItems: BuyItems[] = [];

	constructor(private http: HttpClient,  httpErrorHandler: HttpErrorHandler) { 
		this.handleError = httpErrorHandler.createHandleError('SellHistoryService');
	}

	getSoldInventory(queryHeader: any): Observable<any[]>{
		let url : string = `${this.appUrl}`;
		this.soldItems = [];
		queryHeader.role.localeCompare("JUNK_YARD_OWNER") === 0 ? url +=  `/vehicles` : url +=  `/parts`;
		url += `/get/${queryHeader.userId}/Sold/${queryHeader.startIdx}/${queryHeader.resultSize}`;

		return this.http.get<any[]>(url)
		.pipe(
			map( response => {
				//get sold vehicles
				if(queryHeader.role.localeCompare("JUNK_YARD_OWNER") === 0){
					response["Success"]["0"]["userSellVehicles"].forEach( (currentValue, index) => {
						this.soldItems.push(currentValue["vehicleSells"]["0"]);
					});	
				} else { //get sold parts
					console.log(response["Success"]["0"]["userSellParts"]);
					this.soldItems = response["Success"]["0"]["userSellParts"];	
				}
				return this.soldItems;
			}),catchError(this.handleError('getSoldInventory', []))
			);//end pipe
	}
}
