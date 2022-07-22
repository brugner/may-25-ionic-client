import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { ToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [ToolbarComponent],
    declarations: [ToolbarComponent],
    providers: [],
})
export class ToolbarModule {

}
