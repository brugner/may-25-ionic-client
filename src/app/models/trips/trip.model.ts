import { Place } from '../places/place.model';
import { UserPublicProfile } from '../users/user-public-profile.model';
import { TripSeatRequest } from './trip-seat-request.model';

export class Trip {
    id: number;
    driver: UserPublicProfile;
    originId: number;
    origin: Place;
    destination: Place;
    departure: string;
    maxPassengers: number;
    description: string;
    distance: number;
    duration: number;
    suggestedCost: number;
    cost: number;
    costPerPassenger: number;
    seatRequests: TripSeatRequest[];
    passengers: UserPublicProfile[];

    constructor() {
        this.driver = new UserPublicProfile();
        this.origin = new Place();
        this.destination = new Place();
        this.seatRequests = [];
        this.passengers = [];
    }
}
