import { UserPublicProfile } from '../models/users/user-public-profile.model';
import { User } from '../models/users/user.model';
import { UserForAuth } from '../models/auth/user-for-auth.model';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatedUser } from '../models/users/created-user.model';
import { CacheService } from 'ionic-cache';
import { UserForUpdate } from '../models/users/user-for-update.model';
import { map } from 'rxjs/operators';
import { ChangePasswordParams } from '../models/auth/change-password-params.model';


@Injectable({ providedIn: 'root' })
export class UserService {

    private user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
    public user$: Observable<User> = this.user.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private cache: CacheService) {
        this.getAuthenticatedUser().subscribe();
    }

    createUser(user: UserForAuth): Observable<CreatedUser> {
        return this.http.post<CreatedUser>('users', user);
    }

    getAuthenticatedUser(forceRefresh?: boolean): Observable<User> {
        if (!this.authService.user) {
            return of(new User());
        }

        const cacheKey = `users/${this.authService.user.id}`;
        const cacheGroup = 'users';
        const req = this.http.get<User>(cacheKey);
        const ttl = 60 * 60 * 24 * 30;

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(cacheKey, req, cacheGroup, ttl, 'all').pipe(map((user: User) => {
                this.user.next(user);
                return user;
            }));
        } else {
            return this.cache.loadFromObservable(cacheKey, req, cacheGroup, ttl).pipe(map((user: User) => {
                this.user.next(user);
                return user;
            }));
        }
    }

    updateUser(userForUpdate: UserForUpdate): Observable<User> {
        const cacheKey = `users/${this.authService.user.id}`;
        const cacheGroup = 'users';

        return this.http.put<User>(cacheKey, userForUpdate).pipe(map((user: User) => {

            this.cache.removeItem(cacheKey).then(() => {
                this.cache.saveItem(cacheKey, user, cacheGroup);
            });

            return user;
        }));
    }

    getPublicProfile(userId: number, forceRefresh?: boolean): Observable<UserPublicProfile> {
        const cacheKey = `users/${userId}/public`;
        const cacheGroup = 'users-public-profiles';
        const req = this.http.get<UserPublicProfile>(cacheKey);
        const ttl = 60 * 60 * 24;

        if (forceRefresh) {
            return this.cache.loadFromDelayedObservable(cacheKey, req, cacheGroup, ttl, 'all');
        } else {
            return this.cache.loadFromObservable(cacheKey, req, cacheGroup, ttl);
        }
    }

    changePassword(changePasswordParams: ChangePasswordParams): Observable<any> {
        return this.http.post('users/change-password', changePasswordParams);
    }

    resetPassword(email: string): Observable<any> {
        return this.http.post(`users/request-password-reset?email=${email}`, null);
    }
}
