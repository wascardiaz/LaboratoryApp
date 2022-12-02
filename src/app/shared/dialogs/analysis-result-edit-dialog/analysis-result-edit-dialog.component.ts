import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, map, Observable, of } from 'rxjs';
import { capitalizeName, getBase64ImageFromURL } from 'src/app/helpers/helpers';
import { MyErrorStateMatcher } from 'src/app/helpers/my-error-state-matcher';
import { LabAnalysisVariable } from '../../models/lab-analysis-variable.model';
import { Person } from '../../models/person.model';
import { canValidate } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { PdfService } from '../../services/pdf.service';
import { RepositoryService } from '../../services/repository.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-analysis-result-edit-dialog',
  templateUrl: './analysis-result-edit-dialog.component.html',
  styleUrls: ['./analysis-result-edit-dialog.component.scss']
})
export class AnalysisResultEditDialogComponent implements OnInit {
  user = this.authService.userValue;
  validatorInfo!: Person | null;
  orderForm!: FormGroup;
  casoInfo: any = null;
  obj: any = null;
  unidSource: any = null;
  loading = false;
  submitted = false;
  allComplete: boolean = false;

  editMode: boolean = false;
  edited: boolean = false;
  loadedDataVar = false;
  resultsLength = 0;
  isRateLimitReached = false;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<any>(true /* multiple */);

  matcher = new MyErrorStateMatcher();

  canValid = canValidate;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public loadingService: LoadingService,
    private pdfService: PdfService,
    public dialogRef: MatDialogRef<AnalysisResultEditDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private repositoryService: RepositoryService,
    private toastr: ToastrService) {
    if (data) {
      this.obj = { ...data };
      this.casoInfo = data.casoInfo;

      if (this.obj.eMode === 'print' || this.obj.eMode === 'download' /* || this.obj.eMode === 'view' */) {
        this.loadingService.enableLoading();
        // this.getPdfGenerator(this.obj.eMode);
        this.getPdfGenerator(this.obj.eMode).then(() => { this.loadingService.disableLoading(); this.dialogRef.close(); }).catch((error: any) => { console.log(error); });
        // this.generatePdf('open').then((_) => console.log(_)).catch((error) => { console.log(error); });
      }
    }
  }

  ngOnInit(): void {
    this.orderForm = this.initorderFormGroup();
    this.GetOrder(this.obj);
    if (this.obj.eMode === 'edit' /* && (hasPermision(this.account.role) || canValidate(this.account.role)) */) this.editMode = true;
  }

  _filter(e: any, arr: any): string[] {
    const filterValue = e.target.value.toLowerCase();
    return arr.filter((opt: any) => opt.vble_valor.toLowerCase().includes(filterValue));
  }

  getPdfGenerator(action: string) {
    const promise = new Promise(async (resolve, reject) => {
      await this.generatePdf(action).then(() =>
        resolve('Ready')).catch(e => console.log(e));
      // setTimeout(() => {
      //   resolve(this.generatePdf(action));
      // }, 3000);
    });
    return promise;
  }

  async generatePdf(action = 'open') {
    // this.GetOrder(this.obj);
    this.loadingService.enableLoading();
    const documentDefinition: any = await this.getDocumentDefinition();
    await this.pdfService.generatePdf(action, documentDefinition, `coieResult${this.casoInfo.id}`);

  }

  async getDocumentDefinition() {
    const docValues = this.orderForm.getRawValue();

    let contentF = [
      docValues.analiticsGroups.map((g: any, index: number) => {
        const reps: any = [];
        // reps.push({ qr: capitalizeName(this.casoInfo.nombres) + ', Contact No : ' + this.casoInfo.telefono + ', www.oncologicointegral.com', fit: 75, absolutePosition: { x: 350, y: 110 }, })
        reps.push(this.patientInfo());
        reps.push({ text: `Informes de Laboratorio (${g.name})`, style: 'header', alignment: 'left' });
        // reps.push({ text: 'Resultados de Laboratorio', style: 'header',  alignment: 'center' });

        if (g.analiticas.length)
          reps.push(this.getReportAnalitics(g.analiticas));

        const ifCuantitative = g.analiticas.some((ana: any) => { return ana.variables.some((e: any) => e.vble_tipo === 'N') });
        // const _ad = '';
        // const _au = '';

        if (ifCuantitative && index === docValues.analiticsGroups.length - 1) {
          reps.push({ text: 'Resultados fuera de los parametros de referencias, flecha hacia arriba o hacia abajo.', fontSize: 8, absolutePosition: { x: 20, y: 732 } });
          // reps.push(
          // { text: 'Leyenda', style: 'analiTitle', margin: [0, 30, 0, 5] },
          // { text: '', style: 'icon2' },
          // { text: '', style: 'icon2' },
          /*{
            ul: [
              { text: _ad + 'Fecha hacia arriba, valores por encima de los parámetros', style: 'icon2' },
              'Fecha hacia abajo, valores por debajo de los parámetros'
            ]
          }, 
          {
            columns: [
              [
                { text: 'Leyenda', style: 'analiTitle' },
                { text: 'Alto, valores por encima de los parámetros', },
                { text: 'Bajo, valores por debajo de los parámetros', }
              ]
            ],
            margin: [0, 15, 0, 30]
          } */
          // );
        }

        // For 8 1/2 x 11(215.9mm x 279.4mm) => (612 x 792p)
        reps.push({ absolutePosition: { x: 432, y: 720 }, canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 1 }] });

        this.putAnalistaInfo(reps);

        // For A4 (210.02mm x 297.01mm ) => (595.332283p x 841.91811p)
        // reps.push({ absolutePosition: { x: 432, y: 770 }, canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 1 }] });
        // reps.push({ text: `Bioanalista`, fontSize: 9, italics: true, absolutePosition: { x: 457, y: 772 } });

        if (docValues.analiticsGroups.length > 1 && index < docValues.analiticsGroups.length - 1) reps.push({ text: ``, pageBreak: 'after' });

        this.loadingService.disableLoading();

        return reps;
      })
    ];

    const images = {
      logo: await getBase64ImageFromURL('./../../../../assets/logo_512.png'),
      signature: await getBase64ImageFromURL('./../../../../assets/img/signatures/sello.png'),
    };

    const info = {
      title: `${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}_Resultado_Laboratorio`,
      author: 'Centro Médico Santana Taveras, S. A.',
      subject: 'Laboratory identifer',
      keywords: 'LABORATORY, ONLINE RESULT ORDER',
    };

    const styles = {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 10],
        // decoration: 'underline'
      },
      name: {
        fontSize: 14,
        bold: true
      },
      analiTitle: {
        bold: true,
        margin: [0, 2, 0, 0],
        italics: true,
        decoration: 'underline'
      },
      sign: {
        margin: [0, 50, 0, 10],
        alignment: 'right',
        italics: true
      },
      tableHeader: {
        bold: true,
        // fontSize: 10
      },
      icon: { font: 'Icomoon', bold: true },
      icon2: { font: 'Myicomoon', bold: true, fontSize: 9, margin: [0, 1, 0, 0] }
    };

    const defaultStyle = {
      // columnGap: 4,
      fontSize: 10
    }

    let headerfooterDoc = {
      header: {
        margin: [20, 20, 20, 0],
        columns: [
          {
            with: 'auto',
            margin: [0, 0, 0, 0],
            alignment: 'left',
            image: 'logo',
            width: 110
          },
          {
            margin: [0, 15, 0, 0],
            with: 'auto',
            columns:
              [
                [
                  {
                    text: 'CENTRO ONCOLOGICO INTEGRAL Y ESPECIALIDADES',
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    color: '#008641',
                  },
                  {
                    margin: [0, 1, 0, 1],
                    alignment: 'right',
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 460, y2: 0, lineWidth: 2, color: '#CC0505' }]
                  },
                  {
                    text: 'Centro Médico Santana Taveras, S. A.',
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                  },
                  {
                    text: 'RNC:130-31058-2',
                    fontSize: 10,
                    alignment: 'center'
                  }
                ]
              ]

          }
        ]
      },
      footer: (currentPage: number, pageCount: number, pageSize: any) => {
        return [
          {
            margin: [0, 2, 0, 2],
            alignment: 'center',
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 572, y2: 0, lineWidth: 2, color: '#CC0505' }]
          },
          {
            margin: [20, 2, 20, 0],
            fontSize: 9,
            columns: [
              {
                width: 'auto',
                alignment: 'left',
                text: 'Ave. España No.96 esq. Proyecto, Calero, Villa Duarte, Santo Domingo Este, R. D. *Tel.:(809)-594-6165'
              },
              {
                with: 100,
                alignment: 'right',
                text: [{
                  color: '#7f7f7f',
                  text: 'pagina | '
                },
                {
                  text: `${currentPage} de ${pageCount}`
                }
                ]
              }

            ],
          }]
      },
      content: contentF,
      pageSize: 'letter',
      pageMargins: [33, 120, 33, 50],
      images: images,
      info: info,
      styles: styles,
      defaultStyle: defaultStyle
    }

    return headerfooterDoc; 3377
  }

  putAnalistaInfo(reps: any[]) {
    this.repositoryService.getData(`people/${this.user?.personId}`).pipe(first()).subscribe((data: any) => {
      // const validatorInfo = data !== null ? `${data.title ? data.title : ''} ${data.firstName} ${data.lastName}` : 'Bioanalista';
      const validatorInfo = 'Bioanalista';

      reps.push({ image: 'signature', width: 120, absolutePosition: { x: 420, y: 675 } });
      reps.push({ text: validatorInfo, fontSize: 9, italics: true, absolutePosition: { x: 457 - (validatorInfo.length / 2), y: 722 } });
    });
  }

  patientInfo() {
    const sexInfo = (genderId: number, dateOfBirth: string) => {
      let gender = '';
      const age = this.getAge(dateOfBirth);
      this.repositoryService.getData(`person-gender/${genderId}`).pipe(first()).subscribe((x: any) => { if (x) gender = x.name.substring(0, 1).toUpperCase() });
      // const a = parseInt(age.split(' ')[0], 10);
      const a = age;

      if (gender === 'F') {
        if (a < 6) return `Niña, Primer Infante, ${age}`;
        if (a < 12) return `Niña, Infante, ${age}`;
        if (a < 18) return `Femenino, Adolescente, ${age}`;
        /* if (a < 26) return `Mujer, Joven, ${age}`;
        if (a < 60) return `Mujer, Adulta, ${age}`; */
        else return `Mujer, ${age}`;
      }

      else {
        if (a < 6) return `Niño, Primer Infante, ${age}`;
        if (a < 12) return `Niño, Infante, ${age}`;
        if (a < 18) return `Masculino, Adolescente, ${age}`;
        /* if (a < 26) return `Hombre, Joven, ${age}`;
        if (a < 60) return `Hombre, Adulta, ${age}`; */
        else return `Hombre, ${age}`;
      }
    }

    const nDate = (date: Date) => {
      const dt = new Date(date).toISOString().split('T')[0].split('-');
      return dt.reverse().join('/');
    }
    // console.log(this.casoInfo)

    return {
      columns: [
        [
          { text: capitalizeName(`${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}`), style: 'name' },
          { text: `${sexInfo(this.casoInfo?.patient?.person?.genderId, this.casoInfo?.patient?.person?.dateOfBirth)}` },
          { text: `Ars: ${this.casoInfo?.seguro || 'Privado'}` },
          { text: `Médico: ${this.casoInfo?.medico || ''}` },
          { text: `${this.casoInfo?.patient?.person?.documentType?.name}: ${this.casoInfo?.patient?.person?.document || ''}` },
          { text: `Teléfono: ${this.casoInfo?.patient?.person?.phoneNo}` },
        ],
        [
          { text: `Caso : ${this.casoInfo?.id}`, alignment: 'right', style: 'tableHeader' },
          { text: `Fecha Ingreso: ${nDate(this.casoInfo?.created)}`, alignment: 'right' },
          { text: `Orígen: ${this.casoInfo?.origin?.name || ''}`, alignment: 'right' },
          { text: `Habitación: ${this.casoInfo?.habitacion || ''}`, alignment: 'right' },
          { text: `Poliza: ${this.casoInfo?.poliza || ''}`, alignment: 'right' },
          { text: `Historia: ${this.casoInfo?.histNumero || ''}`, alignment: 'right' },
          // { qr: capitalizeName(this.casoInfo.nombres) + ', Contact No : ' + this.casoInfo.telefono, fit: 75, alignment: 'right' }

        ],
        {
          qr: capitalizeName(`${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}`) + ', Contact No : ' + this.casoInfo?.patient?.person?.phoneNo + ', www.oncologicointegral.com',
          fit: 75,
          alignment: 'right',
          margin: [3, 0, 0, 0],
          width: 85
        }
      ]
    }
  }

  getReportAnalitics(_analiticas: any) {

    const reps: any = [];
    var headerColumns: any = [
      { text: 'DETERMINACION', fillOpacity: 0.15, fillColor: 'lightgrey', style: 'tableHeader' },
      { text: 'RESULTADO', fillOpacity: 0.15, fillColor: 'lightgrey', style: 'tableHeader' },
      { text: 'VALORES DE REFERENCIA', fillOpacity: 0.15, fillColor: 'lightgrey', style: 'tableHeader' },
      { text: 'UNIDADES', fillOpacity: 0.15, fillColor: 'lightgrey', style: 'tableHeader' }];

    // _analiticas.forEach(async (ana: any, index: number) => {
    //   const resultValid = ana.variables.some((v: any) => v.vble_resultado && v.resu_validado);
    //   // var rFecha = new Date();
    //   // ana.variables.map((v: any) => { if (v.resu_fecha) rFecha = v.resu_fecha });

    //   if (resultValid) {
    //     /* reps.push({
    //       columns: [
    //         [{
    //           text: `${ana.reng_descripcion}`,
    //           style: 'analiTitle'
    //         }],
    //          {
    //            text: `Fecha de Reporte: ${new Date(rFecha).toLocaleDateString()}, Hora: ${formatAMPM(rFecha)}`,
    //            alignment: 'right', margin: [0, 5, 0, 5]
    //          }
    //       ]
    //     }); */

    //     if (ana.variables.length) {
    //       if (index > 0)
    //         headerColumns = [{ text: '', border: [true, true, true, true] }
    //           , { text: '', border: [true, true, true, true] }
    //           , { text: '', border: [true, true, true, true] }
    //           , { text: '', border: [true, true, true, true] }];

    //       reps.push(this.getReportResultDetails(ana.variables, headerColumns));

    //     }
    //   }

    // });

    const tableCont: any = [];
    tableCont.push(headerColumns);
    _analiticas.forEach(async (ana: any, index: number) => {
      const resultValid = ana.variables.some((v: any) => v.result && v.resu_validado);
      if (resultValid) {
        const cols = ['description', 'result', 'value', 'unidId'];
        const cuali = ['description', 'result', null, 'unidId'];
        var _st: string;
        if (index === 0) {
          tableCont.push([
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] }
          ])
        }
        if (ana.variables.length) {
          ana.variables.forEach((vble: any, indx: number) => {
            if (vble.typeCode === 'N') {
              const _min = vble.valores?.length ? vble.valores[0].min : 0;
              const _max = vble.valores?.length ? vble.valores[0].max : 120;
              const _r = vble.result;
              _st = _r < _min ? '' : _r > _max ? '' : '';
            }

            var dataRow: any = [];
            if (vble.typeCode === 'T') {
              tableCont.push([{
                text: vble.description, colSpan: 4, style: 'analiTitle'/* , fillOpacity: 0.15, fillColor: 'lightgrey' */, border: [false, false, false, false]
              }, {}, {}, {}]);
            }
            if (vble.typeCode !== 'T' && vble.result && vble.resu_validado) {

              if (vble.typeCode === 'L') {
                cuali.forEach((column: any) => {
                  dataRow.push({ text: vble[column] || '', border: [false, false, false, false] });
                })
              }
              else {
                cols.forEach((column: any) => {
                  if (column == 'result' && vble.value) {
                    const colRes = { columns: [{ text: vble[column] || '', border: [false, false, false, false] }, { text: _st, alignment: 'left', style: 'icon2' }], border: [false, false, false, false] };
                    _st = '';
                    dataRow.push(colRes);
                  }
                  else
                    dataRow.push({ text: vble[column] || '', border: [false, false, false, false] });
                })
              }

              tableCont.push(dataRow);

              vble.valores.map((val: any) => {
                if (val.text)
                  tableCont.push([
                    { text: '', border: [false, false, false, false] },
                    { text: val.text, colSpan: 3, border: [false, false, false, false] },
                    { text: '', border: [false, false, false, false] },
                    { text: '', border: [false, false, false, false] }
                  ]);
              })
            }
          });
        }
      }
    });

    reps.push({
      table: {
        headerRows: 1,
        widths: ['*', '*', 'auto', 'auto'],
        body: [...tableCont],
        margin: [0, 0, 0, 0],
        dontBreakRows: true,
        // noBorders: false,
        // headerLineOnly: true
      },
    });

    return reps;
  }

  getReportResultDetails(variables: any, columns: any): any {

    const all = [];
    const results = [];

    if (columns)
      results.push(columns);

    const cols = ['description', 'result', 'value', 'unidId'];
    const cuali = ['description', 'result', null, 'unidId'];
    var _st: string;

    variables.forEach((vble: any, indx: number) => {
      // if (vble.typeCode === 'N') this.existCuentitativeVar = this.existCuentitativeVar || true;
      if (indx === 0) {
        results.push([
          { text: '', border: [true, true, true, true] },
          { text: '', border: [true, true, true, true] },
          { text: '', border: [true, true, true, true] },
          { text: '', border: [true, true, true, true] }
        ])
      }

      if (vble.typeCode === 'N') {
        const _min = vble.vble_minimo;
        const _max = vble.vble_maximo;
        const _r = vble.result;
        // _st = _r < _min ? '' : _r > _max ? 'ru' : '';
        _st = _r < _min ? '' : _r > _max ? '' : '';
      }
      // const edad = parseInt(this.casoInfo.edad.split(' ')[0], 10);

      /* if (vble.typeCode === 'N' && vble.valores.length) {
        vble.valores.map((v: any) => {
          if (parseInt(v.vble_desde, 10) < edad && parseInt(v.vble_hasta, 10) > edad) {
            vble.vble_texto = v.vble_texto;
            vble.value = v.value;
            return;
          }
  
        });
      } */
      // console.log(vble);

      var dataRow: any = [];
      if (vble.typeCode === 'T') {
        results.push([{
          text: vble.description, colSpan: 4, fillOpacity: 0.15, fillColor: 'lightgrey'
          // overlayPattern: ['stripe45d', 'gray'],
          // overlayOpacity: 0.15
        }, {}, {}, {}]);
      }
      if (vble.typeCode !== 'T' && vble.result && vble.resu_validado) {

        if (vble.typeCode === 'L') {
          cuali.forEach((column: any) => {
            dataRow.push({ text: vble[column] || '', border: [true, true, true, true] });
          })
        }
        else {
          cols.forEach((column: any) => {
            if (column == 'result' && vble.value) {
              const colRes = { columns: [{ text: vble[column] || '', border: [true, true, true, true] }, { text: _st, alignment: 'left', style: 'icon2' }], border: [true, true, true, true] };
              _st = '';
              dataRow.push(colRes);
            }
            else
              dataRow.push({ text: vble[column] || '', border: [true, true, true, true] });
          })
        }

        results.push(dataRow);

        vble.valores.map((val: any) => {
          if (val.vble_texto)
            results.push([
              { text: '', border: [true, true, true, true] },
              { text: val.vble_texto, colSpan: 3, border: [true, true, true, true] },
              { text: '', border: [true, true, true, true] },
              { text: '', border: [true, true, true, true] }
            ]);
        })
      }
    });

    all.push({
      table: {
        headerRows: 1,
        widths: ['*', '*', 'auto', 'auto'],
        body: [...results],
        margin: [0, 0, 0, 0],
        dontBreakRows: true,
        // noBorders: false,
        // headerLineOnly: true
      },
    });

    return all;
  }

  initorderFormGroup(): FormGroup {
    return this.fb.group({
      id: [{ value: null, disabled: true }],
      caseId: [{ value: null, disabled: true }, [Validators.required]],
      recpDate: [new Date, [Validators.required]],
      recpTime: [new Date(Date.now()).toISOString(), [Validators.required]],
      recpNote: null,
      mdcoId: null,
      status: null,
      userId: [this.authService.userValue?.id, [Validators.required]],
      created: [new Date(Date.now()), [Validators.required]],
      updated: null,
      details: this.fb.array([]),
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
      variables: this.fb.array([])
    })
  }

  addVariableGroupControls() {
    return this.fb.group({
      id: [null],
      analyId: [null],
      unidId: [null],
      typeCode: [null],
      Vble_ID: [null],
      secuencia: [null],
      analySecuencia: [null],
      description: [null],
      type: [null],
      analyVNormales: [null],
      groupId: [null],
      send: [null],
      interface: [null],
      status: [null],
      lab_analysis_variable_values: [null],
      valores: this.fb.array([]),
      resu_validado: Boolean(false), // new FormControl({ value: null, disabled: validatorRoles.includes(this.account.role) ? false : true }),
      resu_comentario: null, //new FormControl({ value: null, disabled: this.editMode ? false : true, }, Validators.maxLength(250)),
      result: null
    })
  }

  addVariableValueGroupControls() {
    return this.fb.group({
      id: [null],
      vbleId: [null],
      mtdoId: [null],
      vbleSecuencia: [null],
      sex: [null],
      from: [null],
      to: [null],
      min: [null],
      max: [null],
      value: [null],
      text: [null],
      alarmMin: [null],
      alarmMax: [null],
      default: [null],
    })
  }

  // convenience getter for easy access to form fields
  get g() { return this.orderForm.controls; }

  get analiticsGroupsArray(): FormArray {
    return <FormArray>this.g['analiticsGroups'];
    // return <FormArray>(this.orderForm?.get('analiticsGroups'));
  }

  get orderDetailArray(): FormArray {
    return <FormArray>(this.orderForm.get('details'));
  }

  getAnaliticControlByIndex(index: number) {
    return this.analiticsGroupsArray.at(index)
  }

  getAnaliticsArray(index: number): FormArray {
    return <FormArray>(this.analiticsGroupsArray.at(index))?.get('analiticas');
  }

  getVariableArrayControlByIndex(gIndex: number, aIndex: number): FormArray {
    return <FormArray>(this.getAnaliticsArray(gIndex)).at(aIndex)?.get('variables');
  }

  updateAllComplete() {
    var _everyCheck: any = [];

    this.analiticsGroupsArray.value.forEach((g: any) => {
      if (g.analiticas != null)
        g.analiticas.map((a: any) => {
          _everyCheck.push(a.variables != null && a.variables.every((v: any) => v.resu_validado));
        });
    })

    this.allComplete = _everyCheck.every((e: any) => e)

    // console.log(this.allComplete, _everyCheck);
  }

  someComplete(): boolean {
    if (this.analiticsGroupsArray.value == null) {
      return false;
    }
    // return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    let numRows = 0;

    this.analiticsGroupsArray.value.forEach((g: any) => {
      g.analiticas.forEach((_a: any) => {
        numRows += _a.variables.filter((_v: any) => _v.resu_validado).length;
      });
    });

    return numRows > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    this.analiticsGroupsArray.controls.forEach((analiGroup: any) => {
      ((analiGroup.controls['analiticas'] as FormArray).controls as FormGroup[]).forEach((analitica: FormGroup) => {
        ((analitica.controls['variables'] as FormArray).controls as FormGroup[]).forEach((variable: FormGroup) => {
          variable.controls['resu_validado'].setValue(completed);
        });
      });
    });
  }

  GetUnids() { this.repositoryService.getData('lab-unids').pipe(first()).subscribe(unids => this.unidSource = unids); }

  GetOrder(params: any) {
    this.repositoryService.getData(`lab-sample-receptions/${params.oId}`).pipe(first()).subscribe((order: any) => {
      this.orderForm.patchValue(order);
      this.loadResults(params);
    });
  }

  loadResults(params: any) {
    const aGC = this.addAnaliticGroupControls();
    aGC.patchValue(params.gCodigo);
    this.analiticsGroupsArray.push(aGC);
    this.getAnalitics({ gc: aGC, params });
    // params.gCodigo.analiticas.forEach((analy: any) => {
    //   if (analy) {
    //     this.getAnalitics({ gc: aGC, a: analy, params });
    //   }
    // });
  }

  getAge(dateString: string) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getAnalitics(arg: { gc: any, params: any }) {
    // console.log(arg)
    const edad = this.getAge(this.casoInfo.patient.person.dateOfBirth);
    let sexo = '';
    this.repositoryService.getData(`person-gender/${this.casoInfo.patient.person.genderId}`).pipe(first()).subscribe((x: any) => { if (x) sexo = x.name.substring(0, 1).toUpperCase() });
    const agc = arg.gc.get('analiticas') as FormArray;
    const ac = this.addAnaliticControls();
    this.repositoryService.getData(`lab-analysies/${arg.params.aCodigo}?include=all`).pipe().subscribe((analytic: any) => {
      ac.patchValue(analytic);
      agc.push(ac);
      const vgc = ac.get('variables') as FormArray;
      // (<FormArray>aGC.get('analitcas')).push(ac)
      this.repositoryService.getData(`lab-analysis-variables?analyId=${analytic.id}`).pipe(first()).subscribe((variables: LabAnalysisVariable[]) => {
        variables.forEach((vble: any) => {
          const vc = this.addVariableGroupControls();
          vc.patchValue({
            id: vble.id,
            analyId: vble.analyId,
            unidId: vble.unidId,
            typeCode: vble.typeCode,
            Vble_ID: vble.Vble_ID,
            secuencia: vble.secuencia,
            analySecuencia: vble.analySecuencia,
            description: vble.description,
            type: vble.type,
            analyVNormales: vble.analyVNormales,
            groupId: vble.groupId,
            send: vble.send,
            interface: vble.interface,
            status: vble.status,
            // lab_analysis_variable_values: vble.lab_analysis_variable_values,
            // vbleunid: this.unidSource.find((u: LabUnid) => u.id === vble.unidId)?.name,
            // userId: this.account?.id,
            // userDate: new Date(Date.now()),
            // userValidator: this.account?.role.toLocaleLowerCase() === 'bioanalista' ? this.account?.id : null,
            // validatorDate: this.account?.role.toLocaleLowerCase() === 'bioanalista' ? new Date(Date.now()) : null,

          })
          vgc.push(vc);

          vble.lab_analysis_variable_values.forEach((value: any) => {
            const vvc = this.addVariableValueGroupControls();
            if (vble.type === 'N' && vble.lab_analysis_variable_values) {
              vble.lab_analysis_variable_values.map((v: any) => {
                if (parseInt(v.vble_desde, 10) <= edad && parseInt(v.vble_hasta, 10) >= edad && (v.vble_sexo === 'A' || v.vble_sexo === sexo)) {
                  vvc.patchValue(v);
                  // vc.patchValue(v);
                  (<FormArray>vc.get('valores')).push(vvc);
                  return;
                }
              })
            }
            else {
              vc.patchValue(value);
              vvc.patchValue(value);
              (<FormArray>vc.get('valores')).push(vvc);
            }

            this.repositoryService.getData(`lab-analysis-results?caseId=${this.casoInfo.id}&recpId=${arg.params.oId}&analyId=${analytic.id}&vbleId=${value.id}`).pipe(first()).subscribe((results: any) => {
              // console.log(results)
              if (results.length) {
                vc.patchValue({
                  resu_validado: results[0].validated,
                  resu_comentario: results[0].comment,
                  result: results[0].result
                })
              }
            })
          });
        })
      });
    });
  }

  edit() {
    this.submitted = false;
    this.analiticsGroupsArray.value.forEach((_: any, index: number) => {
      this.getAnaliticsArray(index).value.forEach((_e: any, aIx: number) => {
        this.getVariableArrayControlByIndex(index, aIx).value.forEach((row: any, idx: number) => {
          this.getVariableArrayControlByIndex(index, aIx).at(idx).get('user_Change')?.setValue(this.authService.userValue?.id);
          this.getVariableArrayControlByIndex(index, aIx).at(idx).get('fecha_change')?.setValue(new Date(Date.now()));
        });
      });
    });
  }

  showConfirmDialog(): void {
    const myCompDialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          title: 'Imprimir Resultados',
          subTitle: 'Desea imprimir los Resultados?',
          body: 'El reporte de resultados se ha guardado correctamente. Haga click en SI para imprimir el informe, haga click en NO para ignorar.'
        },
        width: '450px',
        disableClose: true
      }
    );
    myCompDialog.afterClosed().subscribe((res) => {
      // Trigger After Dialog Closed 
      if (res) {

        switch (res.event) {
          case "yes-option":
            console.log('Yes Clicked');
            this.generatePdf('print');
            break;
          case "no-option":
            console.log('No Clicked');

            break;
          case "maybe-option":
            console.log('May Be Clicked');
            break;
          default:
            break;
        }
      }
    });
  }

  onSubmit() {
    // console.log(this.orderForm.value)
    // if (!hasPermision(this.user?.role?.name) || !canValidate(this.user?.role?.name)) {
    //   // this.notificationService.error('No tienes privilegios para esta accion. Contacte un administrador.', { keepAfterRouteChange: true, });
    //   return;
    // }
    this.submitted = true;
    this.save();
  }

  dialogClose() {
    this.dialogRef.close(this.edited);
  }

  save() {
    // console.log(this.orderForm.getRawValue())
    this.repositoryService.create('lab-analysis-results/' /* + this.casoInfo.id */, this.orderForm.getRawValue()).pipe(first()).subscribe((data) => {
      // let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
      // dialogRef.afterClosed().subscribe(result => {
      //   setTimeout(() => {
      //     this.showConfirmDialog();
      // this.dialogRef.close(this.edited);
      //   });
      //   // this.location.back();
      // });

      // this.notificationService.success('Los resultados se han registrados satisfactoriamente.', { keepAfterRouteChange: true, });
      this.editMode = false;
      this.edited = true;
      this.toastr.success('Resultados Registrado Correctamente.', 'Laboratory App.');

      const resultValidated = this.orderForm.getRawValue().analiticsGroups.some((res: any) => res.analiticas.some((ana: any) => {
        return ana.variables.some((e: any) => e.result && e.resu_validado)
      }));

      console.log(resultValidated)

      if (resultValidated) {
        const myCompDialog = this.dialog.open(ConfirmDialogComponent,
          {
            data: {
              title: 'Resultados Registrado Correctamente.',
              subTitle: 'Desea imprimir el informe?',
              body: ''
            },
            width: '450px'
          }
        );
        myCompDialog.afterClosed().subscribe((res) => {
          const generatePrintDocument = new Promise(async (resolve, reject) => {
            resolve(await this.generatePdf('print'));
          });
          // Trigger After Dialog Closed 
          if (res) {

            switch (res.event) {
              case "yes-option":
                generatePrintDocument.then(() => { this.dialogRef.close(this.edited); }).catch((error: any) => { console.log(error); });
                break;
              case "no-option":
                console.log('No Clicked');
                break;
              case "maybe-option":
                console.log('May Be Clicked');
                break;
              default:
                break;
            }
          }
        });
      }
      // this.dialogRef.close(this.edited);
      // this.loadResults(this.obj);
    },
      (error) => {
        this.toastr.error(error.error.message);
        // this.errorService.dialogConfig = { ...this.dialogConfig };
        // this.errorService.handleError(error);
      })
  }

}
