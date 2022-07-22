import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordParams } from 'src/app/models/auth/change-password-params.model';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
    selector: 'app-change-password',
    templateUrl: 'change-password.page.html'
})
export class ChangePasswordPage implements OnInit {

    changePasswordForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private userService: UserService) {

    }

    ngOnInit(): void {
        this.buildChangePasswordForm();
    }

    changePassword(): void {
        if (this.changePasswordForm.invalid) {
            return;
        }

        this.loadingService.present();

        const changePasswordParams = new ChangePasswordParams();
        changePasswordParams.currentPassword = this.currentPassword.value;
        changePasswordParams.newPassword = this.newPassword.value;
        changePasswordParams.repeatNewPassword = this.repeatNewPassword.value;

        this.userService.changePassword(changePasswordParams)
            .subscribe(() => {
                this.cleanForm();
                this.loadingService.dismiss();
                this.toastService.present('success', 'Has cambiado tu contraseña');
                this.router.navigateByUrl('/account');
            }, () => {
                this.loadingService.dismiss();
            });
    }

    cancel(): void {
        this.cleanForm();
    }

    private buildChangePasswordForm(): void {
        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', [Validators.required, Validators.minLength(6)]],
            passwords: this.formBuilder.group({
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]],
            }, { validator: this.passwordValidator })
        });
    }

    private passwordValidator(c: AbstractControl): { invalid: boolean } {
        if (c.get('newPassword').value !== c.get('repeatNewPassword').value) {
            return { invalid: true };
        }
    }

    private cleanForm(): void {
        this.currentPassword.setValue('');
        this.currentPassword.setValue('');
        this.repeatNewPassword.setValue('');
    }

    get currentPassword() {
        return this.changePasswordForm.get('currentPassword');
    }

    get newPassword() {
        return this.changePasswordForm.get(['passwords', 'newPassword']);
    }

    get repeatNewPassword() {
        return this.changePasswordForm.get(['passwords', 'repeatNewPassword']);
    }
}
