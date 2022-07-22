import { PlaceForCreation } from '../places/place-for-creation.model';

export class TripForCreation {
    carId: number;
    origin: PlaceForCreation;
    destination: PlaceForCreation;
    departure: string;
    maxPassengers: number;
    description: string;
    distance: number;
    duration: number;
    suggestedCost: number;
    cost: number;
    costPerPassenger: number;
}
