import { FcmService } from './../../../services/fcm.service';
import { ToastService } from './../../../services/toast.service';
import { LoadingService } from './../../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from 'src/environments/environment';
import { UserForAuth } from 'src/app/models/auth/user-for-auth.model';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

    title: string = environment.appName;
    subtitle: string = environment.appSlogan;

    loginForm: FormGroup;
    returnUrl: string;
    ttt: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private fcmService: FcmService,
        private afAuth: AngularFireAuth,
        private googlePlus: GooglePlus) {
        if (this.authService.user) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.buildLoginForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        if (this.loginForm.invalid) {
            return;
        }

        this.loadingService.present();

        const userForAuth = new UserForAuth(this.email.value, this.password.value);

        this.authService.login(userForAuth)
            .subscribe(
                () => {
                    this.loadingService.dismiss();
                    this.fcmService.initPush();
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    if (error.status !== 0) {
                        this.toastService.present('danger', error.error.title === 'Username or password is incorrect' ? 'Usuario o contraseña incorrectos' : error.error.title);
                        this.loadingService.dismiss();
                    }
                });
    }

    async loginGoogle() {
        const res = await this.googlePlus.login({
            webClientId: '1010073352214-hs9iijar76g6j6ikn0ae4cm6ibbqmok2.apps.googleusercontent.com',
            offline: true
        });

        const resConfirmed = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));

        if (resConfirmed.user) {
            const token = await resConfirmed.user.getIdToken();
            this.authService.googleLogin(token)
                .subscribe(() => {
                    this.fcmService.initPush();
                    this.router.navigate([this.returnUrl]);
                });
        }
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    private buildLoginForm(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
}
