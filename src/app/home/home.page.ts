import {Component, DoCheck, OnInit} from '@angular/core';
import {User} from '../models/user';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;

  constructor(
      private loginService: LoginService
  ) {}

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    if (!this.user && this.loginService.getAccessToken()) {
      this.loginService.getUser().subscribe(user => this.user = user);
    }
  }
}
