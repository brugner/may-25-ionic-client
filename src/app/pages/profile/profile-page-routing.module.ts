import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfilePage } from './edit-profile/edit-profile.page';
import { TellUsPage } from './tell-us/tell-us.page';
import { PublicProfilePage } from './public-profile/public-profile.page';
import { RatingsPage } from './ratings/ratings.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'edit'
    },
    {
        path: 'edit',
        component: EditProfilePage
    },
    {
        path: 'tell-us',
        component: TellUsPage
    },
    {
        path: ':userId',
        component: PublicProfilePage
    },
    {
        path: 'me',
        component: PublicProfilePage
    },
    {
        path: ':userId/ratings',
        component: RatingsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfilePageRoutingModule {

}
