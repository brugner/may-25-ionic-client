import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { AuthHomePage } from './home/auth-home.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';

const routes: Routes = [
    {
        path: '',
        component: AuthHomePage,
    },
    {
        path: 'login',
        component: LoginPage,
    },
    {
        path: 'register',
        component: RegisterPage,
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthPageRoutingModule {

}
