import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
import ProfilePictureHelper from 'src/app/helpers/profile-picture.helper';
import { Rating } from 'src/app/models/ratings/rating.model';

@Component({
    selector: 'app-ratings-list',
    templateUrl: 'ratings-list.component.html',
    styleUrls: ['ratings-list.component.scss']
})
export class RatingsListComponent {

    @Input()
    ratings: Rating[] = [];

    moment: any = moment;

    constructor(
        private authService: AuthService,
        private router: Router) {

    }

    getProfilePicture(picture: string): string {
        return ProfilePictureHelper.getProfilePicture(picture);
    }

    replyExists(rating: Rating): boolean {
        return rating.reply !== undefined && rating.reply !== null && rating.reply !== '';
    }

    canReply(rating: Rating): boolean {
        const replyDateLimit = moment(rating.createdAt).add(15, 'day');
        return this.authService.user.id === rating.toUser.id && !this.replyExists(rating) && moment().isBefore(replyDateLimit);
    }

    getRatingTitle(rating: Rating): string {
        switch (rating.stars) {
            case 1:
                return 'Mal';

            case 2:
                return 'Regular';

            case 3:
                return 'Bien';

            case 4:
                return 'Muy bien';

            default:
                return 'Excelente';
        }
    }

    getReplyLabel(rating: Rating): string {
        const replyDateLimit = moment(rating.createdAt).add(15, 'day').format('DD/MM/yyyy');
        return `Puedes responder a este comentario hasta el ${replyDateLimit}`;
    }

    getRepliedTitle(rating: Rating): string {
        const name = rating.toUser.name;
        return this.authService.user.id === rating.toUser.id ? 'Respondiste:' : name + ' respondió:';
    }

    goToReplyRating(rating: Rating): void {
        const extras: NavigationExtras = {
            state: {
                rating
            }
        };

        this.router.navigate([`/ratings/trip/${rating.tripId}/rating/${rating.id}/reply`], extras);
    }
}
