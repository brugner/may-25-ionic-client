import { UserPublicProfile } from '../../../models/users/user-public-profile.model';
import { TripSeatRequest } from '../../../models/trips/trip-seat-request.model';
import { ToastService } from './../../../services/toast.service';
import { AuthService } from './../../../services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/trips/trip.model';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';
import 'moment/locale/es';
import { SeatRequestService } from 'src/app/services/seat-request.service';
import { ActionSheetController } from '@ionic/angular';
import { UserSeatRequest } from 'src/app/models/trips/user-seat-request.model';
import ProfilePictureHelper from 'src/app/helpers/profile-picture.helper';

@Component({
    selector: 'app-trip-info',
    templateUrl: 'trip-info.page.html',
    styleUrls: ['trip-info.page.scss']
})
export class TripInfoPage implements OnInit {

    trip: Trip = new Trip();
    originLat: number;
    originLng: number;

    destinationLat: number;
    destinationLng: number;

    geoCoder: google.maps.Geocoder;
    moment: any = moment;

    tripDone = true;
    authUserIsDriver = false;
    showSendSeatRequestButton = false;
    showTripFullLabel = false;
    showCancelSeatRequestButton = false;
    showCancelSeatButton = false;
    showChatWithDriverButton = false;
    showChatWithPassengerButton = false;

    constructor(
        private tripService: TripService,
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private mapsAPILoader: MapsAPILoader,
        private authService: AuthService,
        private toastService: ToastService,
        private seatRequestService: SeatRequestService,
        private actionsheetCtrl: ActionSheetController,
        private router: Router) {

    }

    ngOnInit() {
        this.loadingService.present();
        const tripId = Number.parseInt(this.route.snapshot.paramMap.get('tripId'), 10);

        this.tripService.getById(tripId)
            .subscribe((result: Trip) => {
                this.trip = result;
                this.tripDone = moment(result.departure).isBefore(moment());

                if (this.trip.passengers === undefined) {
                    this.trip.passengers = [];
                }

                this.loadingService.dismiss();
                this.loadMaps();
                this.setupUserActions();
            });
    }

    getProfilePicture(picture: string): string {
        return ProfilePictureHelper.getProfilePicture(picture);
    }

    goToRateDriver(): void {
        const extras: NavigationExtras = {
            state: {
                toUser: this.trip.driver
            }
        };

        this.router.navigate([`/ratings/trip/${this.trip.id}/rate/driver/${this.trip.driver.id}`], extras);
    }

    goToRatePassenger(passenger: UserPublicProfile): void {
        const extras: NavigationExtras = {
            state: {
                toUser: passenger
            }
        };

        this.router.navigate([`/ratings/trip/${this.trip.id}/rate/passenger/${passenger.id}`], extras);
    }

    sendSeatRequest(): void {
        this.seatRequestService.sendSeatRequest(this.trip.id)
            .subscribe(() => {
                this.toastService.present('success', 'Solicitud enviada');
                this.ngOnInit();
            });
    }

    cancelSeatRequest(): void {
        this.seatRequestService.cancelSeatRequest(this.trip.id)
            .subscribe(() => {
                this.toastService.present('success', 'Solicitud cancelada');
                this.ngOnInit();
            });
    }

    cancelSeat(): void {
        this.tripService.cancelSeat(this.trip.id)
            .subscribe(() => {
                this.toastService.present('success', 'Lugar cancelado');
                this.ngOnInit();
            });
    }

    cancelTrip(): void {
        this.tripService.cancelTrip(this.trip.id)
            .subscribe(() => {
                this.toastService.present('success', 'Viaje cancelado');
                this.router.navigate(['/']);
            });
    }

    showRatePassengerButton(): boolean {
        // if the trip is done and the auth user is the driver, he/she can rate the passenger
        if (this.tripDone) {
            if (this.authService.user.id === this.trip.driver.id) {
                return true;
            }
        }

        return false;
    }

    showRateDriverButton(): boolean {
        // if the trip is done and the auth user is one of the passengers, he/she can rate the driver
        if (this.tripDone) {
            const passengersIds = this.trip.passengers.map((passenger) => passenger.id);

            if (passengersIds.includes(this.authService.user.id)) {
                return true;
            }
        }

        return false;
    }

    async manageSeatRequest(request: TripSeatRequest): Promise<void> {
        const actionSheet = await this.actionsheetCtrl.create({
            buttons: [
                {
                    text: 'Ver perfil',
                    handler: () => {
                        this.router.navigate(['profile', request.passenger.id]);
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.seatRequestService.acceptRequest(this.trip.id, request.passenger.id)
                            .subscribe(() => {
                                if (this.trip.passengers === undefined) {
                                    this.trip.passengers = [];
                                }

                                const passenger = request.passenger;
                                this.trip.passengers.push(passenger);

                                const index = this.trip.seatRequests.findIndex(x => x.id === request.id);
                                this.trip.seatRequests.splice(index);
                                this.toastService.present('success', 'Solicitud aceptada');
                            });
                    }
                },
                {
                    text: 'Rechazar',
                    handler: () => {
                        this.seatRequestService.rejectRequest(this.trip.id, request.passenger.id)
                            .subscribe(() => {
                                const index = this.trip.seatRequests.findIndex(x => x.id === request.id);
                                this.trip.seatRequests.splice(index);
                                this.toastService.present('success', 'Solicitud rechazada');
                            });
                    }
                },
            ]
        });

        await actionSheet.present();
    }

    goToChat(passengerId?: number): void {
        const tripId = this.trip.id;
        const driverId = this.trip.driver.id;

        if (!passengerId) {
            passengerId = this.authService.user.id;
        }

        const users = [driverId, passengerId].sort((n1, n2) => n1 - n2);

        this.router.navigate([`messages/trip/${tripId}/${users[0]}/${users[1]}`]);
    }

    private setupUserActions() {
        if (this.isAuthUserTheDriver()) {
            this.authUserIsDriver = true;
            this.showChatWithDriverButton = false;
            this.showChatWithPassengerButton = true;
        }
        else if (this.isAuthUserAPassenger()) {
            this.showSendSeatRequestButton = false;
            this.showCancelSeatRequestButton = false;
            this.showCancelSeatButton = true;
            this.showChatWithDriverButton = true;
            this.showChatWithPassengerButton = false;
        }
        else {
            this.seatRequestService.getMySeatRequests()
                .subscribe((requests: UserSeatRequest[]) => {
                    if (this.isAuthUserASeatRequester(requests)) {
                        this.showSendSeatRequestButton = false;
                        this.showCancelSeatRequestButton = true;
                        this.showCancelSeatButton = false;
                        this.showChatWithDriverButton = true;
                        this.showChatWithPassengerButton = false;
                    }
                    else {

                        if (this.trip.maxPassengers === this.trip.passengers.length) {
                            this.showSendSeatRequestButton = false;
                            this.showTripFullLabel = true;
                        }

                        this.showSendSeatRequestButton = true;
                        this.showCancelSeatRequestButton = false;
                        this.showCancelSeatButton = false;
                        this.showChatWithDriverButton = false;
                        this.showChatWithPassengerButton = false;
                    }
                });
        }
    }

    private isAuthUserASeatRequester(requests: UserSeatRequest[]) {
        return requests.find(x => x.tripId === this.trip.id);
    }

    private isAuthUserAPassenger() {
        return this.trip.passengers.find(x => x.id === this.authService.user.id);
    }

    private isAuthUserTheDriver() {
        return this.trip.driver.id === this.authService.user.id;
    }

    private loadMaps() {
        this.mapsAPILoader.load().then(() => {
            this.setPlace('origin', this.trip.origin.lat, this.trip.origin.lng);
            this.setPlace('destination', this.trip.destination.lat, this.trip.destination.lng);
        });
    }

    private setPlace(type: string, lat: number, lng: number) {
        this.geoCoder = new google.maps.Geocoder();

        this.geoCoder.geocode({
            location: {
                lat,
                lng
            }
        }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {

                    if (type === 'origin') {
                        this.originLat = results[0].geometry.location.lat();
                        this.originLng = results[0].geometry.location.lng();
                    }

                    if (type === 'destination') {
                        this.destinationLat = results[0].geometry.location.lat();
                        this.destinationLng = results[0].geometry.location.lng();
                    }
                } else {
                    this.toastService.present('danger', 'No se han encontrado resultados');
                }
            } else {
                this.toastService.present('danger', 'Selecciona un lugar');
            }
        });
    }
}
