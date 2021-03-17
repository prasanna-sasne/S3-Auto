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
export class ForgotPasswordService {
  constructor(private http: HttpClient) { }
  forgotPw(formData) {
    return this.http
      .post<AuthResponseData>(
        'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp/authentication/forgot',
        formData
      )
      .pipe(
        catchError(errorRes => {
          console.log(errorRes.error.Error[0]);
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error.Error || !errorRes.error.Error) {
            return throwError(errorMessage);
          }else {
            return throwError(errorRes.error.Error);
          }
        })
      );
  }
}
