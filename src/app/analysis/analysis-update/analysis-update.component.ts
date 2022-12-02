import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AnalysisResultEditDialogComponent } from 'src/app/shared/dialogs/analysis-result-edit-dialog/analysis-result-edit-dialog.component';
import { AnalysisOrder } from 'src/app/shared/models/analysis-order.model';
import { LabAnalysisResult } from 'src/app/shared/models/lab-analysis-result';
import { LabAnalysisVariable } from 'src/app/shared/models/lab-analysis-variable.model';
import { LabSample, LabSampleDetails } from 'src/app/shared/models/lab-sample';
import { hasPermision } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-analysis-update',
  templateUrl: './analysis-update.component.html',
  styleUrls: ['./analysis-update.component.scss']
})
export class AnalysisUpdateComponent implements OnInit {
  orderColums: string[] = ['recpId', 'recpDate', 'recpTime', 'action'];
  orderSource = new MatTableDataSource<any>([]);
  casoInfo: AnalysisOrder | null = null;
  resultForm!: FormGroup;
  editMode: boolean = false;

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private repository: RepositoryService,
    public loadingService: LoadingService,
    private router: Router,
    private pdfService: PdfService
  ) {
    // this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.resultForm = this.initResultFormGroup();
    this.activeRoute.queryParams.subscribe((p: any) => {
      if (p.caseId) {
        this.repository.getData(`hos-cases/${p.caseId}`).pipe(first()).subscribe((cData: AnalysisOrder) => {
          this.casoInfo = cData;
          this.repository.getData(`people/${cData.patient.person?.id}`).subscribe(p => {
            if (this.casoInfo)
              this.casoInfo.patient.person = p;
          });
          this.getOrders({ id: p.caseId, oid: p.recpId });
          // if (p.pruebaId)
          //   this.repository.getData(`lab-analysies/${parseInt(p.testId, 10)}?include=all`).pipe(first()).subscribe((_la: LabAnalysis) => {
          //     // this.loadingService.enableLoading();
          //     // const dialogRef = this.dialog.open(LabResultValidateDialogComponent, {
          //     //   data: { casoInfo: this.casoInfo, oId: p.recpId, aSelected: _la, gCodigo: _la.analysisGroupId, aCodigo: _la.id, eMode: 'edit' },
          //     //   panelClass: 'fullscreen-dialog',
          //     //   height: '100vh',
          //     //   width: '100%',
          //     //   disableClose: true
          //     // });

          //     // dialogRef.afterClosed().subscribe(result => {
          //     //   this.loadingService.disableLoading();
          //     //   if (result) {
          //     //     this.activeRoute.params.subscribe(params => {
          //     //       this.getOrders({ id: p.caseId, oid: p.recpId });
          //     //     })
          //     //   }
          //     // });
          //   });
        })
      }
    });
  }

  initResultFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      caseId: [{ value: null, disabled: true }, [Validators.required]],
      recpDate: [new Date, [Validators.required]],
      recpTime: [new Date(Date.now()).toISOString(), [Validators.required]],
      recpNote: null,
      mdcoId: null,
      status: null,
      userId: [this.authService.userValue?.id, [Validators.required]],
      created: [new Date(Date.now()), [Validators.required]],
      updated: null,
      // details: this.fb.array([]),
      analiticsGroups: this.fb.array([])
    });
  }

  addAnaliticGroupControls() {
    return this.fb.group({
      id: null,
      name: null,
      analiticas: this.fb.array([])
    })
  }

  addAnaliticControls() {
    return this.fb.group({
      id: [null],
      testId: [null],
      sampleTypeId: [null],
      analysisGroupId: [null],
      analysisSubGroupId: [null],
      labMethodId: [null],
      labEquipmentId: [null],
      sampleContainerId: [null],
      labId: [null],
      description: [null],
      abbreviation: [null],
      sex: [null],
      condition: [null],
      day: [null],
      days: [null],
      webResult: [null],
      normalValue: [null],
      status: [null],
      lab_analysis_variables: [null],
      have_result: Boolean(false),
      anali_selected: Boolean(false),
    })
  }

  getOrders(arg: { id: number; oid: string; }) {
    this.repository.getData(`lab-sample-receptions?caseId=${arg.id}`).pipe(first()).subscribe((orders: LabSample[]) => {
      // console.log(orders)
      if (orders.length) {
        this.orderSource.data = orders;
        // if (arg.oid) {
        // const currentOrder = arg.oid > 0 ? orders.find(o => o.id === arg.oid) : orders[0];
        const oid = parseInt(arg.oid, 10);
        const currentOrder = oid > 0 ? orders.find(o => o.id === oid) : orders[0];
        if (currentOrder)
          this.loadOrderDetails(currentOrder);
        // }
      }
    });
  }

  loadOrderDetails(currentOrder: LabSample) {
    this.loadingService.enableLoading();
    if (this.editMode) {
      window.alert('Se encuentra en modo edición');
      this.loadingService.disableLoading();
      return;
    }

    let analysisResult: LabAnalysisResult | null = null;

    this.resultForm.patchValue(currentOrder);
    this.analiticsGroupsArray.clear();
    this.repository.getData(`lab-sample-reception-details?caseId=${this.casoInfo?.id}&recpId=${currentOrder.id}&groupBy=analysisGroup`).pipe(first())
      .subscribe((sampleDetailGroups: LabSampleDetails[]) => {
        sampleDetailGroups.forEach(sdg => {
          this.repository.getData(`lab-group-analysies/${sdg.analysisGroupId}`).pipe().subscribe((lgn: any) => {
            const aGC = this.addAnaliticGroupControls();
            lgn.name = lgn.name?.toUpperCase();
            aGC.patchValue(lgn);
            this.analiticsGroupsArray.push(aGC);
            const ac = aGC.get('analiticas') as FormArray;
            this.repository.getData(`lab-sample-reception-details?caseId=${this.casoInfo?.id}&recpId=${currentOrder.id}&sgId=${sdg.analysisGroupId}`).pipe(first())
              .subscribe((sampleDetails: LabSampleDetails[]) => {
                sampleDetails.forEach((e: any, index: number) => {
                  this.repository.getData(`lab-analysies/${e.analyId}?include=all`).pipe().subscribe((analytic: any) => {
                    const av = this.addAnaliticControls();
                    av.patchValue(analytic);
                    ac.push(av);
                    av.get('have_result')?.setValue(false);
                    analytic.variables.forEach((variable: LabAnalysisVariable) => {
                      this.repository.getData(`lab-analysis-results?caseId=${this.casoInfo?.id}&recpId=${currentOrder.id}&analyId=${analytic.id}&vbleId=${variable.id}`)
                        .pipe(first()).subscribe(results => {
                          this.loadingService.disableLoading();
                          if (results.length) {
                            // const b: boolean = results[0].validated.toString() === '1' ? true : false;
                            const b: boolean = results[0].validated;
                            if (results[0].result != '' && b) {
                              av.get('have_result')?.setValue(!!(av.get('have_result') || (b)));
                              av.get('anali_selected')?.setValue(!!(av.get('anali_selected') || true));
                            }
                          }
                        });
                    })
                  });
                })
              });
          });
        });
      });
  }

  get f() { return this.resultForm }

  get analiticsGroupsArray(): FormArray {
    return <FormArray>(this.resultForm.get('analiticsGroups'));
  }

  getAnaliticsArray(index: number): FormArray {
    return <FormArray>this.analiticsGroupsArray.at(index)?.get('analiticas');
  }

  updateAllComplete() {
    /* var _everyCheck: any = [];

    this.analiticsGroupsArray.value.forEach((g: any) => {
      if (g.analiticas != null)
        g.analiticas.map((a: any) => {
          _everyCheck.push(a.variables != null && a.variables.every((v: any) => v.resu_validado));
        });
    })

    this.allComplete = _everyCheck.every((e: any) => e); */
  }

  heveResult(gindex: number) {
    return this.getAnaliticsArray(gindex).value.some((e: any) => e.have_result === true);
  }

  hasPermision() {
    return hasPermision(this.authService.getRole());
  }

  showDialog(recpId: number, gCodigo: any, mode: string = 'view', aCodigo: number = 0): void {
    var analiticsSelected = null;
    // if (aCodigo === 0) {
    //   const gIndex = this.analiticsGroupsArray.value.findIndex((x: any) => x.grup_codigo === gCodigo);
    //   analiticsSelected = gIndex >= 0 ? this.getAnaliticsArray(gIndex).value : null;
    //   // const noSelected = analiticsSelected.some((r: any) => r.anali_selected);
    // }
    // console.log(gIndex ? this.getAnaliticsArray(gIndex).value : 0);
    // this.loadingService.enableLoading();
    const dialogRef = this.dialog.open(AnalysisResultEditDialogComponent, {
      data: { casoInfo: this.casoInfo, oId: recpId, aSelected: analiticsSelected, gCodigo: gCodigo.getRawValue(), aCodigo, eMode: mode },
      panelClass: 'fullscreen-dialog',
      height: '100vh',
      width: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadingService.disableLoading();
      if (result) {
        this.activeRoute.queryParams.subscribe((_p: any) => {
          this.getOrders({ id: _p.caseId, oid: _p.recpId });
        })
      }
    });
  }

  loadAnotherOrderDetails(sample: LabSample) {
    this.router.navigate(['/dashboard/updateanalysisresult'], { queryParams: { caseId: sample.caseId, recpId: sample.id } });
  }

}

