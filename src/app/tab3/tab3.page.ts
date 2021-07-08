import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private _authService: AuthService) { }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  getIdTokenClaims() {
    return JSON.stringify(this._authService.getIdTokenClaims(), null, 4);
    // return this._authService.getIdTokenClaims();
  }

  getAccessTokenClaims(): string {
    return JSON.stringify(this._authService.getAccessTokenClaims(), null, 4);
  }

}
