import { Rating } from './rating.model';
import { UserPublicProfile } from '../users/user-public-profile.model';

export class UserRatings {
    user: UserPublicProfile;
    ratingsAsDriver: Rating[];
    starsAsDriver: number;
    ratingsAsPassenger: Rating[];
    starsAsPassenger: number;

    constructor() {
        this.user = new UserPublicProfile();
        this.ratingsAsDriver = [];
        this.ratingsAsPassenger = [];
    }
}
