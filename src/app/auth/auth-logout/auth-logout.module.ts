import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthLogoutPageRoutingModule } from './auth-logout-routing.module';

import { AuthLogoutPage } from './auth-logout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthLogoutPageRoutingModule
  ],
  declarations: [AuthLogoutPage]
})
export class AuthLogoutPageModule {}
