import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
// custom validator to check that two fields match
export function MustMatchAsegurado(controlName: string, matchingControlNameSeguId: string, matchingControlNameSeguPlanId: string, matchingControlNamePoliza: string, matchingControlNameAutorization: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControlSeguId = formGroup.controls[matchingControlNameSeguId];
        const matchingControlSeguPlanId = formGroup.controls[matchingControlNameSeguPlanId];
        const matchingControlPoliza = formGroup.controls[matchingControlNamePoliza];
        const matchingControlAutorization = formGroup.controls[matchingControlNameAutorization];

        if (matchingControlSeguId.errors
            && matchingControlSeguPlanId.errors
            && matchingControlPoliza.errors
            && matchingControlAutorization.errors
            && !matchingControlSeguId.errors['MustMatchAsegurado']
            && !matchingControlSeguPlanId.errors['MustMatchAsegurado']
            && !matchingControlPoliza.errors['MustMatchAsegurado']
            && !matchingControlAutorization.errors['MustMatchAsegurado']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value && (!matchingControlSeguId.value)) {
            matchingControlSeguId.setErrors({ mustMatch: true });
        } else {
            matchingControlSeguId.setErrors(null);
        }
        if (control.value && (!matchingControlSeguPlanId.value)) {
            matchingControlSeguPlanId.setErrors({ mustMatch: true });
        } else {
            matchingControlSeguPlanId.setErrors(null);
        }
        if (control.value && (!matchingControlPoliza.value)) {
            matchingControlPoliza.setErrors({ mustMatch: true });
        } else {
            matchingControlPoliza.setErrors(null);
        }
        if (control.value && (!matchingControlAutorization.value)) {
            matchingControlAutorization.setErrors({ mustMatch: true });
        } else {
            matchingControlAutorization.setErrors(null);
        }
    }
}