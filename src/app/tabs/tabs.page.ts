import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private _authService: AuthService) { }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

}
