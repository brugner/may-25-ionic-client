import { UserService } from 'src/app/services/user.service';
import { UserRatings } from '../../../models/ratings/user-ratings.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-ratings',
    templateUrl: 'ratings.page.html'
})

export class RatingsPage implements OnInit {

    asDriverVisible = true;
    asPassengerVisible = false;
    asDriverColor = 'primary';
    asPassengerColor = 'default';
    asSeatRequesterColor = 'default';
    ratings: UserRatings = new UserRatings();

    constructor(
        private route: ActivatedRoute,
        private userService: UserService) {

    }

    ngOnInit() {
        const userId = Number.parseInt(this.route.snapshot.paramMap.get('userId'), 10);

        this.userService.getPublicProfile(userId)
            .subscribe((profile) => {
                this.ratings = profile.ratings;
            });
    }

    asDriver(): void {
        this.asDriverVisible = true;
        this.asPassengerVisible = false;

        this.asDriverColor = 'primary';
        this.asPassengerColor = 'default';
        this.asSeatRequesterColor = 'default';
    }

    asPassenger(): void {
        this.asDriverVisible = false;
        this.asPassengerVisible = true;

        this.asDriverColor = 'default';
        this.asPassengerColor = 'primary';
        this.asSeatRequesterColor = 'default';
    }

    doRefresh(event: any): void {
        const userId = Number.parseInt(this.route.snapshot.paramMap.get('userId'), 10);

        this.userService.getPublicProfile(userId, true)
            .subscribe((profile) => {
                this.ratings = profile.ratings;
                event.target.complete();
            }, () => event.target.complete());
    }
}
