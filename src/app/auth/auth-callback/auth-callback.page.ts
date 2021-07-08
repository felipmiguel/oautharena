import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.page.html',
  styleUrls: ['./auth-callback.page.scss'],
})
export class AuthCallbackPage implements OnInit {

  currentStatus: string = 'Procesando respuesta de la autenticación...'
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    console.log("init callback");
    this.route.url.subscribe((routedUrl) => {
      console.log('route.queryParams: '+ this.route.queryParams);
      console.log('route.url:' + this.route.url);
      console.log('routedurl: ' + routedUrl);
      var url: string;
      url = routedUrl.join('/');
      console.log('url to complete auth: ' + url);
      this.authService.completeAuthentication(url).then(() => {
        this.currentStatus = 'Proceso completado correctamente, redirigiendo a la página principal...';
        console.log('authentication completed');
        console.log('id_token: ' + this.authService.getIdToken());
        console.log('access_token: ' + this.authService.getAccessToken());
        this.toastController.create({
          message: 'Proceso completado correctamente!',
          duration: 500
        }).then(toast => {

          toast.present();
          toast.onDidDismiss().then(() => this.router.navigateByUrl('/'));
        });
        // this.router.navigateByUrl('/');
      }, (reason) => {
        console.error('failed complete auth: ' + reason);
        this.showErrorMessage(reason);
      }).catch((e) => {
        console.error(e);
        this.showErrorMessage(e);
      });
    })

  }


  private showErrorMessage(reason: any) {
    this.toastController.create({
      header: 'Error al procesar la respuesta del identity provider',
      message: reason,
      buttons: [
        {
          side: 'start',
          icon: 'home',
          handler: () => this.router.navigateByUrl('/')
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }
}
