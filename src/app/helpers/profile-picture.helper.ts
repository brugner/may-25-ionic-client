import { environment } from 'src/environments/environment';

export default class ProfilePictureHelper {

    public static getProfilePicture(picture: string): string {
        if (picture !== undefined && picture !== null && picture.length > 0) {
            return picture;
        } else {
            return environment.defaultProfilePicture;
        }
    }
}
