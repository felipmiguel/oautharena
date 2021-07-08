import { Component, NgZone } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, AppState, AppUrlOpen } from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private router: Router,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      Plugins.App.addListener("appUrlOpen", (appUrl: AppUrlOpen) => {
        this.zone.run(() => {
          if (appUrl && appUrl.url) {
            console.log(appUrl.url);
            var callbackUrl = new URL(appUrl.url.replace('authdona://', 'https://'));
            var routeUrl = callbackUrl.pathname + callbackUrl.search;
            if (routeUrl.startsWith('//')) {
              routeUrl = routeUrl.substring(1);
            }
            console.log('routing to: ' + routeUrl);
            const urlTree = this.router.parseUrl(appUrl.url);
            // this.router.navigate(['auth-callback', 'code', urlTree.queryParamMap['code'], 'state', urlTree.queryParamMap['state']], relativeTo: ).then(navigated => {
            this.router.navigateByUrl(routeUrl).then(navigated => {
              if (navigated == false) {
                console.log('not routed...yet');
                this.navController.navigateRoot(routeUrl).then(navigated => {
                  if (navigated == true) {
                    console.log('navigated');
                  }
                });
              }
            });
          }
        });
      });
    });
  }
}
