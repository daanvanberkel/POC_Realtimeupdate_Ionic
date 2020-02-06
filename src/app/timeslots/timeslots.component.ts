import { Component, OnInit } from '@angular/core';
import {TimeslotService} from '../services/timeslot.service';
import {LoginService} from '../services/login.service';
import {User} from '../models/user';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss'],
})
export class TimeslotsComponent implements OnInit {

  user: User;

  slots = [];

  constructor(
      private timeslotService: TimeslotService,
      private loginService: LoginService
  ) { }

  ngOnInit() {
    this.getSlots();

    this.timeslotService.getSelectedTimeslots().subscribe(data => {
      this.setUserBySlot(data.slot, data.user_id);
    });

    this.loginService.getUser().subscribe(user => this.user = user);

    // FOR TESTING ONLY
    this.timeslotService.resetSlots().subscribe(() => this.getSlots());
  }

  getSlots() {
    this.slots = [];

    for (let i = 1; i < 5; i++) {
      this.slots.push({
        id: i,
        time: (10 + i) + ':00',
        studentid: null
      });
    }
  }

  selectSlot(slot: number) {
    this.timeslotService.selectTimeslot(slot, this.user.id);
    this.setUserBySlot(slot, this.user.id);
  }

  private setUserBySlot(slot: number, user: string) {
    let index = this.slots.findIndex(s => s.id === slot);

    if (index >= 0) {
      this.slots[index].studentid = user;
    }
  }

  // FOR TESTING ONLY
  resetSlots() {
    this.getSlots();
    this.timeslotService.sendRest();
  }

}
