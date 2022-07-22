import { TripSummary } from './trip-summary.model';

export class MyTrips {
    asDriver: TripSummary[];
    asPassenger: TripSummary[];
    asSeatRequester: TripSummary[];

    constructor() {
        this.asDriver = [];
        this.asPassenger = [];
        this.asSeatRequester = [];
    }
}
