import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, first, map, Observable, of, pipe } from 'rxjs';
import { Patient } from 'src/app/shared/models/patient.model';
import { CivilState, Person, PersonDocuType, PersonGender, Profession } from 'src/app/shared/models/person.model';
import { Supplier } from 'src/app/shared/models/supplier.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.scss']
})
export class PatientAddComponent implements OnInit {
  frmPatient!: FormGroup;
  isValid: boolean = true;
  fromPage!: any;
  submitted = false;
  isAddMode: boolean = true;
  id: number | null = null;

  personDocuTypeSource: PersonDocuType[] | undefined;
  personGenderSouruce: PersonGender[] | undefined;
  personProfessions: Profession[] | undefined;
  civilStateSource: CivilState[] | undefined;

  seguroSource: any[] | undefined;
  seguroPlanesSource: any[] | undefined;

  patientTypeSource: any[] | undefined;

  medicoSource: any[] | undefined;

  hosCaseOriginSource: any[] | undefined;

  get f() { return this.frmPatient.controls }
  get fp() { return (<FormGroup>this.f['person']).controls }
  get person() { return <FormGroup>this.f['person'] }
  get fpa() { return (<FormGroup>this.fp['address']).controls }

  get seguros(): FormArray {
    return <FormArray>this.f['seguros'];
  }

  constructor(
    public dialogRef: MatDialogRef<PatientAddComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any,
    private repositoryService: RepositoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {
    this.fromPage = { ...mydata };
    this.id = mydata.id || null;
    this.isAddMode = !mydata.id;
  }

  ngOnInit(): void {
    this.frmPatient = this.fb.group({
      id: [null],
      personId: [null],
      patientType: [null],
      medicoId: [null],
      sangreId: [null],
      fallecido: [null],
      motivo_fellecio: [null],
      fecha_fellecido: [null],
      observacion: [null],
      peso: [null],
      patientTypeId: [null],
      nss: [null],
      antecedentes_familiares: [null],
      web_usuario: [null],
      web_clave: [null],
      vip: [null],
      vip_mensaje: [null],
      no_grato: [null],
      nograto_mensaje: [null],
      tarjeta: [null],
      gestion_cobro: [null],
      person: this.fb.group({
        id: [null],
        lastName: [null, [Validators.required, Validators.maxLength(64)]],
        firstName: [null, [Validators.required, Validators.maxLength(64)]],
        nickname: [null],
        razaId: [null],
        paisId: [null],
        professionId: [null],
        dateOfBirth: [null, [Validators.required]],
        foto: [null],
        document: [null],
        email: [null],
        created: [null],
        updated: [null],
        userId: [this.authService.userValue?.id],
        status: [null],
        documentTypeId: [null],
        genderId: [null, [Validators.required]],
        civilStateId: [null],
        phoneNo: [null],
        address: this.fb.group({
          id: new FormControl(''),
          state: new FormControl('', [
            // Validators.required,
            // Validators.minLength(4),
            // Validators.maxLength(30),
          ]),
          area: new FormControl('', [
            // Validators.required,
            // Validators.minLength(4),
            // Validators.maxLength(30),
          ]),
          city: new FormControl('', [
            // Validators.required,
            // Validators.minLength(4),
            // Validators.maxLength(30),
          ]),
          pincode: new FormControl('', [
            // Validators.required,
            // Validators.pattern('[0-9]{6}'),
          ])
        }),
      }),
      seguros: this.fb.array([]),
      userId: [this.authService.userValue?.id],
      status: [null],
      created: [null],
      updated: [null]
    });

    this.getPersonDocumentType();
    this.getPersonGender();
    this.getProfessions();
    this.getCivilStates();

    this.getSeguros();
    this.getSeguroPlanes();

    this.getPatientTypes();

    this.getMedicos();

    this.getHosCaseOrigin();

    if (!this.isAddMode && this.id && this.id > 0) {
      this.repositoryService.getData(`patients/${this.id}`).subscribe((res: any) => {
        if (res.personId) {
          this.repositoryService.getData(`people/${res.personId}`).subscribe((per: Person) => {
            res.person.address = res.person.addresses ? res.person.addresses[0] : {};
            res.person = per;
            this.frmPatient.patchValue(res);
          })
        }
        else
          this.frmPatient.patchValue(res);
      })
    }
  }

  setVal(val: any) {
    this.person.patchValue(val);
  }

  getPersonDocumentType() { this.repositoryService.getData('person-document-types').pipe().subscribe((lst: PersonDocuType[]) => { this.personDocuTypeSource = lst; }); }
  getPersonGender() { this.repositoryService.getData('person-gender').pipe().subscribe((lst: PersonGender[]) => { this.personGenderSouruce = lst; }); }
  getProfessions() { this.repositoryService.getData('professions').pipe().subscribe((lst: Profession[]) => { this.personProfessions = lst; }); }
  getCivilStates() { this.repositoryService.getData('civil-states').pipe().subscribe((lst: CivilState[]) => { this.civilStateSource = lst; }); }

  getSeguros() { this.repositoryService.getData('seguros').pipe().subscribe((lst: any[]) => { this.seguroSource = lst; }); }
  getSeguroPlanes() { this.repositoryService.getData('seguro-planes').pipe().subscribe((lst: any[]) => { this.seguroPlanesSource = lst; }); }

  getPatientTypes() { this.repositoryService.getData('patient-types').pipe().subscribe((lst: any[]) => { this.patientTypeSource = lst; }); }

  getMedicos() { this.repositoryService.getData('medics').pipe().subscribe((lst: any[]) => { this.medicoSource = lst; }); }

  getHosCaseOrigin() { this.repositoryService.getData('hos-case-origin').pipe().subscribe((lst: any[]) => { /* console.log(lst); */ this.hosCaseOriginSource = lst; }); }

  removeSeguFromPatient(index: number) {
    const c: any = this.seguros.at(index);
    // this.patientSegs = this.patientSegs.filter(s => s.seguId = c.value.seguId);
    this.seguros.removeAt(index);

  }

  loadTest(element: any) {
    this.dialogRef.close(element as Supplier);
  }

  onDocuTypeSectedChange(event: any) {
    // if (this.personForm.value.document !== '')
    this.onEnterDocument(this.fp['document'].value)
  }

  onEnterDocument(eValue: any) {
    if (/(\W|^)[0-9]{3}\-[0-9]{7}\-[0-9]{1}(\W|$)/.test(eValue) || /(\W|^)[0-9]{11}(\W|$)/.test(eValue)) {
      this.getFilterData(parseInt((this.fp['documentTypeId'].value), 10), eValue).pipe(first(),
        map(data => {
          if (data === null) {
            return null;
          }
          return data;
        })).subscribe((people: Person[]) => {
          if (people.length) {
            const person = people[0];
            person.address = person.addresses ? person.addresses[0] : {};
            this.f['person'].patchValue(person);
            this.repositoryService.getData(`patients/person/${person.id}`).subscribe((res: any) => {
              if (res) {
                res.person = person;
                this.frmPatient.patchValue(res);
                this.id = res.id;
                this.isAddMode = false;
              }
            })
          } else this.resetFormFields();
        });
    }
    else {
      this.resetFormFields();
    }

  }

  getFilterData(docuTypeId: number, param: any): Observable<any> {
    return this.repositoryService.getData(`people/?documentTypeId=${docuTypeId}&document=${param}`).pipe(catchError(() => of(null)));
  }

  resetFormFields() {
    const dType = this.fp['documentTypeId'].value;
    const dDocument = this.fp['document'].value;
    this.f['person'].reset();
    this.fp['documentTypeId']?.setValue(dType);
    this.fp['document']?.setValue(dDocument);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.frmPatient.invalid) {
      return;
    }

    this.loadingService.enableLoading();
    if (this.isAddMode) {
      this.createPatient();
    } else {
      this.updatePatient();
    }
  }

  private createPatient() {
    this.repositoryService.create('patients', this.frmPatient.getRawValue())
      .pipe(first())
      .subscribe({
        next: () => {
          // let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

          // dialogRef.afterClosed()
          //   .subscribe(result => {
          //     this.location.back();
          //   });
          this.loadingService.disableLoading;
          this.dialogRef.close(true);
        },
        error: error => {
          // this.errorService.handleError(error);
          this.loadingService.disableLoading;
        }
      });
  }

  private updatePatient() {
    this.repositoryService.update(`patients/${this.id}`, this.frmPatient.getRawValue())
      .pipe(first())
      .subscribe({
        next: () => {
          // let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

          // dialogRef.afterClosed()
          //   .subscribe(result => {
          //     this.location.back();
          //   });
          this.loadingService.disableLoading;
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          // this.errorService.handleError(error);
          this.loadingService.disableLoading();
        }
      });
  }

}
