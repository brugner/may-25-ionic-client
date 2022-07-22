import { AuthService } from './../../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from './../../../services/toast.service';
import { LoadingService } from './../../../services/loading.service';
import { ReplyToRating } from './../../../models/ratings/reply-to-rating.model';
import { Component, OnInit } from '@angular/core';
import { Rating } from 'src/app/models/ratings/rating.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingService } from 'src/app/services/rating.service';
import { CacheService } from 'ionic-cache';

@Component({
    selector: 'app-reply-to-rating',
    templateUrl: 'reply-to-rating.page.html',
    styleUrls: ['reply-to-rating.page.scss']
})
export class ReplyToRatingPage implements OnInit {

    moment: any = moment;
    rating: Rating;
    replyForm: FormGroup;

    constructor(
        private ratingService: RatingService,
        private formBuilder: FormBuilder,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthService) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                const state = this.router.getCurrentNavigation().extras.state;
                this.rating = state.rating;
            }
        });

        this.buildReplyForm();
    }

    getReplyLimitDate(): string {
        return moment(this.rating.createdAt).add(15, 'day').format('DD/MM/yyyy');
    }

    replyRating(): void {
        this.loadingService.present();

        const reply = new ReplyToRating(this.replyForm.get('reply').value);

        this.ratingService.replyRating(this.rating.id, reply)
            .subscribe(() => {
                this.loadingService.dismiss();
                this.cleanReplyForm();
                this.toastService.present('success', 'Respondiste a la calificación!');
                this.userService.getPublicProfile(this.authService.user.id, true).subscribe();
                this.router.navigate(['/profile/me']);
            });
    }

    private buildReplyForm(): void {
        this.replyForm = this.formBuilder.group({
            reply: ['', Validators.required]
        });
    }

    private cleanReplyForm(): void {
        this.replyForm.get('reply').setValue('');
    }
}
