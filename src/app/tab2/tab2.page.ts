import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Plugins } from "@capacitor/core";
const { Toast } = Plugins;

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  constructor(private _authService: AuthService) {}

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  getIdToken(): string {
    return this._authService.getIdToken();
  }

  getAccessToken(): string {
    return this._authService.getAccessToken();
  }

  getScope(): string {
    return this._authService.getScope();
  }

  getExpiresAt(): Number {
    return this._authService.getExpiresAt();
  }

  getRefreshToken(): string {
    return this._authService.getRefreshToken();
  }

  hasRefreshToken(): boolean {
    const rt = this.getRefreshToken();
    return rt && rt.length > 0;
  }

  async doRefresh() {
    try {
      await this._authService.signinSilent();
    } catch (e) {
      Toast.show({
        text: e,
      });
    }
  }

  openToken(tokenType: string, token: string) {
    window.open(`https://jwt.ms#${tokenType}=${token}`);
  }
}
