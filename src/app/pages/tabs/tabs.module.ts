import { ToolbarModule } from './../../components/toolbar/toolbar.module';
import { environment } from 'src/environments/environment';
import { SearchPage } from './search/search.page';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { TripService } from 'src/app/services/trip.service';
import { AgmCoreModule } from '@agm/core';
import { TripsModule } from 'src/app/components/trips/trips.module';
import { PublishPage } from './publish/publish.page';
import { MenuPage } from './menu/menu.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsPageRoutingModule,
    TripsModule,
    ToolbarModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      libraries: ['places'],
      language: 'es',
      region: 'AR'
    })
  ],
  declarations: [
    TabsPage,
    PublishPage,
    SearchPage,
    MenuPage
  ],
  providers: [
    TripService
  ]
})
export class TabsPageModule {

}
