import { UserPublicProfile } from '../users/user-public-profile.model';

export class Rating {
    id: number;
    tripId: number;
    fromUser: UserPublicProfile;
    toUser: UserPublicProfile;
    toUserType: number;
    comment: string;
    reply: string;
    stars: number;
    createdAt: string;
    repliedAt: string;
}
