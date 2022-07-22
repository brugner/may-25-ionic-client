import { PublicProfilePage } from './public-profile/public-profile.page';
import { PhotoService } from 'src/app/services/photo.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TellUsPage } from './tell-us/tell-us.page';
import { EditProfilePage } from './edit-profile/edit-profile.page';
import { UserService } from 'src/app/services/user.service';
import { RatingsPage } from './ratings/ratings.page';
import { RatingsModule } from 'src/app/components/ratings/ratings.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProfilePageRoutingModule,
        RatingsModule
    ],
    exports: [

    ],
    declarations: [
        EditProfilePage,
        TellUsPage,
        PublicProfilePage,
        RatingsPage
    ],
    providers: [
        UserService,
        PhotoService,
        Camera
    ],
})
export class ProfilePageModule {

}
