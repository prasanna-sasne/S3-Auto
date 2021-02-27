import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingModule } from "primeng/rating";
import { PaginatorModule } from "primeng/paginator";
import { HttpClientModule } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { TestComponent } from './test/test.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';

const appRoutes: Routes = [
  { path: 'sell-inventory', component: TestComponent },
  { path: 'sell-history', component: TestComponent},
  { path: '', component: BuyListComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BuyListComponent,
    JunkBuyComponent,
    TestComponent
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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MessageService, HttpErrorHandler],
  bootstrap: [AppComponent]
})
export class AppModule { }
