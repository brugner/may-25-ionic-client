import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacePickerPage } from './place-picker/place-picker.page';
import { TripInfoPage } from './trip-info/trip-info.page';
import { MyTripsPage } from './my-trips/my-trips.page';
import { SearchResultsPage } from './search-results/search-results.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new'
  },
  {
    path: 'place-picker',
    component: PlacePickerPage
  },
  {
    path: ':tripId/info',
    component: TripInfoPage
  },
  {
    path: 'mine',
    component: MyTripsPage
  },
  {
    path: 'search/results',
    component: SearchResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {

}
