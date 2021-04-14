import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { Subject } from 'rxjs';

const subject = new Subject<number>();

interface ResponseData {
  Success: [
    "Successfully added data."
  ]
}

@Injectable()
export class SellInventoryService {
  private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
  private handleError: HandleError;
  subject = new EventEmitter<object>();

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
          console.log("parts cal incvent")
          return response["Success"]["0"]["parts"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

  getInventoryData(inventoryParam) {
    const url = `${this.appUrl}/uvp/parts/get/${inventoryParam.userId}/Available/${inventoryParam.startIdx}/${inventoryParam.resultSize}`;
    return this.http.get<{}[]>(url)
      .pipe(
        map(response => {
          return response["Success"]["0"]["userSellParts"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

  getUserInventoryData(inventoryParam){
    ///uvp/vehicles/get/{userId}/{status}/{startIdx}/{resultSize}
    const url = `${this.appUrl}/uvp/vehicles/get/${inventoryParam.userId}/Available/${inventoryParam.startIdx}/${inventoryParam.resultSize}`;
    return this.http.get<{}[]>(url)
      .pipe(
        map(response => {
          console.log(response["Success"][0]["userSellVehicles"])
          return response["Success"]["0"]["userSellVehicles"];
        }), catchError(this.handleError('getstates', []))
      );//end pipe
  }

  submitDuplicateData(submitDuplicateData) {
    // http://localhost:8080/uvp/parts/duplicate
    console.log('submitDuplicateData--', submitDuplicateData);
    return this.http
      .post<ResponseData>(
        `${this.appUrl}/uvp/parts/duplicate`,
        submitDuplicateData
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

  deleteVehicleFromInventory(vehId){
let headers = new Headers();
    //	headers.append('Content-Type', 'application/json');
    //headers.append('Access-Control-Allow-Origin','*');
    const url = `${this.appUrl}/uvp/vehicles/delete/${vehId}`;
    return this.http.delete(url)
      .pipe(map(response => {
        console.log(response);
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


  deleteFromInventory(partSellId) {
    let headers = new Headers();
    //	headers.append('Content-Type', 'application/json');
    //headers.append('Access-Control-Allow-Origin','*');
    const url = `${this.appUrl}/uvp/parts/delete/${partSellId}`;
    return this.http.delete(url)
      .pipe(map(response => {
        console.log(response);
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

  markDataSold(partSellId) {
    console.log(partSellId);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.appUrl}/uvp/parts/sold/${partSellId}`;
    return this.http.put(url, { headers: headers })
      .pipe(map(response => {
        console.log(response);
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
  markVehicleDataSold(vehId){
    console.log(vehId);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.appUrl}/uvp/vehicles/sold/${vehId}`;
    return this.http.put(url, { headers: headers })
      .pipe(map(response => {
        console.log(response);
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

  searchData(filterQuery, role) {
    let url ="";
    if(role == 'JUNK_YARD_OWNER'){
       url = `${this.appUrl}/uvp/parts/get/${filterQuery.userId}/${filterQuery.makeId}/${filterQuery.modelId}/${filterQuery.year}/${filterQuery.startIdx}/${filterQuery.resultSize}`;
       return this.http.get<{}[]>(url)
       .pipe(
         map(response => {
           console.log(response)
           return response["Success"]["0"]["userSellParts"];
         }), catchError(this.handleError('getstates', []))
       );//end pipe
      }else {
       url = `${this.appUrl}/uvp/vehicles/get/${filterQuery.userId}/${filterQuery.makeId}/${filterQuery.modelId}/${filterQuery.year}/${filterQuery.startIdx}/${filterQuery.resultSize}`;
       return this.http.get<{}[]>(url)
       .pipe(
         map(response => {
           console.log(response)
           return response["Success"]["0"]["userSellVehicles"];
         }), catchError(this.handleError('getstates', []))
       );//end pipe
      }
  }

  editSelectedItem(partSellId,selectedFile,partAddRequest){
   // /uvp/parts/update/{partSellId} <-------- update
   const data = new FormData();
    data.append('partAddRequest', JSON.stringify(partAddRequest));
    data.append('images',  selectedFile ,selectedFile.name);

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // };
   const url = `${this.appUrl}/uvp/parts/update/${partSellId}`;
    return this.http.put(url ,data)
      .pipe(map(response => {
        console.log(response);
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

  editSellFormVehicle(vehId,multiImages,vehicleAddRequest) {
    // console.log('request data ', partAddRequest);

     // const data = new FormData();
     // data.append('partAddRequest', JSON.stringify(partAddRequest));
     // data.append('images',  selectedFile ,selectedFile.name);
     const frmdata = new FormData();
     frmdata.append('vehicleAddRequest', JSON.stringify(vehicleAddRequest));

     for (var i = 0; i < multiImages.length; i++) {
       frmdata.append('images', multiImages[i], multiImages[i].name);
     }
     return this.http
       .put<ResponseData>(
        `${this.appUrl}/uvp/vehicles/update/${vehId}`,
        frmdata
       )
       .pipe(
         catchError(errorRes => {
           let errorMessage = 'An unknown error occurred!';
           if (!errorRes.Error || !errorRes.Error.error) {
             return throwError(errorMessage);
           }else if(errorRes.Error !== null){
            errorMessage =errorRes.Error;
            return throwError(errorRes.Error);
           }else
           return throwError(errorMessage);
         })
       );
   }

}
