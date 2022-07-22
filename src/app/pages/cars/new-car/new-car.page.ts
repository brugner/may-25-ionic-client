import { Model } from '../../../models/cars/model.model';
import { ToastService } from 'src/app/services/toast.service';
import { Car } from './../../../models/cars/car.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarForCreation } from 'src/app/models/cars/car-for-creation.model';
import { CarService } from 'src/app/services/car.service';
import { argentinaPlateNumberValidator } from 'src/app/validators/argentina-plate-number.directive';
import { MakeService } from 'src/app/services/make.service';
import { Make } from 'src/app/models/cars/make.model';
import { LoadingService } from 'src/app/services/loading.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.page.html',
  styleUrls: ['./new-car.page.scss']
})
export class NewCarPage implements OnInit {

  car: Car = new Car();
  carForm: FormGroup;
  makes: Make[] = [];
  models: Model[] = [];
  years: number[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private toastService: ToastService,
    private makeService: MakeService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loadingService.present();
    this.buildCarForm();

    this.makeService.getAll()
      .pipe(map(makes => {
        this.makes = makes;
        this.loadingService.dismiss();
      }))
      .subscribe(() => {
        this.fillYearsDropdown();
      });
  }

  createCar(): void {
    const car = new CarForCreation();
    car.plateNumber = this.plateNumber.value;
    car.makeId = this.make.value;
    car.modelId = this.model.value;
    car.year = +this.year.value;
    car.color = +this.color.value;

    this.loadingService.present();

    this.carService.createCar(car)
      .subscribe(() => {
        this.cleanForm();
        this.loadingService.dismiss();
        this.toastService.present('success', 'Auto agregado');
        this.router.navigateByUrl('/cars/my-cars');
      });
  }

  validateKeyPlateNumber($event: any): boolean {
    const isNumber = $event.keyCode >= 48 && $event.keyCode <= 57;
    const isUppercaseLetter = $event.keyCode >= 65 && $event.keyCode <= 90;
    const isLowercaseLetter = $event.keyCode >= 97 && $event.keyCode <= 122;

    if (isNumber || isUppercaseLetter || isLowercaseLetter) {
      return true;
    }

    return false;
  }

  onMakeChange($event: any): void {
    this.models = this.makes.find(x => x.id === $event.detail.value).models;
    this.model.setValue(this.models[0].id);
    this.cdr.detectChanges();
  }

  private fillYearsDropdown() {
    const now = new Date().getUTCFullYear();
    this.years = Array(now - (now - 25)).fill('').map((v, idx) => now - idx);
    this.year.setValue(this.years[0]);
  }

  private buildCarForm(): void {
    this.carForm = this.formBuilder.group({
      plateNumber: ['', [Validators.required, argentinaPlateNumberValidator()]],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getUTCFullYear().toString(), Validators.required],
      color: ['1', Validators.required]
    });
  }

  private cleanForm(): void {
    this.plateNumber.setValue('');
    this.make.setValue(this.makes[0].id);
    this.model.setValue(this.makes[0].models[0].id);
    this.year.setValue(new Date().getUTCFullYear());
    this.color.setValue(1);
  }

  get plateNumber() {
    return this.carForm.get('plateNumber');
  }

  get make() {
    return this.carForm.get('make');
  }

  get model() {
    return this.carForm.get('model');
  }

  get year() {
    return this.carForm.get('year');
  }

  get color() {
    return this.carForm.get('color');
  }
}
