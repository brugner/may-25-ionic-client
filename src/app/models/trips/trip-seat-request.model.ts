import { UserPublicProfile } from '../users/user-public-profile.model';

export class TripSeatRequest {
    id: number;
    passenger: UserPublicProfile;
}
