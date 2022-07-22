import { TripSummary } from './../../../models/trips/trip-summary.model';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
    selector: 'app-trip-list',
    templateUrl: 'trip-list.component.html',
    styleUrls: ['trip-list.component.scss']
})
export class TripListComponent {

    @Input()
    trips: TripSummary[] = [];

    moment: any = moment;

    constructor() {

    }
}
