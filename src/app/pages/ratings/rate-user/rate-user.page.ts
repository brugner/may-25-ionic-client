import { ToastService } from './../../../services/toast.service';
import { LoadingService } from './../../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { RatingForCreation } from 'src/app/models/ratings/rating-for-creation.model';
import { RatingService } from 'src/app/services/rating.service';
import { RatingExistsParams } from 'src/app/models/ratings/rating-exists-params.model';
import { Rating } from 'src/app/models/ratings/rating.model';

@Component({
    selector: 'app-rate-user',
    templateUrl: 'rate-user.page.html'
})
export class RateUserPage implements OnInit {

    tripId: number;
    toUserId: number;
    toUserType: number;
    stars: number;

    ratingForm: FormGroup;
    toUserName: string;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private ratingService: RatingService,
        private router: Router,
        private loadingService: LoadingService,
        private toastService: ToastService) {

    }

    ngOnInit() {
        this.buildRatingForm();
        this.tripId = Number.parseInt(this.route.snapshot.paramMap.get('tripId'), 10);
        this.toUserId = Number.parseInt(this.route.snapshot.paramMap.get('userId'), 10);
        this.toUserType = this.getToUserType();
        this.setToUserName();
        this.redirectIfAlreadyRated();
    }

    getToUserType(): number {
        if (this.route.snapshot.url[3].toString() === 'driver') {
            return 0;
        } else if (this.route.snapshot.url[3].toString() === 'passenger') {
            return 1;
        } else {
            throw new Error('Invalid user type');
        }
    }

    rateUser(): void {
        const rating = new RatingForCreation();
        rating.tripId = this.tripId;
        rating.toUserId = this.toUserId;
        rating.toUserType = this.toUserType;
        rating.stars = this.stars;
        rating.comment = this.ratingForm.get('comment').value;

        this.loadingService.present();

        this.ratingService.rateUser(rating)
            .subscribe(() => {
                this.cleanRatingForm();
                this.loadingService.dismiss();
                this.router.navigate([`/ratings/trip/${this.tripId}/thank-you`]);
            }, error => {
                if (error.status === 400) {
                    this.toastService.present('danger', 'Ya calificaste a este usuario por este viaje');
                    this.loadingService.dismiss();
                }
            });
    }

    onStarsChanged($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }) {
        this.stars = $event.newValue;
    }

    getUserTypeName(): string {
        return this.toUserType === 0 ? 'conductor' : 'pasajero';
    }

    private setToUserName(): void {
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                const state = this.router.getCurrentNavigation().extras.state;
                this.toUserName = state.toUser.name;
            }
        });
    }

    private redirectIfAlreadyRated() {
        const ratingExistsParams = new RatingExistsParams();
        ratingExistsParams.tripId = this.tripId;
        ratingExistsParams.toUserId = this.toUserId;

        this.ratingService.ratingExists(ratingExistsParams)
            .subscribe((rating: Rating) => {
                if (rating) {
                    const extras: NavigationExtras = {
                        state: {
                            rating
                        }
                    };

                    this.router.navigate([`/ratings/trip/${this.tripId}/already-rated`], extras);
                }
            });
    }

    private buildRatingForm(): void {
        this.ratingForm = this.formBuilder.group({
            comment: ['', Validators.required]
        });
    }

    private cleanRatingForm(): void {
        this.ratingForm.get('comment').setValue('');
    }
}
