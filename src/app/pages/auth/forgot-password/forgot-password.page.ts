import { Router } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.page.html'
})
export class ForgotPasswordPage implements OnInit {

    title: string = environment.appName;
    subtitle: string = environment.appSlogan;

    forgotPasswordForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private userService: UserService,
        private router: Router) {

    }

    ngOnInit(): void {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    resetPasswordRequest(): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.loadingService.present();

        this.userService.resetPassword(this.forgotPasswordForm.get('email').value)
            .subscribe(() => {
                this.loadingService.dismiss();
                this.toastService.present('success', 'Perfecto, revisa tu email para continuar');
                this.router.navigate(['/auth']);
            });
    }
}
