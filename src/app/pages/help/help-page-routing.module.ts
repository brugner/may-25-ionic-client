import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpPage } from './help.page.component';

const routes: Routes = [
    {
        path: '',
        component: HelpPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HelpPageRoutingModule {

}
