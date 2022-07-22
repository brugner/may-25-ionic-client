import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-thank-you-for-rating',
    templateUrl: 'thank-you-for-rating.page.html'
})
export class ThankYouForRatingPage implements OnInit {

    tripId: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        this.tripId = Number.parseInt(this.route.snapshot.paramMap.get('tripId'), 10);
    }

    goToTripInfo(): void {
        this.router.navigate([`/trips/${this.tripId}/info`]);
    }
}
