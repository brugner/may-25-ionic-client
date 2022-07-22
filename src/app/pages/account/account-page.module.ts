import { ChangePasswordPage } from './change-password/change-password.page';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPageRoutingModule } from './account-page-routing.module';
import { AccountPage } from './account.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AccountPageRoutingModule
    ],
    exports: [

    ],
    declarations: [
        AccountPage,
        ChangePasswordPage
    ],
    providers: [

    ],
})
export class AccountPageModule {

}
