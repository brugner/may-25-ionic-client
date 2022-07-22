import { MyCarsPage } from './my-cars/my-cars.page';
import { CarService } from './../../services/car.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewCarPage } from './new-car/new-car.page';
import { CarsPageRoutingModule } from './cars-page.routing.module';
import { EditCarPage } from './edit-car/edit-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CarsPageRoutingModule
  ],
  declarations: [
    MyCarsPage,
    NewCarPage,
    EditCarPage
  ],
  providers: [
    CarService
  ]
})
export class CarsPageModule {

}
