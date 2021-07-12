import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { ToastController } from "@ionic/angular";
// const { Toast } = Plugins;

@Component({
  selector: "app-tab4",
  templateUrl: "./tab4.page.html",
  styleUrls: ["./tab4.page.scss"],
})
export class Tab4Page implements OnInit {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _httpClient: HttpClient,
    private _toastController: ToastController
  ) {}

  ngOnInit() {}

  secondApi: string = "http://azurewebsites/webapiA";
  otherAccessToken: string;
  webMethod: string = "GET";
  apiUrl: string;
  requestContent: string;
  responseResult: string;
  responseContent: string;

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  async signinSilent() {
    try {
      await this._authService.signinSilent();
      await this._router.navigateByUrl("/tabs/tab2");
    } catch (e) {
      console.error(e);
      const toast = await this._toastController.create({
        message: e,
        duration: 5000,
        position: 'top'

      });
      await toast.present();
      // Toast.show(e);
    }
  }

  async useRefreshForOtherApi() {
    try {
      let siginResult = await this._authService.signinSilent(this.secondApi);
      await this._router.navigateByUrl("/tabs/tab3");
    } catch (e) {
      console.error(e);
      const toast = await this._toastController.create({
        message: e,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    }
  }

  hasAnotherAccessToken(): boolean {
    return this.otherAccessToken && this.otherAccessToken.length > 0;
  }

  hasRefreshToken(): boolean {
    const rt = this._authService.getRefreshToken();
    return rt && rt.length > 0;
  }

  removeRefresh() {
    this._authService.removeRefreshToken();
  }

  getOtherAccessToken(): string {
    return this.otherAccessToken;
  }

  webMethodRequiresContent(): boolean {
    return this.webMethod == "POST" || this.webMethod == "PUT";
  }

  async invokeApi(): Promise<void> {
    let response: HttpResponse<string>;
    try {
      switch (this.webMethod) {
        case "POST":
          response = await this._httpClient
            .post<string>(this.apiUrl, this.requestContent, {
              observe: "response",
              responseType: "json",
            })
            .toPromise();
          break;
        case "PUT":
          response = await this._httpClient
            .put<string>(this.apiUrl, this.requestContent, {
              observe: "response",
              responseType: "json",
            })
            .toPromise();
          break;
        case "DELETE":
          response = await this._httpClient
            .delete<string>(this.apiUrl, {
              observe: "response",
              responseType: "json",
            })
            .toPromise();
          break;
        case "GET":
        default:
          response = await this._httpClient
            .get<string>(this.apiUrl, {
              observe: "response",
              responseType: "json",
            })
            .toPromise();

          break;
      }
      console.log(`${response.status}: ${response.statusText}`);
      this.responseResult = `${response.status}: ${response.statusText}`;
      this.responseContent = JSON.stringify(response.body);
    } catch (e) {
      console.error(e);
      console.log(e.headers);
      this.responseResult = `${e.status}: ${e.statusText}`;
      if (e.headers.has("www-authenticate")) {
        this.requestContent = e.headers.get("www-authenticate");
      } else {
        this.responseContent = JSON.stringify(e);
      }
    }
  }

  isThereResponse(): boolean {
    // console.log(`${this.responseResult} | ${this.responseContent}`);
    return (
      this.responseResult != undefined || this.responseContent != undefined
    );
  }
}
