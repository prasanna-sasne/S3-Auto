import { Injectable } from '@angular/core';
import { BuyItems } from '../shared/models/buyItems.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


@Injectable()
export class BuyService{
    buyItems: BuyItems[] = [];
    appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
    private handleError: HandleError;
    
    constructor(private http: HttpClient,  httpErrorHandler: HttpErrorHandler){
        this.handleError = httpErrorHandler.createHandleError('BuyService');
    }  

    builtBuyVehicleModel(res: any){
        this.buyItems = [];
        res.forEach( (currentValue, index) => {
            currentValue.vehicleSells.forEach((vehicle, vehicleIndex) =>{
                let vehicleObject = {
                    price : vehicle.price,
                    make  : vehicle.make,
                    model : vehicle.model,
                    year  : vehicle.year,
                    sellDate: vehicle.soldDate,
                    city: currentValue.city,
                    state: currentValue.state,
                    userId: currentValue.userId,
                    vehId: vehicle.vehId,
                    imageUri: vehicle.vehicleImages[0].imageUri
                };
                console.log();
                this.buyItems.push(vehicleObject);
            })
        });
    }

    getBuyVehicles(queryData: any): Observable<BuyItems[]>{
        let url: string = `${this.appUrl}/uvp/vehicles/get`;

        if(JSON.stringify(queryData) !== '{}'){
            url = `${this.appUrl}/uvp/vehicles/get/${queryData.makeId}/${queryData.modelId}/${queryData.year}/${queryData.stateId}/${queryData.startIdx}/${queryData.resultSize}`;
        }

        return this.http.get<BuyItems[]>(url)
        .pipe(
            map( response => {  
                this.builtBuyVehicleModel(response["Success"]["0"]["userSellVehicles"]);
                return this.buyItems;
            }),catchError(this.handleError('getBuyVehicles', []))
            );//end pipe
    }

    getMakers(): Observable<{makeId: number, make: string}[]> {
        const url = `${this.appUrl}/uvp/search/get/makers`;
        return this.http.get<{makeId: number, make: string}[]>(url)
        .pipe(
            map( response => {  
                return response["Success"]["0"]["makers"]; 
            }),catchError(this.handleError('getMakers', []))
            );//end pipe
    }

    getModels(makeId: number): Observable<{modelId: number, model: string}[]>{
        const url = `${this.appUrl}/uvp/search/get/models/${makeId}`;

        return this.http.get<{makeId: number, make: string}[]>(url)
        .pipe(
            map( response => {  
                return response["Success"]["0"]["models"]; 
            }),catchError(this.handleError('getModels', []))
            );//end pipe
    }

    getStates(): Observable<{stateId: number, state: string}[]>{
        const url = `${this.appUrl}/uvp/search/get/states`;

        return this.http.get<{stateId: number, state: string}[]>(url)
        .pipe(
            map( response => {  
                return response["Success"]["0"]["states"]; 
            }),catchError(this.handleError('getstates', []))
            );//end pipe
    }

    getParts(){
        const url = `${this.appUrl}/uvp/search/get/parts`;
        return this.http.get<{stateId: number, state: string}[]>(url)
        .pipe(
            map( response => {  
                return response["Success"]["0"]["parts"]; 
            }),catchError(this.handleError('getstates', []))
            );//end pipe

    }
}