import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLogoutPage } from './auth-logout.page';

const routes: Routes = [
  {
    path: '',
    component: AuthLogoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLogoutPageRoutingModule {}
