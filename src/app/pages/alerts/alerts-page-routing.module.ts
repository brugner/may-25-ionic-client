import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertDetailsPage } from './details/alert-details.page';
import { AlertsListPage } from './list/alerts-list.page';
import { NewAlertPage } from './new/new-alert.page';

const routes: Routes = [
    {
        path: '',
        component: AlertsListPage
    },
    {
        path: ':alertId/details',
        component: AlertDetailsPage
    },
    {
        path: 'new',
        component: NewAlertPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AlertsPageRoutingModule {

}
