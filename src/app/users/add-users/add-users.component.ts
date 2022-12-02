import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first, Subscription } from 'rxjs';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { MyErrorStateMatcher } from 'src/app/helpers/my-error-state-matcher';
import { Customer } from 'src/app/shared/models/customer.model';
import { Employee } from 'src/app/shared/models/employee.model';
import { Gender } from 'src/app/shared/models/gender.model';
import { Medic } from 'src/app/shared/models/medic.model';
import { Patient } from 'src/app/shared/models/patient.model';
import { Role, User, UserGroup } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  user: User;
  userForm!: FormGroup;
  submitted = false;

  get f() { return this.userForm.controls }

  genders = Gender;
  addUserSubscription!: Subscription;
  userGroupSource: UserGroup[] | undefined;
  userRoleSource: Role[] | undefined;
  employiesSource!: any[] | undefined;
  patientsSource!: any[] | undefined;
  customersSource!: any[] | undefined;
  medicsSource!: any[] | undefined;
  message: any = null;
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().slice(0, 10)
  // new Date().toISOString().slice(0,10) - ;

  matcher = new MyErrorStateMatcher();

  selectedGroup: string = 'Seleccione Un grupo';
  groupIndex: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private respository: RepositoryService,
    public loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.user = new User();
    this.initForm();
  }

  ngOnInit(): void {
    this.getEmployies();
    this.getPatients();
    this.getCustomers();
    this.getMedics();

    this.getUserGroups();
    this.getUserRoles();
  }

  initForm() {
    this.userForm = this.formBuilder.group(
      {
        userGroupId: new FormControl('', [Validators.required]),
        roleId: new FormControl('', [Validators.required]),
        customerId: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        emailId: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      }, {
      validators: MustMatch('password', 'confirmPassword'),
      // validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  getUserGroups() { this.respository.getData('user-groups').pipe(first()).subscribe((lst: UserGroup[]) => { this.userGroupSource = lst; }) }
  getUserRoles() { this.respository.getData("roles").pipe(first()).subscribe((lst: UserGroup[]) => { this.userRoleSource = lst; }) }

  getCustomers() { this.respository.getData('customers').subscribe((lst: any) => { this.customersSource = lst.records as Customer[]; }); }
  getEmployies() { this.respository.getData('employies').subscribe((lst: any) => { this.employiesSource = lst.records as Employee[]; }); }
  getMedics() { this.respository.getData('medics').subscribe((lst: any) => { this.medicsSource = lst.records as Medic[]; }); }
  getPatients() { this.respository.getData('patients').subscribe((lst: any) => { this.patientsSource = lst.records as Employee[]; }); }


  onGroupSectedChange(event: any) {
    const val = (<HTMLSelectElement>event.target).value;
    this.selectedGroup = this.userGroupSource?.find(g => g.id === parseInt(val))?.name || '';
    this.groupIndex = parseInt(val);
    // switch (val) {
    //   case '1':
    //     this.getEmployies();
    //   case '2':
    //     this.getPatients();
    //   case '3':
    //     this.getCustomers();
    //   case '4':
    //     this.getMedics();
    //   default:
    //     this.getEmployies();
    //     this.getPatients();
    //     this.getCustomers();
    //     this.getMedics();
    // pass through any requests not handled above
    // return next.handle(request);
    // }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loadingService.enableLoading();
    this.addUser(this.userForm.getRawValue());
  }

  addUser(formData: any) {
    if (this.authService.userValue?.id)
      this.user.userId = this.authService.userValue?.id
    this.respository.create('users', formData).subscribe({
      next: () => {
        this.loadingService.disableLoading;
        this.toastr.success('El usuario ha sido creado correctamente.', 'Laboratory App.');
        setTimeout(() => { this.router.navigateByUrl('/dashboard/users'); }, 3000);
      },
      error: error => {
        this.loadingService.disableLoading;
        if (error.error.message === 'FieldException')
          error.error.errors.forEach((element: any) =>
            this.userForm.controls[element.field]?.setErrors({
              serverValidationError: element.message,
            })
          );
        else throw new Error(error);
      }
    });
  }

}
