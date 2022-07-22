import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpPage } from './help.page.component';
import { HelpPageRoutingModule } from './help-page-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HelpPageRoutingModule
    ],
    exports: [

    ],
    declarations: [
        HelpPage
    ],
    providers: [

    ],
})
export class HelpPageModule {

}
