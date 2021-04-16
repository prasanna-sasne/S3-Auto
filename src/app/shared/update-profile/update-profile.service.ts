import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../services/http-error-handler.service';

interface UpdateProfileResponseData {
  Success: [
    "User successfully registered."
]
}
@Injectable({
  providedIn: 'root',
})
export class UpdateProfileService {

  appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
  private handleError: HandleError;
  constructor(private http: HttpClient) {

   }

   setUserData(reqData) {
    console.log( 'request data ',reqData);
    return this.http
      .put<UpdateProfileResponseData>(
        `${this.appUrl}/uvp/profile/update/`+ JSON.parse(sessionStorage.getItem('ID') || '{}'),
        reqData
      )
      .pipe(map( response => {  
            return response; 
        }), catchError(errorRes => {
          console.log(errorRes.error.Error[0]);
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error.Error) {
            return throwError(errorMessage);
          }else {
            return throwError(errorRes.error.Error);
          }
        })
      );
  }

  getUserData(): Observable<[]>{
    const url = `${this.appUrl}/uvp/profile/get/` +  JSON.parse(sessionStorage.getItem('ID') || '{}');
    

    return this.http.get<[]>(url)
    .pipe(
        map( response => {
         // console.log(response);
            return response["Success"]["0"]["userProfile"];
        }),catchError(errorRes => {
          return throwError(errorRes);
        })
        );//end pipe
}

  getStates(): Observable<{stateId: number, state: string}[]>{
    const url = `${this.appUrl}/uvp/search/get/states`;

    return this.http.get<{stateId: number, state: string}[]>(url)
    .pipe(
        map( response => {
            return response["Success"]["0"]["states"];
        }),catchError(errorRes => {
          return throwError(errorRes);
        })
        );//end pipe
}

getCity(stateId): Observable<{cityId: number, city: string}[]>{
  const url = `${this.appUrl}/uvp/search/get/cities/${stateId}`;
  return this.http.get<{cityId: number, city: string}[]>(url)
  .pipe(
      map( response => {
          return response["Success"]["0"]["cities"];
      }),catchError(errorRes => {
        return throwError(errorRes);
      })
      );//end pipe

}
}
