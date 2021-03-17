import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingModule } from "primeng/rating";
import { PaginatorModule } from "primeng/paginator";
import { HttpClientModule } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {ModalModule} from './_modal';
import { DropdownModule } from 'primeng/dropdown';


import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { TestComponent } from './test/test.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { ItemDetailsComponent } from './directives/buy-list/item-details/item-details.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { WelcomPageComponent } from './shared/welcom-page/welcom-page.component';
import { SellInventoryComponent } from './components/sell-inventory/sell-inventory.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
  AppComponent,
  HeaderComponent,
  LoginComponent,
  BuyListComponent,
  JunkBuyComponent,
  TestComponent,
  ItemDetailsComponent,
  AuthComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  WelcomPageComponent,
  SellInventoryComponent,
  RegisterComponent
  ],

  imports: [
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  DropdownModule,
  FormsModule,
  BrowserAnimationsModule,
  RatingModule,
  PaginatorModule,
  HttpClientModule,
  ModalModule
  ],

  providers: [MessageService, HttpErrorHandler],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
