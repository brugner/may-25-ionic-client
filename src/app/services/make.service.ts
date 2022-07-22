import { CacheService } from 'ionic-cache';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Make } from '../models/cars/make.model';

@Injectable({ providedIn: 'root' })
export class MakeService {

    constructor(private http: HttpClient, private cache: CacheService) {

    }

    getAll(): Observable<Make[]> {
        const url = 'makes';
        const req = this.http.get<Make[]>(url);
        const groupKey = 'makes';
        const month = 60 * 60 * 24 * 30;

        return this.cache.loadFromObservable(url, req, groupKey, month);
    }
}
