import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RatingModule } from 'ng-starrating';
import { AlreadyRatedPage } from './already-rated/already-rated.page';
import { RateUserPage } from './rate-user/rate-user.page';
import { RatingsPageRoutingModule } from './ratings-page-routing.module';
import { ReplyToRatingPage } from './reply-to-rating/reply-to-rating.page';
import { ThankYouForRatingPage } from './thank-you-for-rating/thank-you-for-rating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RatingsPageRoutingModule,
    RatingModule
  ],
  declarations: [
    RateUserPage,
    AlreadyRatedPage,
    ThankYouForRatingPage,
    ReplyToRatingPage
  ],
  providers: [

  ]
})
export class RatingsPageModule {

}
