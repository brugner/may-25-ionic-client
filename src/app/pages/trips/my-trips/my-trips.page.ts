import { TripService } from './../../../services/trip.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyTrips } from 'src/app/models/trips/my-trips.model';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-my-trips',
    templateUrl: 'my-trips.page.html'
})
export class MyTripsPage implements OnInit, OnDestroy {

    myTrips: MyTrips = new MyTrips();
    subscription: Subscription;

    asDriverVisible = true;
    asPassengerVisible = false;
    asSeatRequesterVisible = false;

    asDriverColor = 'primary';
    asPassengerColor = 'default';
    asSeatRequesterColor = 'default';

    constructor(private tripService: TripService, private loadingService: LoadingService) {

    }

    ngOnInit() {
        this.loadingService.present();

        this.subscription = this.tripService.myTrips$.subscribe(myTrips => {
            this.myTrips = myTrips;
            this.loadingService.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    doRefresh(event: any): void {
        this.tripService.getMyTrips(true)
            .subscribe(
                () => event.target.complete(),
                () => event.target.complete());
    }

    asDriver(): void {
        this.asDriverVisible = true;
        this.asPassengerVisible = false;
        this.asSeatRequesterVisible = false;

        this.asDriverColor = 'primary';
        this.asPassengerColor = 'default';
        this.asSeatRequesterColor = 'default';
    }

    asPassenger(): void {
        this.asDriverVisible = false;
        this.asPassengerVisible = true;
        this.asSeatRequesterVisible = false;

        this.asDriverColor = 'default';
        this.asPassengerColor = 'primary';
        this.asSeatRequesterColor = 'default';
    }

    asSeatRequester(): void {
        this.asDriverVisible = false;
        this.asPassengerVisible = false;
        this.asSeatRequesterVisible = true;

        this.asDriverColor = 'default';
        this.asPassengerColor = 'default';
        this.asSeatRequesterColor = 'primary';
    }
}
