import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

interface ResponseData {
  Success: [
    "User successfully registered."
  ]
}
@Injectable()
export class SellInputFormService {
  private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
  private handleError: HandleError;
  private itemResponseList: any[];

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

//parts service call.....
  submitSellFormPart(selectedFile, partAddRequest) {
    console.log('request data ', partAddRequest);

    const data = new FormData();
    data.append('partAddRequest', JSON.stringify(partAddRequest));
    data.append('images',  selectedFile ,selectedFile.name);
    return this.http
      .post<ResponseData>(
        `${this.appUrl}/uvp/parts/add`,
        data
      )
      .pipe(
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already';
          }
          return throwError(errorMessage);
        })
      );
  }

  //Vehicle service call...
  submitSellFormVehicle(data) {
     // console.log('request data ', partAddRequest);

      // const data = new FormData();
      // data.append('partAddRequest', JSON.stringify(partAddRequest));
      // data.append('images',  selectedFile ,selectedFile.name);
      return this.http
        .post<ResponseData>(
          `${this.appUrl}/uvp/vehicles/add`,
          data
        )
        .pipe(
          catchError(errorRes => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorRes.error || !errorRes.error.error) {
              return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
            }
            return throwError(errorMessage);
          })
        );
    }

}
