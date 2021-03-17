import { Injectable } from '@angular/core';
import { BuyItems } from '../shared/models/buyItems.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


@Injectable()
export class BuyService{
    private buyItems: BuyItems[] = [];
    private appUrl = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com';  // URL to web api
    private handleError: HandleError;
    private itemResponseList : any[];

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
                    imageUri: vehicle.vehicleImages[0].imageUri,
                    part: "",
                    junkyardId: -1,
                    partId: -1,
                    rating: -1 
                };
                this.buyItems.push(vehicleObject);
            })
        });
        this.itemResponseList = res;
    }
    
    builtBuyPartsModel(res: any){
        this.buyItems = [];
        res.forEach( (partItem, index) => {
            let partObject = {
                    imageUri: partItem.imageUri,
                    price : partItem.price,
                    make  : partItem.make,
                    model : partItem.model,
                    part : partItem.part,
                    year  : partItem.year,
                    sellDate: partItem.soldDate,
                    city: partItem.city,
                    state: partItem.state,
                    junkyardId: partItem.junkYardId,
                    partId: partItem.partId,
                    rating: partItem.junkYardRating,
                    vehId: -1,
                    userId: -1
                };
           this.buyItems.push(partObject);     
        });
        this.itemResponseList = res;
    }

    generateAppUrl(queryData: any, role: string): string{
        let url : string = "";
        if(role.localeCompare("JUNK_YARD_OWNER") === 0){
            url = `${this.appUrl}/uvp/vehicles/get`;
            if(JSON.stringify(queryData) !== '{}'){
                url += `/${queryData.makeId}/${queryData.modelId}/${queryData.year}/${queryData.stateId}/${queryData.startIdx}/${queryData.resultSize}`;
            }
        } else if(role.localeCompare("USER") === 0){
            url = `${this.appUrl}/uvp/parts/get`;
            if(JSON.stringify(queryData) !== '{}'){
                url += `/${queryData.makeId}/${queryData.modelId}/${queryData.year}/${queryData.partId}/${queryData.stateId}/${queryData.startIdx}/${queryData.resultSize}`;
            }
        }
        return url;
    }

    getBuyItemList(queryData: any, role: string): Observable<BuyItems[]>{
        let url = this.generateAppUrl(queryData, role);
        return this.http.get<BuyItems[]>(url)
        .pipe(
            map( response => {
                if(role.localeCompare("JUNK_YARD_OWNER") === 0){
                    this.builtBuyVehicleModel(response["Success"]["0"]["userSellVehicles"]); 
                    return this.buyItems;   
                }  
                else {
                    this.builtBuyPartsModel(response["Success"]["0"]["userSellParts"]);
                    return this.buyItems;
                }
               
            }),catchError(this.handleError('getBuyItemList', []))
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

    getItemResponse(item: BuyItems){
        if(item.partId !== -1){ //get partDetails
           let filteredArray = this.itemResponseList.filter(function( obj ) {
                return obj.partId === item.partId;    
            });
           return filteredArray[0];
        } else { //get vehicle details
            let selectedVehicle = {};
            this.itemResponseList.forEach( (currentValue, index) => {
                currentValue.vehicleSells.forEach((vehicle, vehicleIndex) =>{
                    if(vehicle.vehId === item.vehId){
                        selectedVehicle = vehicle;
                        selectedVehicle["userId"] = currentValue.userId;
                        selectedVehicle["username"] = currentValue.username;
                        selectedVehicle["city"] = currentValue.city;
                        selectedVehicle["state"] = currentValue.state;
                        selectedVehicle["street"] = currentValue.street;
                        selectedVehicle["zip"] = currentValue.zip;
                        selectedVehicle["email"] = currentValue.email;
                        selectedVehicle["phone"] = currentValue.phone;
                    }                
                });
            });
            return selectedVehicle;    
        }
        return this.itemResponseList;
    }

}