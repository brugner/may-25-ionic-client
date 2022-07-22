import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlreadyRatedPage } from './already-rated/already-rated.page';
import { RateUserPage } from './rate-user/rate-user.page';
import { ReplyToRatingPage } from './reply-to-rating/reply-to-rating.page';
import { ThankYouForRatingPage } from './thank-you-for-rating/thank-you-for-rating.page';

const routes: Routes = [
  {
    path: 'trip/:tripId/rate/driver/:userId',
    component: RateUserPage
  },
  {
    path: 'trip/:tripId/rate/passenger/:userId',
    component: RateUserPage
  },
  {
    path: 'trip/:tripId/already-rated',
    component: AlreadyRatedPage
  },
  {
    path: 'trip/:tripId/thank-you',
    component: ThankYouForRatingPage
  },
  {
    path: 'trip/:tripId/rating/:ratingId/reply',
    component: ReplyToRatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingsPageRoutingModule {

}
