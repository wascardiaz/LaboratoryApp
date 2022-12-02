import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subscription } from 'rxjs';
import { Gender } from 'src/app/shared/models/gender.model';
import { CivilState, PersonDocuType, PersonGender, Profession } from 'src/app/shared/models/person.model';
import { UserDetailsEdit } from 'src/app/shared/models/user-detail-edit.model';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { PersonComponent } from 'src/app/shared/person/person.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  message: any = null;
  userForm!: FormGroup;
  submitted = false;
  userFormSubscription!: Subscription;
  genders = Gender;

  personDocuTypeSource: PersonDocuType[] | undefined;
  personGenderSouruce: PersonGender[] | undefined;
  personProfessions: Profession[] | undefined;
  civilStateSource: CivilState[] | undefined;

  constructor(
    private userService: RepositoryService,
    public loadingService: LoadingService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private repository: RepositoryService
  ) { }

  getPersonDocumentType() { this.repository.getData('person-document-types').pipe().subscribe((lst: PersonDocuType[]) => { this.personDocuTypeSource = lst; }); }
  getPersonGender() { this.repository.getData('person-gender').pipe().subscribe((lst: PersonGender[]) => { this.personGenderSouruce = lst; }); }
  getProfessions() { this.repository.getData('professions').pipe().subscribe((lst: PersonGender[]) => { this.personProfessions = lst; }); }
  getCivilStates() { this.repository.getData('civil-states').pipe().subscribe((lst: CivilState[]) => { this.civilStateSource = lst; }); }

  fetchUserDataFromServer() {
    this.loadingService.enableLoading();
    this.userService
      .getData('users/' + this.authService.fetchFromSessionStorage()?.id)
      .subscribe((res) => {
        this.loadingService.disableLoading();
        this.populateFormFields(res);
        if (res.personId > 0)
          this.loadPersonlInfo(res);
      });
  }

  submitForm() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.updateUser(this.userForm.getRawValue());
    }
  }

  initForm() {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      email: new FormControl(''),
      designation: new FormControl('', [Validators.required]),
      securityQuestion: new FormControl('', [Validators.required]),
      securityAnswer: new FormControl('', [Validators.required]),
      person: new FormGroup({
        id: new FormControl(''),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        genderId: new FormControl('', [Validators.required]),
        documentTypeId: new FormControl(''),
        document: new FormControl(''),
        nickname: new FormControl(''),
        // gender: new FormControl(''),
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
      })
    });
  }

  get f() { return this.userForm.controls }
  get fp() { return (<FormGroup>this.f['person']).controls }
  get fpa() { return (<FormGroup>this.fp['address']).controls }

  populateFormFields(userDetails: UserDetailsEdit) {
    this.userForm.patchValue({
      id: userDetails.id,
      email: userDetails.email,
      designation: userDetails.designation,
      securityQuestion: userDetails.securityQuestion,
      securityAnswer: userDetails.securityAnswer,
      person: {
        id: userDetails.person?.id,
        firstName: userDetails.person?.firstName,
        lastName: userDetails.person?.lastName,
        gender: userDetails.person?.gender,
        documentTypeId: userDetails.person?.documentTypeId,
        document: userDetails.person?.document,
        nickname: userDetails.person?.nickname,
        genderId: userDetails.person?.genderId,
        professionId: userDetails.person?.professionId,
        civilStateId: userDetails.person?.civilStateId,
        foto: userDetails.person?.foto,
        userId: userDetails.person?.userId,
        phoneNo: userDetails.person?.phoneNo,
        dateOfBirth: userDetails.person?.dateOfBirth,
        email: userDetails.person?.email,
        address: {
          id: userDetails.person?.address?.id,
          state: userDetails.person?.address?.state,
          area: userDetails.person?.address?.area,
          city: userDetails.person?.address?.city,
          pincode: userDetails.person?.address?.pincode,
        }
      },
    });
  }

  updateUser(formData: any) {
    this.userService.update(`users/profile/${parseInt(formData.id)}`, formData).subscribe(
      (response: any) => {
        this.router.navigate(['/dashboard']);
        this.loadingService.disableLoading();
        this.message =
          'Successfully Created user with ID ' + response['id'];
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard/users');
        }, 3000);
      },
      (error: any) => {
        this.loadingService.disableLoading();
        if (error.error.message === 'FieldException')
          error.error.errors.forEach((element: any) =>
            this.userForm.controls[element.field]?.setErrors({
              serverValidationError: element.message,
            })
          );
        else throw new Error(error);
      }
    );
  }

  ngOnInit(): void {
    this.getPersonDocumentType();
    this.getPersonGender();
    this.getProfessions();
    this.getCivilStates();
    this.initForm();
    if (this.route.snapshot.params['id'])
      this.adminEdit(this.route.snapshot.params['id'])
    else
      this.fetchUserDataFromServer();
  }

  adminEdit(id: number) {
    this.loadingService.enableLoading();
    this.userService
      .getData('users/' + id)
      .subscribe((res: any) => {
        this.loadingService.disableLoading();
        this.populateFormFields(res);
        if (res.personId > 0)
          this.loadPersonlInfo(res);
      });
  }

  loadPersonlInfo(user: any) {
    this.repository.getData(`people/${user.personId}`).pipe(first()).subscribe(res => {
      user.person = res;
      user.person.address = res.addresses ? res.addresses[0] : null;
      this.populateFormFields(user);
    });
  }

  personAddEdit(personId: number | undefined) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.f['person'].getRawValue();
    this.dialog.open(PersonComponent, dialogConfig).afterClosed().subscribe((res) => {
      if (res) {
        const userPersonId = parseInt(this.f['person'].value.id, 10);
        if (parseInt(res.id) > 0 && parseInt(res.id) !== userPersonId) {
          this.loadingService.enableLoading();
          if (userPersonId !== parseInt(res.id))
            this.repository.getData(`users/?personId=${res.id}`).pipe(first()).subscribe(uExists => {
              this.loadingService.disableLoading();
              if (uExists.length)
                this.message = 'Esta informacion personal pertenece a otro usuario.';
              else {
                this.f['person'].patchValue({
                  id: res.id,
                  firstName: res.firstName,
                  lastName: res.lastName,
                  gender: res.gender,
                  documentTypeId: res.documentTypeId,
                  document: res.document,
                  nickname: res.nickname,
                  genderId: res.genderId,
                  professionId: res.professionId,
                  civilStateId: res.civilStateId,
                  foto: res.foto,
                  userId: res.userId,
                  phoneNo: res.phoneNo,
                  dateOfBirth: res.dateOfBirth,
                  email: res.email,
                  address: {
                    id: res.address?.id,
                    state: res.address?.state,
                    area: res.address?.area,
                    city: res.address?.city,
                    pincode: res.address?.pincode,
                  }
                });
              }
            })
        }
        else {
          this.f['person'].patchValue({
            id: res.id,
            firstName: res.firstName,
            lastName: res.lastName,
            gender: res.gender,
            documentTypeId: res.documentTypeId,
            document: res.document,
            nickname: res.nickname,
            genderId: res.genderId,
            professionId: res.professionId,
            civilStateId: res.civilStateId,
            foto: res.foto,
            userId: res.userId,
            phoneNo: res.phoneNo,
            dateOfBirth: res.dateOfBirth,
            email: res.email,
            address: {
              id: res.address?.id,
              state: res.address?.state,
              area: res.address?.area,
              city: res.address?.city,
              pincode: res.address?.pincode,
            }
          });
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userFormSubscription) this.userFormSubscription.unsubscribe();
  }

  goBack() {
    if (this.route.snapshot.params['id'])
      this.router.navigateByUrl('/dashboard/users');
    else
      this.router.navigateByUrl('/dashboard');
  }

}
