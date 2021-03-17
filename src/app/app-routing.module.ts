import { TestComponent } from './test/test.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomPageComponent } from './shared/welcom-page/welcom-page.component';
import {ResetPasswordComponent} from './shared/reset-password/reset-password.component'

const routes: Routes = [
{ path: 'welcome', component: WelcomPageComponent },
{ path: 'resetPassword/reset', component: ResetPasswordComponent },
{
  path: 'junk-yard',
  component: JunkBuyComponent,
  children: [
  { path: 'buy-list', component: BuyListComponent },
  { path: 'sell-inventory', component: TestComponent },
  { path: 'sell-history', component: TestComponent },
  ]
},
{ path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
