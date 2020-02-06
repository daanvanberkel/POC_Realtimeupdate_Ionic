import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {Plugins, registerWebPlugin} from '@capacitor/core';
import {OAuth2Client} from '@daanvanberkel/capacitor-oauth2';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private loginService: LoginService,
      private router: Router
  ) { }

  ngOnInit() {
    if (this.loginService.getAccessToken()) {
      this.router.navigate(['/home']);
      return;
    }

    registerWebPlugin(OAuth2Client);

    const url = new URL(window.location.href);

    Plugins.OAuth2Client.authenticate({
      appId: 'speedmeet',
      authorizationBaseUrl: `${environment.api_base}/auth/avans`,
      responseType: 'token',
      web: {
        redirectUrl: `${url.protocol}//${url.host}/callback`
      },
      android: {
        customScheme: 'nl.daanvanberkel.realtimepoc:/'
      },
      ios: {
        customScheme: 'nl.daanvanberkel.realtimepoc:/'
      }
    }).then(response => {
      if (response.access_token) {
        this.loginService.setAccessToken(response.access_token);
        this.router.navigate(['/home']);
      }
    }).catch(err => console.log('Error', err));
  }

}
