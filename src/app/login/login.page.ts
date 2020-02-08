import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {AppLaunchUrl, AppUrlOpen, Plugins, registerWebPlugin} from '@capacitor/core';
import {OAuth2Client} from '@daanvanberkel/capacitor-oauth2';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';

const { App } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private loginService: LoginService,
      private router: Router,
      private platform: Platform,
  ) { }

  ngOnInit() {
    if (this.loginService.getAccessToken()) {
      this.router.navigate(['/home']);
      return;
    }

    if (this.isAndroid()) {
      // Handle Deep Links on android
      App.addListener('appUrlOpen', this.handleOpenUrl);
      App.getLaunchUrl().then(this.handleOpenUrl);
    }

    // Register OAuth2client plugin with Capacitor
    registerWebPlugin(OAuth2Client);

    const url = new URL(window.location.href);

    // Handle authentication
    Plugins.OAuth2Client.authenticate({
      authorizationBaseUrl: `${environment.api_base}/auth/avans`,
      responseType: 'token',
      web: {
        appId: this.isAndroid() ? 'speedmeetand' : 'speedmeetweb',
        redirectUrl: `${url.protocol}//${url.host}/callback`
      },
      android: {
        appId: 'speedmeetand',
        customScheme: 'nl.daanvanberkel.realtimepoc:/'
      },
      ios: {
        appId: 'speedmeetios',
        customScheme: 'nl.daanvanberkel.realtimepoc:/'
      }
    }).then(response => {
      if (response.access_token) {
        this.saveAccessToken(response.access_token);
      }
    }).catch(err => console.log('Error', err));
  }

  private handleOpenUrl(data: AppUrlOpen|AppLaunchUrl): void {
    const openUrl = new URL(data.url);
    if (openUrl.searchParams.has('access_token')) {
      this.saveAccessToken(openUrl.searchParams.get('access_token'));
    }
  }

  private saveAccessToken(accessToken: string): void {
    this.loginService.setAccessToken(accessToken);
    this.router.navigate(['/home']);
  }

  private isAndroid(): boolean {
    const platforms = this.platform.platforms();
    return (platforms.indexOf('android') > -1);
  }
}
