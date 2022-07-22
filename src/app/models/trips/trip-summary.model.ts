export class TripSummary {
    id: number;
    origin: string;
    destination: string;
    departure: string;

    constructor(id?: number, origin?: string, destination?: string, departure?: string) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.departure = departure;
    }
}
