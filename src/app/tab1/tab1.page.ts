import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { ConfigurationManagerService } from '../auth/configuration/configuration-manager.service';
import { AuthenticationOptions } from '../auth/configuration/authentication-options';
import { environment } from 'src/environments/environment';


const { Storage } = Plugins;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private _authService: AuthService,
    private _configService: ConfigurationManagerService) {
  }

  authority: string;
  appId: string;
  secret: string;
  availableConfigurations: AuthenticationOptions[];
  targetApi: string;
  scopes: string = 'openid profile';
  targetAsResource: boolean = true;

  ngOnInit() {
    this.loadInitialConfiguration();
    this.loadAvailableConfigurations();
  }
  loadInitialConfiguration() {
    this._configService.getCurrentConfiguration().then(configuration => {
      if (configuration) {
        this.authority = configuration.authority;
        this.appId = configuration.appId;
        this.secret = configuration.secret;
        this.targetApi = configuration.targetApi;
        this.scopes = configuration.scopes;
        this.targetAsResource = configuration.targetAsResource;
      }
    });
  }

  private loadAvailableConfigurations() {
    this._configService.getAvailableConfigurations().then(configs => this.availableConfigurations = configs);
    console.log(this.availableConfigurations);
  }

  login() {
    this._authService.login(this.getAuthConfiguration());
  }

  logout() {
    this._authService.logout();
  }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  getNotAcceptedScopes(): string[] {
    if (this.isLoggedIn()) {
      return this._authService.getNotAcceptedScopes(this.scopes, this._authService.getScope());
    } else {
      return [];
    }
  }

  async saveConfig() {
    var config: AuthenticationOptions = {
      authority: this.authority,
      appId: this.appId,
      secret: this.secret,
      scopes: this.scopes,
      targetApi: this.targetApi,
      targetAsResource: this.targetAsResource
    };
    await this._configService.saveConfig(config);
    this.loadAvailableConfigurations();
  }

  openOther() {
    window.open(environment.otherApp);
  }

  useConfig(event, config: AuthenticationOptions) {
    this.appId = config.appId;
    this.authority = config.authority;
    this.secret = config.secret;
    this.scopes = config.scopes;
    this.targetApi = config.targetApi;
    this.targetAsResource = config.targetAsResource;
  }

  async deleteConfig(event, config: AuthenticationOptions) {
    await this._configService.deleteConfig(config.name);
    this.loadAvailableConfigurations();
  }

  getAuthConfiguration(): AuthenticationOptions {
    return {
      appId: this.appId,
      authority: this.authority,
      secret: this.secret,
      scopes: this.scopes,
      targetApi: this.targetApi,
      targetAsResource: this.targetAsResource
    };
  }

  getRedirectUri(): string {
    return this._authService.getRedirectUri();
  }
  getLogoutRedirectUri(): string {
    return this._authService.getLogoutRedirectUri();
  }
  getSilentRedirectUri(): string {
    return this._authService.getSilentRedirectUri();
  }
  getBaseUrl(): string {
    return this._authService.getBaseUrl();
  }
}
