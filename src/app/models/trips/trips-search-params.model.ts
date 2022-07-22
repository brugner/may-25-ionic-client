import { TripsSearchParamsPlace } from './trips-search-params-place.model';

export class TripsSearchParams {
    origin: TripsSearchParamsPlace;
    destination: TripsSearchParamsPlace;
    departure: string;

    constructor() {
        this.origin = new TripsSearchParamsPlace();
        this.destination = new TripsSearchParamsPlace();
    }
}
