import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class ChatMessageService {
	private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp';  
	constructor(private http: HttpClient) { }

	getUserChat(username: string){
		const url = `${this.appUrl}/chat/get/${username}`;

		return this.http.get<any[]>(url)
		.pipe(
			map( response => {  
				return response["Success"]["0"]; 
			}),catchError(errorRes => {
				let errorMessage = 'An unknown error occurred!';
				if (errorRes.status !== 400) {
					return throwError(errorMessage);
				} else {
					return throwError(errorRes.error.Error[0]);
				}
			})
			);//end pipe
	}

	markConvAsRead(readObj: any){
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		
		const url = `${this.appUrl}/chat/update/${readObj.sender}/${readObj.receiver}/${readObj.read}`;
		return this.http.put(url, {headers: headers})
		.pipe(map(response => {
			return response; 
		}), catchError(errorRes => {
			let errorMessage = 'An unknown error occurred!';
			if (errorRes.status !== 400) {
				return throwError(errorMessage);
			} else {
				return throwError(errorRes.error.Error[0]);
			}
		})
		);
	}
}
