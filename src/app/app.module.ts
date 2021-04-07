import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RatingModule } from "primeng/rating";
import { PaginatorModule } from "primeng/paginator";
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from './_modal';
import { DropdownModule } from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {AuthInterceptor} from './_helper/auth.interceptor'

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { SellHistoryComponent } from './directives/sell-history/sell-history.component';
import {SellInventoryComponent} from './directives/sell-inventory/sell-inventory.component'
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { TestComponent } from './test/test.component';
import { ItemDetailsComponent } from './directives/buy-list/item-details/item-details.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { WelcomPageComponent } from './shared/welcom-page/welcom-page.component';
import { UpdateProfileComponent } from './shared/update-profile/update-profile.component';
import { RegisterComponent } from './register/register.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component'
import { SellInputFormComponent } from './directives/sell-input-form/sell-input-form.component';

import {SellInputFormService} from './services/sell-input-form.service';
import {SellInventoryService} from './services/sell-inventiry.service';
import { MessageService } from './services/message.service';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageComponent } from './shared/message/message.component';
import { NotifyHeaderService } from './services/notify-header.service';
import { ContactusComponent } from './components/admin/contactus/contactus.component';
import { TicketsComponent } from './components/admin/tickets/tickets.component';
import { AboutUsComponent } from './shared/about-us/about-us.component';
import { FooterComponent} from "./shared/footer/footer.component";

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
  RegisterComponent,
  SellHistoryComponent,
  LoadingSpinnerComponent,
  SellInventoryComponent,
  SellInputFormComponent,
  MessageComponent,
  UpdateProfileComponent,
  ContactusComponent,
  TicketsComponent,
  AboutUsComponent,
  FooterComponent
  ],

  imports: [
  BrowserModule,
  ReactiveFormsModule,
  DropdownModule,
  FormsModule,
  BrowserAnimationsModule,
  RatingModule,
  PaginatorModule,
  HttpClientModule,
  ModalModule,
  AppRoutingModule,
  TableModule
  ],

  providers: [MessageService, HttpErrorHandler,SellInventoryService,SellInputFormService,
    NotifyHeaderService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
