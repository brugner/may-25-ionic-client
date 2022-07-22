import { TripSummary } from 'src/app/models/trips/trip-summary.model';
import { Trip } from 'src/app/models/trips/trip.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TripForCreation } from '../models/trips/trip-for-creation.model';
import { TripsSearchParams } from '../models/trips/trips-search-params.model';
import { MyTrips } from '../models/trips/my-trips.model';
import { CacheService } from 'ionic-cache';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/es';
import GeoHelper from '../helpers/geo.helper';

@Injectable({ providedIn: 'root' })
export class TripService {

    private myTripsSubject: BehaviorSubject<MyTrips> = new BehaviorSubject<MyTrips>(new MyTrips());
    public myTrips$: Observable<MyTrips> = this.myTripsSubject.asObservable();

    moment: any = moment;

    constructor(private http: HttpClient, private cache: CacheService) {
        this.getMyTrips().subscribe();
    }

    getById(tripId: number): Observable<Trip> {
        return this.http.get<Trip>(`trips/${tripId}`);
    }

    search(sp: TripsSearchParams): Observable<TripSummary[]> {
        const url = 'trips/available';
        const req = this.http.get<Trip[]>(url);

        return this.cache.loadFromObservable<Trip[]>(url, req, 'trips')
            .pipe(map((trips) => {

                trips = trips.filter(x => moment(x.departure).isSame(sp.departure, 'day'));

                trips = trips.filter(x =>
                    GeoHelper.arePointsNear(sp.origin.lat, sp.origin.lng, x.origin.lat, x.origin.lng) &&
                    GeoHelper.arePointsNear(sp.destination.lat, sp.destination.lng, x.destination.lat, x.destination.lng));

                return trips.map(x =>
                    new TripSummary(x.id, x.origin.formattedAddress, x.destination.formattedAddress, x.departure));
            }));
    }

    publish(trip: TripForCreation): Observable<any> {
        return this.http.post<Trip>('trips', trip);
    }

    getMyTrips(forceRefresh?: boolean): Observable<MyTrips> {
        const url = 'trips/mine';
        const req = this.http.get<MyTrips>(url);
        const groupKey = 'my-trips';
        const cacheTtl = 60 * 60 * 24;

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(url, req, groupKey, cacheTtl, 'all').pipe(map((myTrips: MyTrips) => {
                this.myTripsSubject.next(myTrips);
                return myTrips;
            }));
        } else {
            return this.cache.loadFromObservable(url, req, groupKey, cacheTtl).pipe(map((myTrips: MyTrips) => {
                this.myTripsSubject.next(myTrips);
                return myTrips;
            }));
        }
    }

    cancelSeat(tripId: number): Observable<any> {
        return this.http.post(`trips/${tripId}/cancel-seat`, null);
    }

    cancelTrip(tripId: number): Observable<any> {
        return this.http.post(`trips/${tripId}/cancel`, null);
    }
}
