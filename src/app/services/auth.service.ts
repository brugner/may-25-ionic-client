import { Settings } from './../models/settings/settings.model';
import { Trip } from 'src/app/models/trips/trip.model';
import { CacheService } from 'ionic-cache';
import { UserForAuth } from '../models/auth/user-for-auth.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResult } from '../models/auth/auth-result.model';
import { Car } from '../models/cars/car.model';
import { User } from '../models/users/user.model';
import { UserSeatRequest } from '../models/trips/user-seat-request.model';
import { MyTrips } from '../models/trips/my-trips.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private userSubject: BehaviorSubject<AuthResult>;
    public user$: Observable<AuthResult>;

    constructor(private http: HttpClient, private cache: CacheService) {
        this.userSubject = new BehaviorSubject<AuthResult>(JSON.parse(localStorage.getItem('user')));
        this.user$ = this.userSubject.asObservable();
    }

    public get user(): AuthResult {
        return this.userSubject.value;
    }

    login(userForAuth: UserForAuth): Observable<AuthResult> {
        return this.http.post<AuthResult>('auth/user', userForAuth)
            .pipe(map(result => {
                localStorage.setItem('user', JSON.stringify(result));
                this.userSubject.next(result);
                this.loadCache();

                return result;
            }));
    }

    logout(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.cache.clearAll();
    }

    googleLogin(token: string): Observable<AuthResult> {
        return this.http.post<AuthResult>(`auth/user/google?token=${token}`, null)
            .pipe(map(result => {
                localStorage.setItem('user', JSON.stringify(result));
                this.userSubject.next(result);
                this.loadCache();

                return result;
            }));
    }

    private loadCache() {
        this.loadSettingsCache();
        this.loadUserProfileCache();
        this.loadUserCarsCache();
        this.loadUserSentSeatRequestsCache();
        this.loadUserTripsCache();
        this.loadAvailableTripsCache();
    }

    private loadSettingsCache(): void {
        const url = 'settings';
        const req = this.http.get<Settings>(url);
        const group = 'settings';
        const ttl = 60 * 60 * 24 * 7;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }

    private loadUserProfileCache(): void {
        const url = `users/${this.user.id}`;
        const req = this.http.get<User>(url);
        const group = 'user';
        const ttl = 60 * 60 * 24 * 30;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }

    private loadUserCarsCache(): void {
        const url = `cars/user/${this.user.id}`;
        const req = this.http.get<Car[]>(url);
        const group = 'cars';
        const ttl = 60 * 60 * 24 * 30;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }

    private loadUserSentSeatRequestsCache(): void {
        const url = 'seatrequests/mine';
        const req = this.http.get<UserSeatRequest[]>(url);
        const group = 'seatrequest';
        const ttl = 60 * 60 * 24 * 30;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }

    private loadUserTripsCache(): void {
        const url = 'trips/mine';
        const req = this.http.get<MyTrips>(url);
        const group = 'my-trips';
        const ttl = 60 * 60 * 24 * 30;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }

    private loadAvailableTripsCache(): void {
        const url = 'trips/available';
        const req = this.http.get<Trip>(url);
        const group = 'trips';
        const ttl = 60 * 60 * 4;

        this.cache.loadFromObservable(url, req, group, ttl).subscribe();
    }
}
