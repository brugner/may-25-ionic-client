import { ToolbarModule } from './../../components/toolbar/toolbar.module';
import { TripsModule } from './../../components/trips/trips.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TripsPageRoutingModule } from './trips-page-routing.module';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { PlacePickerPage } from './place-picker/place-picker.page';
import { TripService } from 'src/app/services/trip.service';
import { TripInfoPage } from './trip-info/trip-info.page';
import { MyTripsPage } from './my-trips/my-trips.page';
import { RatingModule } from 'ng-starrating';
import { SearchResultsPage } from './search-results/search-results.page';
import { environment } from 'src/environments/environment';
import { KmPipe } from 'src/app/pipes/km.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TripsPageRoutingModule,
    TripsModule,
    RatingModule,
    ToolbarModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      libraries: ['places'],
      language: 'es',
      region: 'AR'
    })
  ],
  declarations: [
    PlacePickerPage,
    TripInfoPage,
    MyTripsPage,
    SearchResultsPage,
    KmPipe,
    TimePipe
  ],
  providers: [
    TripService
  ]
})
export class TripsPageModule {

}
