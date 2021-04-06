import { Injectable } from '@angular/core';
import { TicketItems } from '../shared/models/tickets.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private ticketItems: TicketItems[] = [];
  private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp';  // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient,  httpErrorHandler: HttpErrorHandler){
    this.handleError = httpErrorHandler.createHandleError('BuyService');
  }
  public getTicketsList():Observable<any>
  {
    const url = `${this.appUrl}/issues/get/`
    return this.http.get<any[]>(url)
      .pipe(
        map(response => {
          this.generateTickets(response["Success"]["0"]["issues"]);
          return this.ticketItems;

        }), catchError(this.handleError('getTicketsList', []))
      );//end pipe
  }

  public generateTickets(dataArray: any)  {
    this.ticketItems=[];
    dataArray.forEach(element=>{
      const innerelements = {
        issueId: element.issueId,
        ticketNumber: element.ticketNumber,
        description: element.description,
        email: element.email
      };
      this.ticketItems.push(innerelements);
    })

  }


  deleteData(issueId)
  {
    return this.http.delete('http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp/issues/delete/'+issueId);

  }
}
