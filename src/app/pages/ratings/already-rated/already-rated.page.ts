import { Rating } from './../../../models/ratings/rating.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-already-rated',
    templateUrl: 'already-rated.page.html',
    styleUrls: ['already-rated.page.scss']
})
export class AlreadyRatedPage implements OnInit {

    rating: Rating = new Rating();

    constructor(
        private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                const state = this.router.getCurrentNavigation().extras.state;
                this.rating = state.rating;
            }
        });
    }

    goToTripInfo(): void {
        this.router.navigate([`/trips/${this.rating.tripId}/info`]);
    }
}
