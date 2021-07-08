import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './auth-logout.page.html',
  styleUrls: ['./auth-logout.page.scss'],
})
export class AuthLogoutPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.route.url.subscribe(routedUrl => {
      var url: string;
      url = routedUrl.join('/');
      console.log('url to logout: ' + url);
      this.authService.signoutRedirectCallback().then(() => {
        console.log('logout completed');
        this.router.navigateByUrl('/');
      }).catch((e) => {
        console.error(e);
      });
    })

  }

}
