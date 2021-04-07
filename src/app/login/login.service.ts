import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  "Success": [
    {
        token: "",
        id: 0,
        username: "",
        email: "",
        role: ""
    }
]
}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) { }
  login(userName,password) {
    return this.http
      .post<AuthResponseData>(
        'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp/authentication/signin',
        {
          "username": userName,
          "password": password
      }
      )
      .pipe(
        catchError(errorRes => {
          console.log(errorRes.error.Error[0]);
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
}
