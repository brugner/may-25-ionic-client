import { ToastService } from 'src/app/services/toast.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PlacePickerResult } from 'src/app/models/places/place-picker-result.model';
import { PlacePickerParams } from 'src/app/models/places/place-picker-params.model';

@Component({
    selector: 'app-place-picker',
    templateUrl: 'place-picker.page.html',
    styleUrls: ['place-picker.page.scss']
})
export class PlacePickerPage implements OnInit {

    title: string;
    lat: number;
    lng: number;
    countryRestriction = {
        latLngBounds: {
            east: -52.609692,
            north: -21.260460,
            south: -55.341651,
            west: -74.144206
        },
        strictBounds: true
    };

    icon = {
        url: '../../../../assets/icon/map-marker.png',
        scaledSize: {
            width: 45,
            height: 45
        }
    };

    readonly zoom: number = 12;
    placePickerResult: PlacePickerResult;
    placePickerParams: PlacePickerParams;

    private geoCoder: google.maps.Geocoder;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.placePickerParams = this.router.getCurrentNavigation().extras.state.placePickerParams;
            } else {
                this.router.navigate(['/']);
            }
        });

        this.loadPlacesAutocomplete();
    }

    markerDragEnd($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.setPlace(this.lat, this.lng);
    }

    returnPlace(): void {
        const extras: NavigationExtras = {
            state: {
                placePickerResult: this.placePickerResult,
                placePickerParams: this.placePickerParams
            }
        };

        this.router.navigate([this.placePickerParams.fromUrl], extras);
    }

    private loadPlacesAutocomplete() {
        this.mapsAPILoader.load().then(() => {

            this.geoCoder = new google.maps.Geocoder();

            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {

                    // Get the place result
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // Verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    // Set latitude, longitude and zoom
                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();

                    // Set the result
                    this.placePickerResult = new PlacePickerResult();
                    this.placePickerResult.placeId = place.place_id;
                    this.placePickerResult.formattedAddress = place.formatted_address;
                    this.placePickerResult.lat = place.geometry.location.lat();
                    this.placePickerResult.lng = place.geometry.location.lng();
                });
            });

            this.setTitle();

            if (this.placePickerParams.lat === undefined || this.placePickerParams.lng === undefined) {
                this.setCurrentLocation();
            }
            else {
                this.setPlace(this.placePickerParams.lat, this.placePickerParams.lng);
            }
        });
    }

    private setPlace(lat: number, lng: number) {

        this.geoCoder.geocode({
            location: {
                lat,
                lng
            }
        }, (results, status) => {

            if (status === 'OK') {
                if (results[0]) {
                    this.lat = results[0].geometry.location.lat();
                    this.lng = results[0].geometry.location.lng();
                    this.searchElementRef.nativeElement.value = results[0].formatted_address;

                    this.placePickerResult = new PlacePickerResult();
                    this.placePickerResult.placeId = results[0].place_id;
                    this.placePickerResult.formattedAddress = results[0].formatted_address;
                    this.placePickerResult.lat = results[0].geometry.location.lat();
                    this.placePickerResult.lng = results[0].geometry.location.lng();
                } else {
                    this.toastService.present('danger', 'No se han encontrado resultados');
                }
            } else {
                this.toastService.present('danger', 'Selecciona un lugar');
            }
        });
    }

    private setTitle(): void {
        if (this.placePickerParams.type === 'origin') {
            this.title = 'Seleccionar origen';
        } else if (this.placePickerParams.type === 'destination') {
            this.title = 'Seleccionar destino';
        } else {
            this.title = 'Error: type not set';
        }
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.setPlace(this.lat, this.lng);
            });
        }
    }
}
