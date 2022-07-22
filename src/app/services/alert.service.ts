import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Alert } from '../models/alerts/alert.model';
import { AuthService } from './auth.service';
import { CacheService } from 'ionic-cache';
import { map } from 'rxjs/operators';
import { AlertForCreation } from '../models/alerts/alert-for-creation.model';

@Injectable({ providedIn: 'root' })
export class AlertService {

    private alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);
    public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();

    private readonly cacheKey = 'alerts';
    private readonly cacheTtl = 60 * 60 * 24 * 7;

    constructor(private http: HttpClient, private authService: AuthService, private cache: CacheService) {
        this.getAll().subscribe();
    }

    getAll(forceRefresh?: boolean): Observable<Alert[]> {
        const url = 'alerts';
        const req = this.http.get<Alert[]>(url);
        const groupKey = 'alerts';

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(url, req, groupKey, this.cacheTtl, 'all').pipe(map((alerts: Alert[]) => {
                this.alertsSubject.next(alerts);
                return alerts;
            }));
        } else {
            return this.cache.loadFromObservable(url, req, groupKey, this.cacheTtl).pipe(map((alerts: Alert[]) => {
                this.alertsSubject.next(alerts);
                return alerts;
            }));
        }
    }

    getById(id: number): Observable<Alert> {
        const alert = this.alertsSubject.value.find(x => x.id === id);

        if (alert) {
            return of(alert);
        } else {
            return this.http.get<Alert>(`alerts/${id}`);
        }
    }

    create(alertForCreation: AlertForCreation): Observable<Alert> {
        return this.http.post<Alert>('alerts', alertForCreation).pipe(map(alert => {
            // updates the subject
            const cars = this.alertsSubject.value;
            cars.push(alert);
            this.alertsSubject.next(cars);

            // updates the cache
            this.cache.getItem(this.cacheKey).then((alerts: Alert[]) => {
                alerts.push(alert);
                this.cache.saveItem(this.cacheKey, alerts);
            });

            return alert;
        }));
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`alerts/${id}`).pipe(map(() => {
            // updates the subject
            const alerts = this.alertsSubject.value;
            const index = alerts.findIndex(x => x.id === id);
            alerts.splice(index);
            this.alertsSubject.next(alerts);

            // updates the cache
            this.cache.getItem(this.cacheKey).then((alertsCache: Alert[]) => {
                const indexCache = alertsCache.findIndex(x => x.id === id);
                alertsCache.splice(indexCache);
                this.cache.saveItem(this.cacheKey, alertsCache);
            });
        }));
    }
}
