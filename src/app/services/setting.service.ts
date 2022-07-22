import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../models/settings/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingService {

    constructor(private http: HttpClient, private cache: CacheService) {

    }

    getSettings(forceRefresh?: boolean): Observable<Settings> {
        const url = 'settings';
        const req = this.http.get<Settings>(url);
        const groupKey = 'settings';
        const cacheTtl = 60 * 60 * 24 * 30;

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(url, req, groupKey, cacheTtl, 'all');
        } else {
            return this.cache.loadFromObservable(url, req, groupKey, cacheTtl);
        }
    }
}
