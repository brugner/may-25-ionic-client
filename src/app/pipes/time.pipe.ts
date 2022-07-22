import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({
    name: 'time'
})
export class TimePipe implements PipeTransform {

    moment: any = moment;

    transform(value: any, ...args: any[]): any {

        if (value === undefined) {
            return '0 horas 0 mins';
        }

        const time = new Date(value * 1000).toISOString();
        const h = Number.parseInt(time.substr(11, 2), 10);
        const m = Number.parseInt(time.substr(14, 2), 10);

        return h + ' hora(s) ' + m + ' mins';
    }
}
