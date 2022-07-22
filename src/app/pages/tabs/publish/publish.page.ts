import { SettingService } from './../../../services/setting.service';
import { CarService } from './../../../services/car.service';
import { Car } from './../../../models/cars/car.model';
import { Trip } from '../../../models/trips/trip.model';
import { ToastService } from './../../../services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TripForCreation } from '../../../models/trips/trip-for-creation.model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PlacePickerResult } from 'src/app/models/places/place-picker-result.model';
import { PlaceForCreation } from 'src/app/models/places/place-for-creation.model';
import { TripService } from 'src/app/services/trip.service';
import { PlacePickerParams } from 'src/app/models/places/place-picker-params.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.page.html',
    styleUrls: ['./publish.page.scss']
})
export class PublishPage implements OnInit {

    tripForm: FormGroup;
    originText = '¿Desde dónde sales?';
    destinationText = '¿Hasta dónde vas?';
    originResult: PlacePickerResult = new PlacePickerResult();
    destinationResult: PlacePickerResult = new PlacePickerResult();
    subscription: Subscription;
    userCars: Car[] = [];
    departureMinDate: string = moment().format();
    departureMaxDate: string = moment().add(15, 'day').format();
    maxPassengers = 1;
    fuelPrice: number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private tripService: TripService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private carService: CarService,
        private settingsService: SettingService) {

    }

    ngOnInit(): void {
        this.buildTripForm();

        this.subscription = this.carService.cars$.subscribe(cars => {
            this.userCars = cars;
            this.loadingService.dismiss();

            if (this.userCars.length > 0) {
                this.car.setValue(this.userCars[0].id);
            }
        });

        this.settingsService.getSettings()
            .subscribe(result => {
                this.fuelPrice = result.fuelPrice;
            })

        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                const state = this.router.getCurrentNavigation().extras.state;

                if (state.placePickerParams.type === 'origin') {
                    this.originResult = state.placePickerResult;
                    this.originText = state.placePickerResult.formattedAddress;
                }

                if (state.placePickerParams.type === 'destination') {
                    this.destinationResult = state.placePickerResult;
                    this.destinationText = state.placePickerResult.formattedAddress;
                }

                if (this.originResult?.formattedAddress && this.destinationResult?.formattedAddress) {
                    this.calculateTripData();
                }
            }
        });
    }

    doRefresh(event: any): void {
        this.carService.getMyCars()
            .subscribe(
                () => event.target.complete(),
                () => event.target.complete());
    }

    createTrip(): void {

        if (!this.tripForm.valid) {
            return;
        }

        const trip = new TripForCreation();
        trip.carId = this.car.value;
        trip.origin = this.getOrigin();
        trip.destination = this.getDestination();
        trip.departure = this.departure.value;
        trip.maxPassengers = this.maxPassengers;
        trip.description = this.description.value;
        trip.distance = this.distance.value;
        trip.duration = this.duration.value;
        trip.suggestedCost = this.suggestedCost.value;
        trip.cost = this.cost.value;
        trip.costPerPassenger = this.costPerPassenger.value;

        if (trip.origin.formattedAddress === undefined || trip.destination.formattedAddress === undefined) {
            this.toastService.present('danger', 'Debes seleccionar un origen y destino');
            return;
        }

        this.loadingService.present();

        this.tripService.publish(trip)
            .subscribe((result: Trip) => {
                this.cleanForm();
                this.loadingService.dismiss();
                this.toastService.present('success', 'Viaje publicado');
                this.router.navigate([`/trips/${result.id}/info`]);
            }, () => {
                this.loadingService.dismiss();
            });
    }

    cancelPublish(): void {
        this.cleanForm();
    }

    pickOrigin(): void {
        const params: PlacePickerParams = {
            fromUrl: 'tabs/publish',
            type: 'origin',
            lat: this.originResult.lat,
            lng: this.originResult.lng
        };

        const extras: NavigationExtras = {
            state: {
                placePickerParams: params
            }
        };

        this.router.navigate(['/trips/place-picker'], extras);
    }

    pickDestination(): void {
        const params: PlacePickerParams = {
            fromUrl: 'tabs/publish',
            type: 'destination',
            lat: this.destinationResult.lat,
            lng: this.destinationResult.lng
        };

        const extras: NavigationExtras = {
            state: {
                placePickerParams: params
            }
        };

        this.router.navigate(['/trips/place-picker'], extras);
    }

    getOrigin(): PlaceForCreation {
        const origin = new PlaceForCreation();
        origin.googlePlaceId = this.originResult.placeId;
        origin.formattedAddress = this.originResult.formattedAddress;
        origin.lat = this.originResult.lat;
        origin.lng = this.originResult.lng;

        return origin;
    }

    getDestination(): PlaceForCreation {
        const destination = new PlaceForCreation();
        destination.googlePlaceId = this.destinationResult.placeId;
        destination.formattedAddress = this.destinationResult.formattedAddress;
        destination.lat = this.destinationResult.lat;
        destination.lng = this.destinationResult.lng;

        return destination;
    }

    decrementMaxPassengers(): void {
        this.maxPassengers--;
    }

    incrementMaxPassengers(): void {
        this.maxPassengers++;
    }

    onCostChanged(event: any): void {
        const cost = this.cost.value;

        if (cost > 0) {
            this.costPerPassenger.setValue(Math.round(cost / 4));
        } else {
            this.costPerPassenger.setValue(0);
        }
    }

    private buildTripForm(): void {
        const date = moment().hours(moment().hours() + 2).minutes(0).format();

        this.tripForm = this.formBuilder.group({
            departure: new FormControl(date, [Validators.required]),
            maxPassengers: new FormControl(1, [Validators.required]),
            description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]),
            car: new FormControl('', [Validators.required]),
            distanceText: new FormControl({ value: '', disabled: true }),
            distance: new FormControl(''),
            durationText: new FormControl({ value: '', disabled: true }),
            duration: new FormControl(''),
            suggestedCost: new FormControl({ value: '', disabled: true }),
            cost: new FormControl('', [Validators.required, Validators.min(100)]),
            costPerPassenger: new FormControl({ value: '', disabled: true })
        });
    }

    private cleanForm(): void {
        this.originText = '¿Desde dónde sales?';
        this.destinationText = '¿Hasta dónde vas?';
        this.originResult = new PlacePickerResult();
        this.destinationResult = new PlacePickerResult();

        const date = moment().hours(moment().hours() + 2).minutes(0).format();
        this.departure.setValue(date);

        this.maxPassengers = 1;
        this.description.setValue('');
        this.car.setValue(this.userCars[0].id);

        this.distanceText.setValue('');
        this.distance.setValue(0);
        this.durationText.setValue('');
        this.duration.setValue(0);

        this.suggestedCost.setValue(0);
        this.cost.setValue(0);
        this.costPerPassenger.setValue(0);
    }

    private calculateTripData(): void {
        const directionsService = new google.maps.DirectionsService();
        const origin = new google.maps.LatLng(this.originResult.lat, this.originResult.lng);
        const destination = new google.maps.LatLng(this.destinationResult.lat, this.destinationResult.lng);

        console.log(new Date(this.departure.value));
        directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            region: 'AR'
        }, (response, status) => {
            if (status === 'OK') {
                this.distanceText.setValue(response?.routes[0]?.legs[0]?.distance?.text);
                this.distance.setValue(response?.routes[0]?.legs[0]?.distance?.value);

                this.durationText.setValue(response?.routes[0]?.legs[0]?.duration?.text?.replace('hours', 'hora(s)'));
                this.duration.setValue(response?.routes[0]?.legs[0]?.duration?.value);

                let value = response?.routes[0]?.legs[0]?.distance?.value ? response?.routes[0]?.legs[0]?.distance?.value : 0;
                const suggestedCost = Math.round((value / 1000) / 100 * (10 * this.fuelPrice));

                this.suggestedCost.setValue(suggestedCost);
                this.cost.setValue(suggestedCost);
                this.costPerPassenger.setValue(Math.round(suggestedCost / 4));
            }
        });
    }

    get departure() {
        return this.tripForm.get('departure');
    }

    get description() {
        return this.tripForm.get('description');
    }

    get car() {
        return this.tripForm.get('car');
    }

    get distanceText() {
        return this.tripForm.get('distanceText');
    }

    get distance() {
        return this.tripForm.get('distance');
    }

    get durationText() {
        return this.tripForm.get('durationText');
    }

    get duration() {
        return this.tripForm.get('duration');
    }

    get suggestedCost() {
        return this.tripForm.get('suggestedCost');
    }

    get cost() {
        return this.tripForm.get('cost');
    }

    get costPerPassenger() {
        return this.tripForm.get('costPerPassenger');
    }
}
