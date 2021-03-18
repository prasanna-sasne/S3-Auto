import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { SellHistoryComponent } from './directives/sell-history/sell-history.component';
import {SellInventoryComponent} from './directives/sell-inventory/sell-inventory.component'
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { WelcomPageComponent } from './shared/welcom-page/welcom-page.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';

const routes: Routes = [
{ path: 'welcome', component: WelcomPageComponent },
{
	path: 'junk-yard',
	component: JunkBuyComponent,
	children: [
	{ path: 'buy-list', component: BuyListComponent },
	{ path: 'sell-inventory', component: SellInventoryComponent },
	{ path: 'sell-history', component: SellHistoryComponent },
	]
},

{ path: 'resetPassword/reset', component: ResetPasswordComponent },
{ path: '**', redirectTo: '' }

];

@NgModule({
	imports: [RouterModule.forRoot(routes),CommonModule],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
