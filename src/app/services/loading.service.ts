import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingService {

    isLoading = false;

    constructor(public loadingController: LoadingController) { }

    async present(message?: string) {
        this.isLoading = true;

        if (!message) {
            message = 'Espera, por favor..';
        }

        return await this.loadingController.create({
            message
        }).then(element => {
            element.present().then(() => {

                if (!this.isLoading) {
                    element.dismiss();
                }
            });
        });
    }

    async dismiss() {
        this.isLoading = false;

        return await this.loadingController.getTop().then(value => value ? this.loadingController.dismiss() : null);
    }
}
