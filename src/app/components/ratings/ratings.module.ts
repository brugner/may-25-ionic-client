import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RatingsListComponent } from './ratings-list/ratings-list.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        RouterModule
    ],
    exports: [
        RatingsListComponent
    ],
    declarations: [
        RatingsListComponent
    ],
    providers: [],
})
export class RatingsModule {

}
