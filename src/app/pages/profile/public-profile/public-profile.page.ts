import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { UserPublicProfile } from 'src/app/models/users/user-public-profile.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { environment } from 'src/environments/environment';
import { UserRatings } from 'src/app/models/ratings/user-ratings.model';
import ProfilePictureHelper from 'src/app/helpers/profile-picture.helper';

@Component({
    selector: 'app-public-profile',
    templateUrl: 'public-profile.page.html'
})
export class PublicProfilePage implements OnInit {

    moment: any = moment;
    profile: UserPublicProfile = new UserPublicProfile();
    starsAsDriver: number;
    starsAsPassenger: string;
    totalRatingsAsDriver: number;
    totalRatingsAsPassenger: number;
    talkIcon: string;
    musicIcon: string;
    smokingIcon: string;
    petsIcon: string;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private router: Router,
        private authService: AuthService) {

    }

    ngOnInit() {
        this.loadPublicProfile();
    }

    doRefresh(event: any): void {
        const userId = this.getUserId();

        this.userService.getPublicProfile(userId, true)
            .subscribe(result => {
                this.setData(result);
                event.target.complete();
            }, () => event.target.complete());
    }

    goToRatings(): void {
        this.router.navigate([`/profile/${this.profile.id}/ratings`]);
    }

    getProfilePicture(picture: string): string {
        return ProfilePictureHelper.getProfilePicture(picture);
    }

    private getUserId(): number {
        const userIdParam = this.route.snapshot.paramMap.get('userId');
        let userId = 0;

        if (userIdParam === 'me') {
            userId = this.authService.user.id;
        } else {
            userId = Number.parseInt(userIdParam, 10);
        }

        return userId;
    }

    private loadPublicProfile() {
        this.loadingService.present();

        const userId = this.getUserId();

        this.userService.getPublicProfile(userId)
            .subscribe(result => {
                this.setData(result);
                this.loadingService.dismiss();
            });
    }

    private setData(result: UserPublicProfile) {
        this.profile = result;
        this.profile.picture = result.picture || environment.defaultProfilePicture;
        this.starsAsDriver = this.getStarsAsDriver(result.ratings);
        this.starsAsPassenger = this.getStarsAsPassenger(result.ratings);
        this.totalRatingsAsDriver = this.getTotalRatingsAsDriver(result.ratings);
        this.totalRatingsAsPassenger = this.getTotalRatingsAsPassenger(result.ratings);
        this.talkIcon = this.getIconFromValue(result.talk);
        this.musicIcon = this.getIconFromValue(result.music);
        this.smokingIcon = this.getIconFromValue(result.smoking);
        this.petsIcon = this.getIconFromValue(result.pets);
    }

    private getStarsAsDriver(ratings: UserRatings): number {
        if (ratings === undefined || ratings === null) {
            return 0;
        }

        return ratings.starsAsDriver;
    }

    private getStarsAsPassenger(ratings: UserRatings): string {
        if (ratings === undefined || ratings === null) {
            return '0';
        }

        return ratings.starsAsPassenger.toFixed(1);
    }

    private getTotalRatingsAsDriver(ratings: UserRatings) {
        if (ratings === undefined || ratings === null) {
            return 0;
        }

        return ratings.ratingsAsDriver.length;
    }

    private getTotalRatingsAsPassenger(ratings: UserRatings) {
        if (ratings === undefined || ratings === null) {
            return 0;
        }

        return ratings.ratingsAsPassenger.length;
    }

    private getIconFromValue(value: number): string {
        let icon = 'heart';

        if (value === 1) {
            icon += '-dislike';
        } else if (value === 5) {
            icon += '-half';
        }

        return icon;
    }
}
