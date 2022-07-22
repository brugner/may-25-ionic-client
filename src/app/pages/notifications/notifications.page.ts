import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { Notification } from '../../models/notifications/notification.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit, OnDestroy {

    notifications: Notification[] = [];
    subscription: Subscription;
    moment: any = moment;

    constructor(
        private notificationService: NotificationService,
        private loadingService: LoadingService,
        private router: Router) {

    }

    ngOnInit() {
        this.loadingService.present();

        this.subscription = this.notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
            this.loadingService.dismiss();
        });
    }

    doRefresh(event: any): void {
        this.notificationService.getAll(true)
            .subscribe(
                () => event.target.complete(),
                () => event.target.complete());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    handleNotification(notification: Notification): void {
        if (notification.read) {
            return;
        }

        this.notificationService.markAsRead(notification.id)
            .subscribe(() => {
                notification.read = true;
                this.notificationService.getAll(true);

                let url = '';

                if ([1, 2, 3, 4, 5, 10].includes(notification.type)) {
                    url = `/trips/${notification.refId}/info`;
                }

                if (notification.type === 6) {
                    return;
                }

                if ([7, 8].includes(notification.type)) {
                    url = `/profile/${notification.refId}/ratings`;
                }

                if (notification.type === 9) {
                    const users = [notification.generatorUserId, notification.targetUserId].sort((n1, n2) => n1 - n2);
                    url = `/trips/${notification.refId}/${users[0]}/${users[1]}`;
                }

                this.router.navigate([url]);
            });
    }
}
