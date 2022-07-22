import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountPage } from './account.page';
import { ChangePasswordPage } from './change-password/change-password.page';

const routes: Routes = [
    {
        path: '',
        component: AccountPage
    },
    {
        path: 'change-password',
        component: ChangePasswordPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountPageRoutingModule {

}
