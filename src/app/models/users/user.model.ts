import { Car } from '../cars/car.model';

export class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    birthday: string;
    gender: string;
    bio: string;
    talk: number;
    music: number;
    pets: number;
    smoking: number;
    roles: string[] = [];
    cars: Car[] = [];
    isEmailConfirmed: boolean;
}
