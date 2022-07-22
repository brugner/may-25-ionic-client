import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSeatRequest } from '../models/trips/user-seat-request.model';

@Injectable({ providedIn: 'root' })
export class SeatRequestService {

    constructor(private http: HttpClient) {

    }

    sendSeatRequest(tripId: number): Observable<any> {
        return this.http.post(`seatrequests/trip/${tripId}/send`, null);
    }

    cancelSeatRequest(tripId: number): Observable<any> {
        return this.http.post(`seatrequests/trip/${tripId}/cancel`, null);
    }

    acceptRequest(tripId: number, passengerId: number): Observable<any> {
        return this.http.post(`seatrequests/trip/${tripId}/passenger/${passengerId}/accept`, null);
    }

    rejectRequest(tripId: number, passengerId: number): Observable<any> {
        return this.http.post(`seatrequests/trip/${tripId}/passenger/${passengerId}/reject`, null);
    }

    getMySeatRequests(): Observable<UserSeatRequest[]> {
        return this.http.get<UserSeatRequest[]>('seatrequests/mine');
    }
}
