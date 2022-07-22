import { environment } from '../../../../environments/environment';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-auth-home',
    templateUrl: 'auth-home.page.html',
    styleUrls: ['auth-home.page.scss']
})
export class AuthHomePage {

    title: string = environment.appName;
    subtitle: string = environment.appSlogan;
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
