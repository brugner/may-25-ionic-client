import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertsPageRoutingModule } from './alerts-page-routing.module';
import { AlertsListPage } from './list/alerts-list.page';
import { AlertDetailsPage } from './details/alert-details.page';
import { NewAlertPage } from './new/new-alert.page';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AlertsPageRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapsApiKey,
            libraries: ['places'],
            language: 'es',
            region: 'AR'
        })
    ],
    exports: [

    ],
    declarations: [
        AlertsListPage,
        AlertDetailsPage,
        NewAlertPage
    ],
    providers: [
        UserService
    ],
})
export class AlertsPageModule {

}
