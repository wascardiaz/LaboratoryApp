import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable, of as observableOf } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, first, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/shared/models/patient.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { PatientAddComponent } from '../patient-add/patient-add.component';
import { Options } from 'src/app/shared/models/options.model';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss']
})
export class PatientSearchComponent implements OnInit {

  fromPage!: any;
  fromDialog!: string;
  // optionEnabled!: boolean;
  newPatientAdded: boolean = false;

  displayedColumns: string[] = ['id', 'docType', 'document', 'firstName', 'lastName', 'actions',];
  data: Patient[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  validPattern = /^[a-zA-Z0-9-_ ]*$/; // alphanumeric exact 10 letters  
  keyCodeReched = ['AltLeft', 'Tab', 'ShiftLeft', 'NumpadEnter', 'Enter', 'ArrowLeft', 'ArrowRight'];
  pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputSearch!: ElementRef;
  @ViewChild('input', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    setTimeout(() => {
      if (element) {
        element.nativeElement.focus()
      }
    }, 0);
  }

  options: Options;

  public dataSource = new MatTableDataSource<Patient>();

  constructor(
    public dialogRef: MatDialogRef<PatientSearchComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any,
    private repositoryService: RepositoryService,
    private dialog: MatDialog
  ) {
    this.fromPage = { ...mydata };
    // this.optionEnabled = mydata.option;
    this.options = {
      orderBy: 'id',
      orderDir: 'desc',
      page: 0,
      search: '',
      size: 5
    };
  }

  ngOnInit(): void {
    this.fromPage = this.mydata;
    this.fromDialog = "I am from dialog land...";
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    fromEvent(this.inputSearch.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith({}),
      delay(0),
      tap(() => {
        if (this.validPattern.test(this.inputSearch.nativeElement.value) && this.inputSearch.nativeElement.value.trim() !== '') {
          if (/(\W|^)[0-9]{3}\-[0-9]{7}\-[0-9]{1}(\W|$)/.test(this.inputSearch.nativeElement.value.trim())) {
            this.options.search = this.inputSearch.nativeElement.value.trim().replace(/-/g, '')
          }
          else
            this.options.search = this.inputSearch.nativeElement.value;

          this.options.page = this.paginator.pageIndex;
          this.options.size = this.paginator.pageSize;
          this.options.orderBy = this.sort.active;
          this.options.orderDir = this.sort.direction;
          this.paginator.pageIndex = 0;
        }
        else this.options.search = '';
      }),
      switchMap((_: any) => {
        if (this.validPattern.test(this.inputSearch.nativeElement.value) && this.inputSearch.nativeElement.value.trim() !== '' && !this.keyCodeReched.includes(_.code)) {
          return this.getData();
        }
        return observableOf(_.code);
      }),
      map((data: any) => {

        if (typeof data === 'string')
          return data;

        else if (typeof data === 'object') {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          this.resultsLength = data.count;
          return data.records;
        }
        else {
          return data;
        }
      })
    ).subscribe((data: any) => {
      if (data && typeof data === 'object') {
        this.data = data;
      }
      else if (!this.inputSearch.nativeElement.value && !this.keyCodeReched.includes(data)) {
        this.applyFilter();
      }
    });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      tap(() => {
        this.options.search = this.inputSearch.nativeElement.value;
        this.options.page = this.paginator.pageIndex;
        this.options.size = this.paginator.pageSize;
        this.options.orderBy = this.sort.active;
        this.options.orderDir = this.sort.direction;
      }),
      switchMap(() => {
        this.isLoadingResults = true;
        const urlString = `patients/?page=${this.options.page}&size=${this.options.size}&search=${this.options.search}&orderBy=${this.options.orderBy}&orderDir=${this.options.orderDir}`;
        return this.repositoryService!.getData(urlString).pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;

        if (data === null) {
          return [];
        }

        this.resultsLength = data.count;
        return data.records;
      }),
    ).subscribe(data => this.data = data);
  }

  loadPatient(element: any) {
    this.dialogRef.close({ patient: element as Patient, newAdded: this.newPatientAdded });
  }

  onSearchClear() {
    this.inputSearch.nativeElement.value = '';
    this.options.search = '';
    this.applyFilter();

  }

  getData(): Observable<any> {
    this.isLoadingResults = true;
    const urlString = `patients/?page=${this.paginator.pageIndex}&size=${this.paginator.pageSize}&search=${this.options.search}&orderBy=${this.sort.active}&orderDir=${this.sort.direction}`;
    return this.repositoryService.getData(urlString).pipe(catchError(() => observableOf(null)));
  }

  applyFilter(event = new Event('')) {
    this.paginator.pageIndex = 0;
    this.options.page = this.paginator.pageIndex;

    this.getData().pipe(first(),
      // tap(() => this.paginator.pageIndex = 0),
      map(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;

        if (data === null) {
          return [];
        }

        this.resultsLength = data.count;
        return data.records;
      })).subscribe((data: Patient[]) => {
        this.data = data;
      });

  }

  newPatient() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {
      title: 'Pruebas y/o Estudios',
      subTitle: 'Esta seguro que desea agregar un nuevo item?',
      body: 'Haga click en SI para proceder, haga click en NO para ignorar.',
      // params,
    }
    this.dialog.open(PatientAddComponent, dialogConfig).afterClosed().subscribe(res => {
      if (res) {
        this.newPatientAdded = true;
        this.applyFilter();
      }
    })
  }

}
