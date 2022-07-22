import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/models/alerts/alert.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-alert-details',
    templateUrl: 'alert-details.page.html'
})
export class AlertDetailsPage implements OnInit {

    alert: Alert = new Alert();

    moment: any = moment;

    constructor(
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private alertCtrl: AlertController) {

    }

    ngOnInit() {
        const id = Number.parseInt(this.route.snapshot.paramMap.get('alertId'), 10);

        this.alertService.getById(id)
            .subscribe(result => {
                this.alert = result;
            });
    }

    deleteAlert(): void {
        this.alertCtrl.create({
            header: environment.appName,
            message: '¿Quieres eliminar esta alerta?',
            buttons: [{
                text: 'No',
                role: 'cancel'
            }, {
                text: 'Eliminar',
                handler: () => {
                    this.alertService.delete(this.alert.id)
                        .subscribe(() => {
                            this.router.navigateByUrl('/alerts');
                        });
                }
            }]
        })
            .then(alertEl => {
                alertEl.present();
            });
    }
}
