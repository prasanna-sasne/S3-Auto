import { TestComponent } from './test/test.component';
import { BuyListComponent } from './directives/buy-list/buy-list.component';
import { JunkBuyComponent } from './components/junkyard-owner/junk-buy/junk-buy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'junkYard',
    component: JunkBuyComponent,
    children: [
      { path: 'BuyList', component: BuyListComponent },
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
