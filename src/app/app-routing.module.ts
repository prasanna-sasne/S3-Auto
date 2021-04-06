import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TestComponent } from './test/test.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { SellHistoryComponent } from './directives/sell-history/sell-history.component';
import {SellInventoryComponent} from './directives/sell-inventory/sell-inventory.component'
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { WelcomPageComponent } from './shared/welcom-page/welcom-page.component';
import { UpdateProfileComponent } from './shared/update-profile/update-profile.component';
import { AboutUsComponent} from './shared/about-us/about-us.component';
import { ContactusComponent} from './components/admin/contactus/contactus.component';
import { TicketsComponent} from './components/admin/tickets/tickets.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { ItemDetailsComponent } from './directives/buy-list/item-details/item-details.component';

import {SellInputFormComponent} from './directives/sell-input-form/sell-input-form.component'
const routes: Routes = [
{ path: 'welcome', component: WelcomPageComponent },
   { path: 'about-us', component: AboutUsComponent },
{ path: 'updateProfile', component: UpdateProfileComponent },
{ path: 'sellInventory', component: SellInventoryComponent },
    {path: 'contactus', component: ContactusComponent },
  {path: 'tickets', component: TicketsComponent},
{
	path: 's3-auto',
	component: JunkBuyComponent,
	children: [
	{ path: 'buy-list', component: BuyListComponent },
	{ path: 'sell-form', component: SellInputFormComponent },
	{ path: 'sell-history', component: SellHistoryComponent },
	]
},
{ path: 'item-details', component: ItemDetailsComponent },
{ path: 'resetPassword/reset', component: ResetPasswordComponent },
{ path: '**', redirectTo: '' }

];

@NgModule({
	imports: [RouterModule.forRoot(routes),CommonModule],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
