import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


@Injectable()
export class SellInventoryService{

}
