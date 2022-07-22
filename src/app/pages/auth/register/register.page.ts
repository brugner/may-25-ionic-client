import { FcmService } from './../../../services/fcm.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from 'src/environments/environment';
import { UserForAuth } from 'src/app/models/auth/user-for-auth.model';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
    templateUrl: 'register.page.html',
    styleUrls: ['register.page.scss']
})
export class RegisterPage implements OnInit {

    title: string = environment.appName;
    subtitle: string = environment.appSlogan;
    registerForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private userService: UserService,
        private fcmService: FcmService,
        private afAuth: AngularFireAuth,
        private googlePlus: GooglePlus) {

        if (this.authService.user) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.buildRegisterForm();
    }

    register() {
        if (this.registerForm.invalid) {
            return;
        }

        this.loadingService.present();
        const user = new UserForAuth(this.email.value, this.password.value);

        this.userService.createUser(user)
            .subscribe(() => {
                this.authService.login(user)
                    .subscribe(() => {
                        this.cleanForm();
                        this.loadingService.dismiss();
                        this.toastService.present('success', 'Tu cuenta ha sido creada');

                        this.fcmService.initPush();
                        this.router.navigateByUrl('/profile/tell-us');
                    });
            }, error => {
                const message = 'El email ya se encuentra en uso';
                this.toastService.present('danger', error.error.title === 'The email already exists' ? message : error.error.title);
                this.loadingService.dismiss();
            });
    }

    async registerGoogle() {
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
                    this.router.navigateByUrl('/profile/tell-us');
                });
        }
    }

    private cleanForm(): void {
        this.email.setValue('');
        this.password.setValue('');
        this.repeatPassword.setValue('');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get(['passwords', 'password']);
    }

    get repeatPassword() {
        return this.registerForm.get(['passwords', 'repeatPassword']);
    }

    private buildRegisterForm(): void {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(6)]],
                repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
            }, { validator: this.passwordValidator })
        });
    }

    private passwordValidator(c: AbstractControl): { invalid: boolean } {
        if (c.get('password').value !== c.get('repeatPassword').value) {
            return { invalid: true };
        }
    }
}
