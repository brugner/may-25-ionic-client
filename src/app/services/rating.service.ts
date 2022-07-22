import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RatingForCreation } from '../models/ratings/rating-for-creation.model';
import { Rating } from '../models/ratings/rating.model';
import { RatingExistsParams } from '../models/ratings/rating-exists-params.model';
import { ReplyToRating } from '../models/ratings/reply-to-rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {

    constructor(private http: HttpClient) {

    }

    rateUser(rating: RatingForCreation): Observable<Rating> {
        return this.http.post<Rating>('ratings', rating);
    }

    ratingExists(ratingExistsParams: RatingExistsParams): Observable<Rating> {
        return this.http.post<Rating>('ratings/exists', ratingExistsParams);
    }

    replyRating(ratingId: number, reply: ReplyToRating) {
        return this.http.post<Rating>(`ratings/${ratingId}/reply`, reply);
    }
}
