import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { MapsAPILoader } from '@agm/core';
import { TripsSearchParams } from 'src/app/models/trips/trips-search-params.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { LoadingService } from 'src/app/services/loading.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html'
})
export class SearchPage implements OnInit {

  searchForm: FormGroup;
  searchParams: TripsSearchParams = new TripsSearchParams();

  moment: any = moment;
  departureMinDate: string = moment().format();

  @ViewChild('searchOrigin')
  public searchOriginElementRef: ElementRef;

  @ViewChild('searchDestination')
  public searchDestinationElementRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private tripService: TripService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private loadingService: LoadingService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.buildSearchForm();
    this.loadPlacesAutocomplete();
  }

  searchTrips(): void {
    this.searchParams.departure = this.searchForm.get('departure').value;

    this.loadingService.present();

    this.tripService.search(this.searchParams)
      .subscribe(result => {
        this.loadingService.dismiss();

        const extras: NavigationExtras = {
          state: {
            searchResults: result
          }
        };

        this.router.navigate(['/trips/search/results'], extras);
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
          this.searchParams.origin.lat = place.geometry.location.lat();
          this.searchParams.origin.lng = place.geometry.location.lng();
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
          this.searchParams.destination.lat = place.geometry.location.lat();
          this.searchParams.destination.lng = place.geometry.location.lng();
        });
      });
    });
  }

  private buildSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchOrigin: new FormControl('', [Validators.required]),
      searchDestination: new FormControl('', [Validators.required]),
      departure: new FormControl(moment().format(), [Validators.required])
    });
  }
}
