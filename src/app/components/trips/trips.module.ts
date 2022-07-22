import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TripListComponent } from './trip-list/trip-list.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        RouterModule
    ],
    exports: [
        TripListComponent
    ],
    declarations: [
        TripListComponent
    ],
    providers: [],
})
export class TripsModule {

}
