import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service';

interface AuthResponseData {
  Success: [
    "User successfully registered."
]
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
  private handleError: HandleError;
  constructor(private http: HttpClient) {
   }

  signup(reqData) {
    return this.http
      .post<AuthResponseData>(
        `${this.appUrl}/uvp/authentication/signup`,
        reqData
      )
      // .pipe(
      //   catchError(errorRes => {
      //     let errorMessage = 'An unknown error occurred!';


      //     if ( !errorRes.error.Error) {
      //       return throwError(errorMessage);
      //     }else {
      //       switch (errorRes.error.error.message) {
      //         case 'EMAIL_EXISTS':
      //           errorMessage = 'This email exists already';
      //       }
      //       return throwError(errorRes.error.Error);
      //     }
      //   })
      // );
      .pipe(
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error.Error) {
            return throwError(errorMessage);
          }else {
            return throwError(errorRes.error.Error);
          }
          // switch (errorRes.error.error.message) {
          //   case 'EMAIL_EXISTS':
          //     errorMessage = 'This email exists already';
          // }


        })
      );
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
