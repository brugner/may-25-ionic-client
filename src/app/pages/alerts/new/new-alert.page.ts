import { Router } from '@angular/router';
import { ToastService } from './../../../services/toast.service';
import { LoadingService } from './../../../services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { AlertForCreation } from './../../../models/alerts/alert-for-creation.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'app-new-alert',
    templateUrl: 'new-alert.page.html'
})
export class NewAlertPage implements OnInit {

    alertForm: FormGroup;
    alertForCreation = new AlertForCreation();

    @ViewChild('searchOrigin')
    public searchOriginElementRef: ElementRef;

    @ViewChild('searchDestination')
    public searchDestinationElementRef: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private alertService: AlertService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.buildAlertForm();
        this.loadPlacesAutocomplete();
    }

    createAlert(): void {
        if (!this.alertForm.valid) {
            return;
        }

        this.loadingService.present();

        this.alertService.create(this.alertForCreation)
            .subscribe(() => {
                this.loadingService.dismiss();
                this.toastService.present('success', 'Alerta creada');
                this.router.navigate(['/alerts']);
            });
    }

    cleanForm(): void {
        this.alertForm.get('searchOrigin').setValue('');
        this.alertForm.get('searchDestination').setValue('');
        this.alertForCreation = new AlertForCreation();
    }

    private buildAlertForm(): void {
        this.alertForm = this.formBuilder.group({
            searchOrigin: new FormControl('', [Validators.required]),
            searchDestination: new FormControl('', [Validators.required])
        });
    }

    private loadPlacesAutocomplete() {
        this.mapsAPILoader.load().then(() => {

            const originAutocomplete = new google.maps.places.Autocomplete(this.searchOriginElementRef.nativeElement);

            originAutocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {

                    // Get the place result
                    const place: google.maps.places.PlaceResult = originAutocomplete.getPlace();

                    // Verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    // Set the result
                    this.alertForCreation.originLat = place.geometry.location.lat();
                    this.alertForCreation.originLng = place.geometry.location.lng();
                    this.alertForCreation.originFormattedAddress = place.formatted_address;
                });
            });

            const destinationAutocomplete = new google.maps.places.Autocomplete(this.searchDestinationElementRef.nativeElement);

            destinationAutocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {

                    // Get the place result
                    const place: google.maps.places.PlaceResult = destinationAutocomplete.getPlace();

                    // Verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    // Set the result
                    this.alertForCreation.destinationLat = place.geometry.location.lat();
                    this.alertForCreation.destinationLng = place.geometry.location.lng();
                    this.alertForCreation.destinationFormattedAddress = place.formatted_address;
                });
            });
        });
    }
}
