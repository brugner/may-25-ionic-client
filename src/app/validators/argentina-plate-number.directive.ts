import { ValidatorFn, AbstractControl } from '@angular/forms';

export function argentinaPlateNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const oldFormat = /[A-Za-z]{3}[\d]{3}/;
        const newFormat = /[A-Za-z]{2}[\d]{3}[A-Za-z]{2}/;

        const isOld = oldFormat.test(control.value);
        const isNew = newFormat.test(control.value);
        const isValid = isOld || isNew;

        return isValid ? null : { argentinaPlateNumber: { value: control.value } };
    };
}
