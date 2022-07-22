import { MyCarsPage } from './my-cars/my-cars.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewCarPage } from './new-car/new-car.page';
import { EditCarPage } from './edit-car/edit-car.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-cars'
  },
  {
    path: 'my-cars',
    component: MyCarsPage
  },
  {
    path: 'new',
    component: NewCarPage
  },
  {
    path: 'edit/:carId',
    component: EditCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarsPageRoutingModule {

}
