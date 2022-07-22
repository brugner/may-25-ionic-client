import { AlertController } from '@ionic/angular';
import { Car } from './../../../models/cars/car.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CarService } from 'src/app/services/car.service';
import { CarForUpdate } from 'src/app/models/cars/car-for-update.model';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast.service';
import { Make } from 'src/app/models/cars/make.model';
import { Model } from 'src/app/models/cars/model.model';
import { argentinaPlateNumberValidator } from 'src/app/validators/argentina-plate-number.directive';
import { MakeService } from 'src/app/services/make.service';
import { LoadingService } from 'src/app/services/loading.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.page.html',
  styleUrls: ['./edit-car.page.scss']
})
export class EditCarPage implements OnInit {

  car: Car = new Car();
  carForm: FormGroup;
  makes: Make[] = [];
  models: Model[] = [];
  years: number[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
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
      }))
      .subscribe(() => {
        this.fillYearsDropdown();
        this.loadCar();
      });
  }

  private loadCar() {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('carId'), 10);

    this.carService.getCarById(id)
      .subscribe(result => {
        this.setFormFromCar(result);
        this.loadingService.dismiss();
      });
  }

  updateCar(): void {
    const car = new CarForUpdate();
    car.plateNumber = this.plateNumber.value.toUpperCase();
    car.makeId = this.make.value;
    car.modelId = this.model.value;
    car.year = +this.year.value;
    car.color = +this.color.value;

    this.loadingService.present();

    this.carService.updateCar(this.id.value, car)
      .subscribe(() => {
        this.loadingService.dismiss();
        this.cleanForm();
        this.toastService.present('success', 'Auto editado');
        this.router.navigateByUrl('/cars/my-cars');
      });
  }

  deleteCar(): void {
    this.alertCtrl.create({
      header: environment.appName,
      message: '¿Quieres dar de baja este auto?',
      buttons: [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Dar de baja',
        handler: () => {
          this.carService.deleteCar(this.id.value)
            .subscribe(() => {
              this.router.navigateByUrl('/cars/my-cars');
            });
        }
      }]
    })
      .then(alertEl => {
        alertEl.present();
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

  private buildCarForm(): void {
    this.carForm = this.formBuilder.group({
      id: ['', Validators.required],
      plateNumber: ['', [Validators.required, argentinaPlateNumberValidator()]],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getUTCFullYear(), Validators.required],
      color: [1, Validators.required]
    });
  }

  private fillYearsDropdown() {
    const now = new Date().getUTCFullYear();
    this.years = Array(now - (now - 25)).fill('').map((v, idx) => now - idx);
  }

  private cleanForm(): void {
    this.plateNumber.setValue('');
    this.make.setValue(this.makes[0].id);
    this.year.setValue(new Date().getUTCFullYear());
    this.color.setValue(1);
  }

  private setFormFromCar(car: Car): void {
    this.id.setValue(car.id);
    this.plateNumber.setValue(car.plateNumber);

    this.make.setValue(car.makeId);
    this.onMakeChange({ detail: { value: car.makeId } });
    this.model.setValue(car.modelId);

    this.year.setValue(car.year + '');
    this.color.setValue(car.color + '');
  }

  get id() {
    return this.carForm.get('id');
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
