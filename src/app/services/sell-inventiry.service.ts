import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


@Injectable()
export class SellInventoryService{
  private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
  private handleError: HandleError;



  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('BuyService');
  }
  getMakers(): Observable<{ makeId: number, make: string }[]> {
    const url = `${this.appUrl}/uvp/search/get/makers`;
    return this.http.get<{ makeId: number, make: string }[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["makers"];
        }), catchError(this.handleError('getMakers', []))
      );//end pipe
  }

  getModels(makeId: number): Observable<{ modelId: number, model: string }[]> {
    const url = `${this.appUrl}/uvp/search/get/models/${makeId}`;

    return this.http.get<{ makeId: number, make: string }[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["models"];
        }), catchError(this.handleError('getModels', []))
      );//end pipe
  }

  getStates(): Observable<{ stateId: number, state: string }[]> {
    const url = `${this.appUrl}/uvp/search/get/states`;

    return this.http.get<{ stateId: number, state: string }[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["states"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

//fetch part list ....
  getParts() {
    const url = `${this.appUrl}/uvp/search/get/parts`;
    return this.http.get<{ stateId: number, state: string }[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["parts"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

  getInventoryData(){
    const url = `${this.appUrl}/uvp/parts/get/75/Available/0/10`;
    return this.http.get<{}[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["userSellParts"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

}
