import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'km'
})
export class KmPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return (value / 1000).toFixed(2) + ' km(s)';
    }
}
