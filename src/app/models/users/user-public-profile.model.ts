import { UserRatings } from '../ratings/user-ratings.model';

export class UserPublicProfile {
    id: number;
    name: string;
    bio: string;
    picture: string;
    birthday: string;
    talk: number;
    music: number;
    pets: number;
    smoking: number;
    ratings: UserRatings;
}
