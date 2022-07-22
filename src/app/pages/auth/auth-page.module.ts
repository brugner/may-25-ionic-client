import { UserService } from 'src/app/services/user.service';
import { RegisterPage } from './register/register.page';
import { LoginPage } from './login/login.page';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthHomePage } from './home/auth-home.page';
import { AuthPageRoutingModule } from './auth-page-routing.module';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthPageRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule
    ],
    declarations: [
        AuthHomePage,
        LoginPage,
        RegisterPage,
        ForgotPasswordPage
    ],
    providers: [
        UserService,
        GooglePlus
    ]
})
export class AuthPageModule {

}
