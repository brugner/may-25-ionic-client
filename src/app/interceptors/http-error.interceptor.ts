import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private loadingService: LoadingService,
        private router: Router) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(1), catchError(err => {
            this.loadingService.dismiss();


            if (err.status === 0) {
                this.toastService.present('danger', 'Servicio no disponible. Intenta nuevamente.');
            }
            else if (err.status === 401) {
                this.authService.logout();
                location.reload();
            }
            else if (err.status === 403) {
                this.toastService.present('danger', 'Permisos insuficientes');
            }
            else if (err.status === 404) {
                this.toastService.present('danger', 'Mmm parece que eso no existe');
                this.router.navigate(['/tabs/search']);
            }
            else if (err.status === 500) {
                this.toastService.present('danger', 'Algo salió mal, intenta nuevamente.');
            }

            console.log('E753', err);
            return throwError(err);
        }));
    }
}
