import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

    constructor(
        private loggingService: LoggingService,
        private toastService: ToastService,
        private router: Router,
        private zone: NgZone) {
        super();
    }

    handleError(error: Error) {
        this.zone.run(() => {
            this.loggingService.logException(error);
            this.toastService.present('danger', 'Algo salió mal, intenta nuevamente');

            console.log('E753', error);
            this.router.navigate(['/tabs/search']);
        });
    }
}
