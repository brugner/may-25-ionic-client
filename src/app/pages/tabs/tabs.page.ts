import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {

  backButtonSubscription: Subscription;

  constructor(private platform: Platform) {

  }

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      navigator['app'].exitApp();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
}
