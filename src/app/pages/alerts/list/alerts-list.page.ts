import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/models/alerts/alert.model';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-alerts-list',
    templateUrl: 'alerts-list.page.html'
})
export class AlertsListPage implements OnInit, OnDestroy {

    alerts: Alert[] = [];
    subscription: Subscription;

    constructor(
        private alertService: AlertService,
        private loadingService: LoadingService) {

    }

    ngOnInit() {
        this.loadingService.present();

        this.subscription = this.alertService.alerts$.subscribe((alerts: Alert[]) => {
            this.alerts = alerts;
            this.loadingService.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    doRefresh(event: any): void {
        this.alertService.getAll(true)
            .subscribe(
                () => event.target.complete(),
                () => event.target.complete());
    }

    getAlertText(alert: Alert): string {
        let origin = alert.originFormattedAddress;

        if (origin.length > 10) {
            origin = origin.substring(0, 10);
        }

        let destination = alert.destinationFormattedAddress;

        if (destination.length > 10) {
            destination = destination.substring(0, 10);
        }

        return origin + '.. - ' + destination + '..';
    }
}
