import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { catchError, first, map, Observable, of } from 'rxjs';
import { CivilState, Person, PersonDocuType, PersonGender, Profession } from 'src/app/shared/models/person.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {
  @Input() person: FormGroup | undefined;
  @Output() personFormEvent = new EventEmitter<FormGroup>();

  personForm!: FormGroup;

  personDocuTypeSource: PersonDocuType[] | undefined;
  personGenderSouruce: PersonGender[] | undefined;
  personProfessions: Profession[] | undefined;
  civilStateSource: CivilState[] | undefined;

  lineThrough = '';

  get fp() { return this.personForm.controls }

  constructor(private fb: FormBuilder, private authService: AuthService, private repositoryService: RepositoryService) {
    this.personForm = this.fb.group({
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
    });

    if (this.person)
      this.personForm.patchValue(this.person);
  }

  ngOnInit(): void {
    this.getPersonDocumentType();
    this.getPersonGender();
    this.getProfessions();
    this.getCivilStates();
  }

  addNewItem() {
    this.personFormEvent.emit(this.personForm.getRawValue());
    this.lineThrough = this.lineThrough ? '' : 'line-through';
  }

  getPersonDocumentType() { this.repositoryService.getData('person-document-types').pipe().subscribe((lst: PersonDocuType[]) => { this.personDocuTypeSource = lst; }); }
  getPersonGender() { this.repositoryService.getData('person-gender').pipe().subscribe((lst: PersonGender[]) => { this.personGenderSouruce = lst; }); }
  getProfessions() { this.repositoryService.getData('professions').pipe().subscribe((lst: Profession[]) => { this.personProfessions = lst; }); }
  getCivilStates() { this.repositoryService.getData('civil-states').pipe().subscribe((lst: CivilState[]) => { this.civilStateSource = lst; }); }

  onDocuTypeSectedChange(event: any) {
    // if (this.personForm.value.document !== '')
    this.onEnterDocument(this.personForm.value.document)
  }

  onEnterDocument(eValue: any) {
    if (/(\W|^)[0-9]{3}\-[0-9]{7}\-[0-9]{1}(\W|$)/.test(eValue) || /(\W|^)[0-9]{11}(\W|$)/.test(eValue)) {
      this.getFilterData(parseInt((this.personForm.value.documentTypeId), 10), eValue).pipe(first(),
        map(data => {
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
    return this.repositoryService.getData(`people/?documentTypeId=${docuTypeId}&document=${param}`).pipe(catchError(() => of(null)));
  }

  resetFormFields() {
    const dType = this.personForm.value.documentTypeId;
    const dDocument = this.personForm.value.document;
    this.personForm?.reset();
    this.personForm.get('documentTypeId')?.setValue(dType);
    this.personForm.get('document')?.setValue(dDocument);
  }

}
