import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { NotificationsPageRoutingModule } from './notifications-page.routing.module';

import { NotificationsPage } from './notifications.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        NotificationsPageRoutingModule
    ],
    exports: [],
    declarations: [
        NotificationsPage
    ],
    providers: [],
})
export class NotificationsPageModule {

}
