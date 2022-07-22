import { CarService } from 'src/app/services/car.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Car } from 'src/app/models/cars/car.model';
import { LoadingService } from 'src/app/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-my-cars',
    templateUrl: 'my-cars.page.html'
})
export class MyCarsPage implements OnInit, OnDestroy {

    cars: Car[] = [];
    subscription: Subscription;

    constructor(
        private carService: CarService,
        private loadingService: LoadingService) {

    }

    ngOnInit() {
        this.loadingService.present();

        this.subscription = this.carService.cars$.subscribe(cars => {
            this.cars = cars;
            this.loadingService.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    doRefresh(event: any): void {
        this.carService.getMyCars(true)
            .subscribe(
                () => event.target.complete(),
                () => event.target.complete());
    }
}
