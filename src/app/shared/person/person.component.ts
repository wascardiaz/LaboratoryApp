import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, first, map, Observable, of, Subscription } from 'rxjs';
// import { Gender } from '../models/gender.model';
import { CivilState, Person, PersonDocuType, PersonGender, Profession } from '../models/person.model';
import { LoadingService } from '../services/loading.service';
import { RepositoryService } from '../services/repository.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  message: any = null;
  personForm!: FormGroup;
  submitted = false;
  userFormSubscription!: Subscription;
  // genders = Gender;

  personDocuTypeSource: PersonDocuType[] | undefined;
  personGenderSouruce: PersonGender[] | undefined;
  personProfessions: Profession[] | undefined;
  civilStateSource: CivilState[] | undefined;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PersonComponent>,
    public loadingService: LoadingService,
    private repository: RepositoryService) { }

  ngOnInit(): void {
    this.getPersonDocumentType();
    this.getPersonGender();
    this.getProfessions();
    this.getCivilStates();
    this.initForm();    
    this.populateFormFields(this.data)
    // if (this.route.snapshot.params['id'])
    //   this.adminEdit(this.route.snapshot.params['id'])
    // else
    //   this.fetchUserDataFromServer();
    // this.repository.getData(`people/${this.data.personId}`).pipe(first()).subscribe(res => {
    //   res.address = res.addresses ? res.addresses[0] : {};
    //   this.populateFormFields(res);
    // });
  }

  getPersonDocumentType() { this.repository.getData('person-document-types').pipe().subscribe((lst: PersonDocuType[]) => { this.personDocuTypeSource = lst; }); }
  getPersonGender() { this.repository.getData('person-gender').pipe().subscribe((lst: PersonGender[]) => { this.personGenderSouruce = lst; }); }
  getProfessions() { this.repository.getData('professions').pipe().subscribe((lst: PersonGender[]) => { this.personProfessions = lst; }); }
  getCivilStates() { this.repository.getData('civil-states').pipe().subscribe((lst: CivilState[]) => { this.civilStateSource = lst; }); }

  initForm() {
    this.personForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      // gender: new FormControl('', [Validators.required]),
      documentTypeId: new FormControl(''),
      document: new FormControl(''),
      nickname: new FormControl(''),
      genderId: new FormControl(''),
      professionId: new FormControl(''),
      civilStateId: new FormControl(''),
      foto: new FormControl(''),
      userId: new FormControl(''),
      phoneNo: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      address: new FormGroup({
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
        ]),
      })
    });
  }

  get fp() { return this.personForm.controls }
  get fpa() { return (<FormGroup>this.fp['address']).controls }

  populateFormFields(personDetails: Person) {
    this.personForm.patchValue({
      id: personDetails.id,
      firstName: personDetails.firstName,
      lastName: personDetails.lastName,
      gender: personDetails.gender,
      documentTypeId: personDetails.documentTypeId,
      document: personDetails.document,
      nickname: personDetails.nickname,
      genderId: personDetails.genderId,
      professionId: personDetails.professionId,
      civilStateId: personDetails.civilStateId,
      foto: personDetails.foto,
      userId: personDetails.userId,
      phoneNo: personDetails.phoneNo,
      dateOfBirth: personDetails.dateOfBirth,
      email: personDetails.email,
      address: {
        id: personDetails.address?.id,
        state: personDetails.address?.state,
        area: personDetails.address?.area,
        city: personDetails.address?.city,
        pincode: personDetails.address?.pincode,
      }
    });
  }

  onDocuTypeSectedChange(event: any) {
    // if (this.personForm.value.document !== '')
    this.onEnterDocument(this.personForm.value.document)
  }

  onEnterDocument(eValue: any) {
    if (/(\W|^)[0-9]{3}\-[0-9]{7}\-[0-9]{1}(\W|$)/.test(eValue) || /(\W|^)[0-9]{11}(\W|$)/.test(eValue)) {
      this.getFilterData(parseInt((this.personForm.value.documentTypeId), 10), eValue).pipe(first(),
        map(data => {
          console.log(data)
          // this.loading = false;
          if (data === null) {
            return null;
          }
          return data;
        })).subscribe((people: Person[]) => {
          if (people.length) {
            const person = people[0];
            person.address = person.addresses ? person.addresses[0] : {};
            this.personForm.patchValue(person);
          } else this.resetFormFields();
        });
    }
    else {
      this.resetFormFields();
    }

  }

  getFilterData(docuTypeId: number, param: any): Observable<any> {
    return this.repository.getData(`people/?documentTypeId=${docuTypeId}&document=${param}`).pipe(catchError(() => of(null)));
  }

  resetFormFields() {
    const dType = this.personForm.value.documentTypeId;
    const dDocument = this.personForm.value.document;
    this.personForm?.reset();
    this.personForm.get('documentTypeId')?.setValue(dType);
    this.personForm.get('document')?.setValue(dDocument);
  }

  ngOnDestroy(): void {
    if (this.userFormSubscription) this.userFormSubscription.unsubscribe();
  }

  OnSubmit() {
    this.dialogRef.close(this.personForm.getRawValue());
  }
}
