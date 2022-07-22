import { UserService } from './../../services/user.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html'
})
export class AccountPage implements OnInit {

  isEmailConfirmed: boolean;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.isEmailConfirmed = user.isEmailConfirmed;
    });
  }
}
