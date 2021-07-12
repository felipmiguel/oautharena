import { Injectable } from "@angular/core";
import {
  UserManager,
  User,
  WebStorageStateStore,
  UserManagerSettings,
} from "oidc-client";
import * as JWT from "jwt-decode";
import { AuthenticationOptions } from "./configuration/authentication-options";
import { Platform } from "@ionic/angular";
import { ConfigurationManagerService } from "./configuration/configuration-manager.service";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class AuthService {

  private _userManager: UserManager;
  private _user: User;
  private _scope: string;

  constructor(
    private platform: Platform,
    private configurationService: ConfigurationManagerService
  ) {
    this.configurationService.getCurrentConfiguration().then((config) => {
      if (config) {
        this.reloadConfiguration(config);
      }
    });
  }

  createUserManagerSettings(
    authOptions: AuthenticationOptions
  ): UserManagerSettings {
    this._scope = authOptions.scopes;
    let finalScope: string = authOptions.scopes;


    let redirect_uri: string;
    let logout_redirect_uri: string;
    let silent_redirect_uri: string;
    let extraParams: Map<string, any>;

    if (authOptions.targetApi && authOptions.targetApi != "") {
      if (authOptions.targetAsResource == true) {
        extraParams = new Map([["resource", authOptions.targetApi]]);
      } else {
        finalScope += ` ${authOptions.targetApi}`;
      }
    }
    console.log("current url: " + this.platform.url());


    redirect_uri = this.getRedirectUri();
    logout_redirect_uri = this.getLogoutRedirectUri();
    silent_redirect_uri = this.getSilentRedirectUri();

    let cfg: UserManagerSettings = {
      authority: authOptions.authority, // Authority is AAD/ADFS or any other authority
      client_id: authOptions.appId, // app identifier created in the authority service,
      client_secret: authOptions.secret, // app secret. It is strongly NOT recommended for SPA. Do not use for production apps
      redirect_uri: redirect_uri,
      popup_redirect_uri: redirect_uri,
      scope: finalScope, // requested scopes: openid required for user login, profile to retrieve user profiles.
      response_type: "code", // This response type assumes code grant + PKCE.
      post_logout_redirect_uri: logout_redirect_uri, // url to be redirected after closing the session in the STS. In our page it is nessary to clean-up session related data.
      popup_post_logout_redirect_uri: logout_redirect_uri,
      userStore: new WebStorageStateStore({ store: window.localStorage }), // oidc-client library specific parameter to specify where to store the data in the client side. Important to match this storage with the implementation in the redirect page
      automaticSilentRenew: true, // try to refresh tokens without user interaction. If the refresh token is available it tries to use it, if not available tries to make silent renew in a hidden frame.
      silent_redirect_uri: silent_redirect_uri, // redirect page for silent renew
      popupWindowTarget: "_blank", // needed in mobile apps to specify that the identity provider page should be opened in the browser out of the app (no webview). Important if Single Sign-On required.
      loadUserInfo: false, // specify if oidc-client should load user information after authenticate the user. The endpoint to gather the user info should implement CORS for this SPA application. ADFS and AAD doesn't support CORS customization for user info endpoint. AAD recommends Graph. Most of the user info data is already contained in id_token
      extraQueryParams: extraParams, // when using ADFS the requested resource may be specied in specific parameter. ADFS also support request that resource as a scope.
    };

    return cfg;
  }

  public getRedirectUri(): string {
    if (this.isApp()) {
      return `${environment.spaSchema}/auth-callback`;

    } else {
      return `${this.getBaseUrl()}/assets/oidc-login-redirect.html`;
    }
  }

  public getLogoutRedirectUri(): string {
    if (this.isApp()) {
      return `${environment.spaSchema}/auth-logout`;
    } else {
      return `${this.getBaseUrl()}/assets/oidc-login-redirect.html?postLogout=true`;
    }
  }

  public getSilentRedirectUri(): string {
    return `${this.getBaseUrl()}/assets/oidc-silent-redirect.html`;
  }


  public getBaseUrl(): string {
    return location.origin;
  }

  private reloadConfiguration(authOptions: AuthenticationOptions) {
    let cfg = this.createUserManagerSettings(authOptions);
    console.log(cfg);
    this._userManager = new UserManager(cfg);
    this._userManager.getUser().then((user) => {
      if (user && !user.expired) {
        // user.refresh_token = undefined;
        // this._userManager.storeUser(user);
        this._user = user;
      }
    });
    this._userManager.events.addUserLoaded(() => {
      this._userManager.getUser().then((user) => {
        // user.refresh_token = undefined;
        // this._userManager.storeUser(user);
        this._user = user;
      });
    });
  }

  async login(authOptions: AuthenticationOptions): Promise<any> {
    this.reloadConfiguration(authOptions);

    await this.configurationService.saveCurrentConfiguration(authOptions);
    return this._userManager.signinRedirect();
  }

  private isApp(): boolean {
    return this.platform.is("android") || this.platform.is("ios");
  }

  logout(): Promise<any> {
    return this._userManager.signoutRedirect();
  }

  async signinSilent(apiId?: string): Promise<any> {
    if (apiId && apiId.length > 0) {
      let scope = `${this._scope} ${apiId}`;
      console.log(`signingSilent scope=${scope}`);

      this._user = await this._userManager.signinSilent({
        scope: scope
      });
    } else {
      this._user = await this._userManager.signinSilent();
    }
  }

  isLoggedIn(): boolean {
    return this._user && this._user.access_token && !this._user.expired;
  }

  getAccessToken(): string {
    return this._user ? this._user.access_token : "";
  }

  getIdToken(): string {
    return this._user ? this._user.id_token : "";
  }

  getRefreshToken(): string {
    return this._user ? this._user.refresh_token : "";
  }

  getExpiresAt(): number {
    return this._user.expires_at;
  }

  async signoutRedirectCallback(): Promise<any> {
    if (!this._userManager) {
      const config: AuthenticationOptions = await this.configurationService.getCurrentConfiguration();
      this.reloadConfiguration(config);
    }
    this._userManager.signoutRedirectCallback().then(() => {
      this._user = null;
    });
  }

  async completeAuthentication(url?: string): Promise<void> {
    if (!this._userManager) {
      const config: AuthenticationOptions = await this.configurationService.getCurrentConfiguration();
      this.reloadConfiguration(config);
    }

    console.log("completeAuthentication:" + url);
    const requestedScopes = this._userManager.settings.scope.split(' ');
    this._user = await this._userManager.signinRedirectCallback(url);

  }
  getNotAcceptedScopes(requestedScopesRaw: string, acceptedScopesRaw: string): string[] {
    const requestedScopes = requestedScopesRaw.split(' ');
    const acceptedScopes = acceptedScopesRaw.split(' ');
    const notAcceptedScopes = requestedScopes.filter((scp: string) => acceptedScopes.findIndex(scpr => scpr === scp) === -1);
    return notAcceptedScopes;
  }

  getNotAcceptedScopesDefault():string[]{
    return this.getNotAcceptedScopes(this._userManager.settings.scope, this._user.scopes.join(' '));
  }

  getIdTokenClaims(): any {
    let idToken = JWT(this.getIdToken());
    console.log(idToken);
    return idToken;
  }

  getAccessTokenClaims() {
    let accessToken = JWT(this.getAccessToken());
    console.log(accessToken);
    return accessToken;
  }

  async removeRefreshToken() {
    var user = await this._userManager.getUser();
    user.refresh_token = undefined;
    await this._userManager.storeUser(user);
    this._user = user;
  }

  getScope(): string {
    return this._user.scope;
  }
}
