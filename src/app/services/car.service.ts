import { CacheService } from 'ionic-cache';
import { CarForCreation } from '../models/cars/car-for-creation.model';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from '../models/cars/car.model';
import { CarForUpdate } from '../models/cars/car-for-update.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CarService {

    private carsSubject: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);
    public cars$: Observable<Car[]> = this.carsSubject.asObservable();

    private readonly cacheKey = `cars/user/${this.authService.user.id}`;
    private readonly cacheTtl = 60 * 60 * 24 * 30;

    constructor(private http: HttpClient, private authService: AuthService, private cache: CacheService) {
        this.getMyCars().subscribe();
    }

    getCarById(id: number): Observable<Car> {
        const car = this.carsSubject.value.find(x => x.id === id);

        if (car) {
            return of(car);
        } else {
            return this.http.get<Car>(`cars/${id}`);
        }
    }

    getAll(): Observable<Car[]> {
        return this.http.get<Car[]>('cars');
    }

    getMyCars(forceRefresh?: boolean): Observable<Car[]> {
        const url = `cars/user/${this.authService.user.id}`;
        const req = this.http.get<Car[]>(url);
        const groupKey = 'cars';

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(url, req, groupKey, this.cacheTtl, 'all').pipe(map((cars: Car[]) => {
                this.carsSubject.next(cars);
                return cars;
            }));
        } else {
            return this.cache.loadFromObservable(url, req, groupKey, this.cacheTtl).pipe(map((cars: Car[]) => {
                this.carsSubject.next(cars);
                return cars;
            }));
        }
    }

    createCar(carForCreation: CarForCreation): Observable<Car> {
        return this.http.post<Car>('cars', carForCreation).pipe(map(car => {
            // updates the subject
            const cars = this.carsSubject.value;
            cars.push(car);
            this.carsSubject.next(cars);

            // updates the cache
            this.cache.getItem(this.cacheKey).then((carsCache: Car[]) => {
                carsCache.push(car);
                this.cache.saveItem(this.cacheKey, carsCache);
            });

            return car;
        }));
    }

    updateCar(id: number, carForUpdate: CarForUpdate): Observable<Car> {
        return this.http.put<Car>(`cars/${id}`, carForUpdate).pipe(map((car: Car) => {
            // updates the subject
            const cars = this.carsSubject.value;
            const index = cars.findIndex(x => x.id === id);
            cars.splice(index, 1, car);
            this.carsSubject.next(cars);

            // updates the cache
            this.cache.getItem(this.cacheKey).then((carsCache: Car[]) => {
                const indexCache = carsCache.findIndex(x => x.id === id);
                carsCache.splice(indexCache, 1, car);
                this.cache.saveItem(this.cacheKey, carsCache);
            });

            return car;
        }));
    }

    deleteCar(id: number): Observable<any> {
        return this.http.delete(`cars/${id}`).pipe(map(() => {
            // updates the subject
            const cars = this.carsSubject.value;
            const index = cars.findIndex(x => x.id === id);
            cars.splice(index);
            this.carsSubject.next(cars);

            // updates the cache
            this.cache.getItem(this.cacheKey).then((carsCache: Car[]) => {
                const indexCache = carsCache.findIndex(x => x.id === id);
                carsCache.splice(indexCache);
                this.cache.saveItem(this.cacheKey, carsCache);
            });
        }));
    }
}
