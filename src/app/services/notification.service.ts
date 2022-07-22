import { CacheService } from 'ionic-cache';
import { Notification } from '../models/notifications/notification.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private cache: CacheService) {
        this.getAll().subscribe();
    }

    getAll(forceRefresh?: boolean): Observable<Notification[]> {
        const url = 'notifications';
        const req = this.http.get<Notification[]>(url);
        const groupKey = 'notifications';
        const cacheTtl = 60 * 60;

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(url, req, groupKey, cacheTtl, 'all')
                .pipe(map((notifications: Notification[]) => {
                    this.notificationsSubject.next(notifications);
                    return notifications;
                }));
        } else {
            return this.cache.loadFromObservable(url, req, groupKey, cacheTtl)
                .pipe(map((notifications: Notification[]) => {
                    this.notificationsSubject.next(notifications);
                    return notifications;
                }));
        }
    }

    markAsRead(id: number): Observable<any> {
        return this.http.post<any>(`notifications/${id}/read`, null);
    }
}
