import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs";
import { MyErrorStateMatcher } from "src/app/helpers/my-error-state-matcher";
import { ConfirmDialogComponent } from "src/app/shared/dialogs/confirm-dialog/confirm-dialog.component";
import { AnalysisOrderItem } from "src/app/shared/models/analysis-order-item.model";
import { LabSample, LabSampleDetails } from "src/app/shared/models/lab-sample";
import { LabSampleType } from "src/app/shared/models/lab-sample-type";
import { Medic } from "src/app/shared/models/medic.model";
import { editorRoles } from "src/app/shared/models/user.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";
import { RepositoryService } from "src/app/shared/services/repository.service";

import JsBarcode from 'jsbarcode';
import { PdfService } from "src/app/shared/services/pdf.service";
import { AnalysisOrder } from "src/app/shared/models/analysis-order.model";

@Component({
  selector: 'app-analysis-orders-edit',
  templateUrl: './analysis-orders-edit.component.html',
  styleUrls: ['./analysis-orders-edit.component.scss']
})
export class AnalysisOrdersEditComponent implements OnInit {
  orderColums: string[] = ['recpId', 'recpDate', 'recpTime', 'userId', 'action'];
  orderSource = new MatTableDataSource<LabSample>([]);
  @ViewChild('orderPaginator', { static: true }) orderPaginator!: MatPaginator;
  // @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;

  testColums: string[] = ['test', 'date', 'time', 'action'];
  testSource = new MatTableDataSource<AnalysisOrderItem>([]);
  @ViewChild('studioPaginator', { static: true }) studioPaginator!: MatPaginator;
  // @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;

  orderContentColums: string[] = ['mues_descripcion', 'reng_descripcion', 'grup_descripcion', 'recp_fecha', 'requ_numero', 'mues_estatus', 'actions']
  orderContentSource = new MatTableDataSource<LabSampleDetails>([]);
  @ViewChild('orderContentPaginator', { static: true }) orderContentPaginator!: MatPaginator;
  // @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;

  testSourceTmp: any = null;

  // activeMuestra!: LabSampleDetails;
  isEditMode: boolean = false;

  // data = Object.assign([]);
  selection = new SelectionModel<any>(true, []);
  // account!: Account | null;
  master = 'Master';
  // codeValue: any = '';
  // form!: FormGroup;
  orderForm!: FormGroup;
  studioDetailForm!: FormGroup;
  casoInfo: any = null;
  medicoSource: any = null;

  field = true;
  // loading$ = this.loader.loading$;
  submitted = false;
  editMode: boolean = false;
  resultsLength = 0;
  isRateLimitReached = false;

  selectedTabIndex = 0;

  matcher = new MyErrorStateMatcher();

  // muesStatus = STATUS_ELEMENT;

  // muesPriorityStatus = MUESTRA_PRIORITY_ELEMENT;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private pdfService: PdfService,
    private repository: RepositoryService,
    // private errorService: ErrorHandlerService,
    private router: Router,
    public loadingService: LoadingService
  ) {
    // this.authService.account.subscribe(x => this.account = x);
    // this.form = this.initfrmFormGroup();
    this.orderForm = this.initOrderFormGroup();
    this.studioDetailForm = this.initStudioFormGroup();
    this.GetMedicos();
  }

  ngOnInit(): void {
    this.orderSource.paginator = this.orderPaginator;
    this.testSource.paginator = this.studioPaginator;
    this.orderContentSource.paginator = this.orderContentPaginator;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['caseId'])
        this.GetDetailInfo(params)
    });

  }

  generateBarcodePdf(action = 'open') {
    this.loadingService.enableLoading();
    const documentDefinition: any = this.getDocumentDefinition();

    this.pdfService.generatePdf(action, documentDefinition);

    /* switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition, undefined).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    } */
    this.loadingService.disableLoading()
  }

  getDocumentDefinition() {
    return {
      // pageSize: { width: 170.08, height: 'auto' },
      // pageSize: { width: 144, height: 72 },
      pageSize: { width: 169.92, height: 84.96 },
      // pageSize: 'A4',
      // pageOrientation: 'landscape',
      // pageOrientation: 'portrait',
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      // pageMargins: [0, 0],
      pageMargins: [6.48, 12.96, 0, 6.48],
      content: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 143,
              h: 71.5,
              r: 4,
              lineColor: 'red',
              color: '#ffffe0',
            }
          ],
          absolutePosition: { x: 0, y: 0 }
        },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 144,
              h: 65,
              r: 4,
              lineColor: 'blue',
              color: '#ffffe0',
            }
          ],
          absolutePosition: { x: 12.96, y: 12.96 }
        },
        this.getBarcodes()
      ],
      info: {
        title: this.casoInfo.nombres + '_Orden_Laboratorio',
        author: 'Centro Médico Santana Taveras, S. A.',
        subject: 'Laboratory identifer',
        keywords: 'LABORATORY, ONLINE RESULT ORDER',
      },
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          // decoration: 'underline'
        },
        name: {
          fontSize: 6,
          bold: true
        },
        sign: {
          margin: [0, 0, 0, 2],
          // fontSize: 4,
          bold: true,
          italics: true
        },
        // icon: { font: 'Icomoon', bold: true, color: "#553322", fontSize: 10 }
      },
      defaultStyle: {
        columnGap: 4,
        fontSize: 5
      }
    };
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

  getBarcodes() {
    if (!this.orderContentSource.data.length)
      return [];

    const barcodes: any = [];


    const sexInfo = (genderId: number, dateOfBirth: string) => {
      let gender = '';
      const age = this.getAge(dateOfBirth);
      this.repository.getData(`person-gender/${genderId}`).pipe(first()).subscribe((x: any) => { if (x) gender = x.name.substring(0, 1).toUpperCase() });
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

    barcodes.push({
      stack: [
        { text: 'Centro Médico Santana Taveras, S. A.', style: 'header', margin: [0, 3, 0, 2], },
        { text: `${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}`, style: 'name' },
        `${sexInfo(this.casoInfo?.patient?.person?.genderId, this.casoInfo?.patient?.person?.dateOfBirth)}`,
        // { qr: `${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}` + ', Contact No : ' + this.casoInfo.id, fit: 30 },
        // { image: this.textToBase64Barcode(`C${this.casoInfo.origen.substring(0, 1)}${this.casoInfo.id}-L${this.orderForm.value.recp_numero}`),/*  width: 100, */ margin: [0, 1] },
        { image: this.textToBase64Barcode(`C${this.casoInfo?.origen ? this.casoInfo?.origen.substring(0, 1) : ''}${this.casoInfo?.id}`),/*  width: 100, */ margin: [0, 1] },
        // { text: `C${this.casoInfo.origen.substring(0, 1)}${this.casoInfo.id}-L${this.orderForm.value.recp_numero}`, style: 'sign' },
        // { text: `C${this.casoInfo.origen.substring(0, 1)}${this.casoInfo.id}`, style: 'sign' },
        { text: `Usuario: ${this.casoInfo?.patient?.web_usuario}, Clave: ${this.casoInfo?.patient?.web_clave}`, style: 'sign' },
        // `Médico: ${this.casoInfo.medico}`,
        `${new Date(this.orderForm?.value.recpDate).toLocaleDateString()} * ${this.orderForm?.value.recpTime} ${this.casoInfo?.origen ? ' * ' + this.casoInfo?.origen : ''}`,],
      alignment: 'center',
      // margin: [4, 6]
    });

    // console.log(this.casoInfo)

    let group: number | null = null;
    let stack: string | null = null;
    this.orderContentSource.data.forEach((ana: LabSampleDetails, index: number) => {
      // barcodes.push({ text: '', pageOrientation: 'portrait', pageSize: { width: 189, height: 'auto' }, pageBreak: 'before' });

      // if (group !== ana.sampleTypeId && index > 0) {
      //   barcodes.push([{ pageBreak: 'before' }])
      // } else {

      // }

      if (!group) {
        group = ana.sampleTypeId;
        stack = stack ? `,${stack}, ${ana.testDescription}` : `${ana.testDescription}`;
      }
      else if (group && group !== ana.sampleTypeId) {
        stack += ` - ${ana.sampleDescription}`;
        barcodes.push([{
          stack: [
            { text: 'Centro Médico Santana Taveras, S. A.', style: 'header', margin: [0, 0, 0, 2], },
            { text: `${this.casoInfo?.patient?.person?.firstName} ${this.casoInfo?.patient?.person?.lastName}`, style: 'name' },
            `${sexInfo(this.casoInfo?.patient?.person?.genderId, this.casoInfo?.patient?.person?.dateOfBirth)}`,
            // { qr: this.casoInfo.nombres + ', Contact No : ' + this.casoInfo.id, fit: 30 },
            { image: this.textToBase64Barcode(`L${this.orderForm.value.id}-P${ana.id}`)/*,  width: 100,  margin: [0, 3]*/ },
            { text: `C${this.casoInfo?.id}-L${this.orderForm.value.id}-P${ana.id}`, style: 'sign' },
            // `${ ana.testDescription } - ${ ana.sampleDescription } `,
            stack,
            // `Médico: ${ this.casoInfo.medico } `,
            `${new Date(this.orderForm?.value.recpDate).toLocaleDateString()} * ${this.orderForm?.value.recpTime} ${this.casoInfo?.origen ? ' * ' + this.casoInfo?.origen : ''} `
          ],
          pageBreak: 'before',
          alignment: 'center'
        }]);
        stack = null;
        group = ana.sampleTypeId;
      }
      else {
        stack = stack ? `,${stack}, ${ana.testDescription}` : `${ana.testDescription}`;
      }

      /*  barcodes.push(
         // { text: 'Text on Landscape', style: 'icon', pageOrientation: 'landscape', pageBreak: 'before' },
         // {
         //   text: [
         //     { text: "left-circled", font: "Fontello" }, //icon gift
         //     { text: "ru", style: 'icon' }]
         // },
         // { text: 'Text on Landscape', pageOrientation: 'landscape', pageBreak: 'before' },
         // { text: 'Text on Landscape 2', pageOrientation: 'portrait', pageBreak: 'before' },
         // { text: 'Text on Landscape 2', pageOrientation: 'portrait', pageBreak: 'after' },
         //   { text: 'Text on Portrait 2' }
       ); */
    });

    return barcodes;
  }

  textToBase64Barcode(text: string) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
      // lineColor: "#0aa",
      width: 1,
      height: 14,
      displayValue: false,
      // fontSize: 12,
      // format: "CODE39",
      // textMargin: 0,
      margin: 2
    });
    return canvas.toDataURL("image/png");
  }

  hasAnalysis(studio: AnalysisOrderItem): boolean {
    // console.log(studio);
    let status: boolean = false;
    // return !!this.repository.getData(`lab-analysies/?testId=${studio.testId}`).subscribe(analytic => {
    //   if (analytic) return true;
    //   else return false
    // });
    return status;
  }

  initfrmFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      nombres: [null],
      apellidos: [null],
      cedula: [null],
      telefono: [null, Validators.required],
      sexo: [null, [Validators.required, Validators.pattern('[MF]*')]],
      fechaNacimiento: [null, Validators.required],
      edad: [null],
      fecha: [null],
      origen: [null],
      histori: [null],
      habitacion: [null],
      seguro: [null],
      poliza: [null],
      autorizacion: [null],
      mdcoId: [null],
      medico: [null],
      diagnostico: [null],
      estatus: [null]
    });
  }

  initOrderFormGroup(): FormGroup {
    return this.fb.group({
      id: [{ value: null, disabled: false }],
      caseId: [{ value: null, disabled: false }, [Validators.required]],
      recpDate: [new Date, [Validators.required]],
      recpTime: [new Date(Date.now()).toISOString(), [Validators.required]],
      recpNote: null,
      mdcoId: null,
      status: null,
      userId: [this.authService.userValue?.id, [Validators.required]],
      created: [new Date(Date.now()), [Validators.required]],
      updated: null,
      details: this.fb.array([])
    });
  }

  initStudioFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      recpId: [null],
      groupId: [null],
      testId: [null],
      caseId: [null],
      cargId: [null],
      resuId: [null],
      sampleLote: [null],
      samplePrioridad: [null],
      casoCondiciones: [null],
      samplePeriodo: [null],
      sampleRecord: [null],
      sampleCodigo: [null],
      sampleRecogida: [null],
      sampleHora: [null],
      sampleProceso: [null],
      sampleEnvasada: [null],
      sampleTemperatura: [null],
      sampleCaduce: [null],
      sampleCondiciones: [null],
      sampleEstatus: [null],
      resuEntrega: [null],
      sampleDate: [null],
      sampleUpdated: [null],
      sampleDescription: null,
      testDescription: null,
      groupDescription: null,
    })
  }

  addSampleFormGroup(): FormGroup {
    return this.fb.group({
      // id: [null],
      recpId: [null],
      groupId: [null],
      testId: [null],
      caseId: [null],
      cargId: [null],
      resuId: [null],
      sampleLote: [null],
      samplePrioridad: [null],
      casoCondiciones: [null],
      samplePeriodo: [null],
      sampleRecord: [null],
      sampleCodigo: [null],
      sampleRecogida: [null],
      sampleHora: [null],
      sampleProceso: [null],
      sampleEnvasada: [null],
      sampleTemperatura: [null],
      sampleCaduce: [null],
      sampleCondiciones: [null],
      sampleEstatus: [null],
      resuEntrega: [null],
      sampleDate: [null],
      sampleUpdated: [null],
      sampleDescription: null,
      testDescription: null,
      groupDescription: null,
    })
  }

  // convenience getter for easy access to form fields
  // get f() { return this.form.controls; }
  get g() { return this.orderForm.controls; }

  get orderDetailArray(): FormArray {
    return <FormArray>(this.orderForm.get('details'));
  }

  // Cargamos la lista de medicos
  GetMedicos() { this.repository.getData('medics').pipe(first()).subscribe((lst: any) => this.medicoSource = lst.records as Medic[]) }

  GetDetailInfo(params: any) {
    this.repository.getData(`hos-cases/pending/${params.caseId}`).pipe(first()).subscribe((data: AnalysisOrder) => {
      if (data) {
        this.casoInfo = data;
        this.testSource.data = this.casoInfo.cargos;
        this.RefreshOrdersAndStudiosList(params);
      }
    })
  }

  RefreshOrdersAndStudiosList(params: any) {
    this.GetOrders(params);
    // Cargamos la lista de estudio segun el caso.
    // this.repository.getData(`tests/${params.caseId}`).pipe(first()).subscribe((test: any) => {
    //   // this.data = Object.assign(test); 
    //   console.log(test)
    //   this.testSource.data = test;
    // });
  }

  GetOrders(params: any) {
    // Cargamos las ordenes si existen segun el caso
    this.repository.getData(`lab-sample-receptions?caseId=${params.caseId}`).pipe(first()).subscribe((orders: LabSample[]) => {
      if (orders && orders.length) {
        this.orderSource.data = orders;
        const recpId = parseInt(params.recpId, 10);
        this.loadOrderDetails(recpId > 0 ? orders.find((o: any) => o.id === recpId) : orders[0], params);
      }
      else this.selectedTabIndex = 1;
    });
  }

  loadOrderDetails(order: any, params: any) {
    this.editMode = false;
    order.mdcoId = this.casoInfo?.mdcoId ? this.casoInfo?.mdcoId : order.mdcoId;
    order.recpDate = order.recpDate.slice(0, 10)
    this.orderForm.patchValue(order);

    this.orderDetailArray.clear();
    this.orderContentSource.data = [];
    // this.studioDetailForm.patchValue(this.orderDetailArray.at(0).value);

    // Cargamos los detalles de las ordenes
    this.repository.getData(`lab-sample-reception-details?caseId=${params.caseId}&recpId=${order.id}&groupBy=sampleType`).pipe(first()).subscribe((sampleDetailTypes: LabSampleDetails[]) => {
      // console.log(sampleDetailTypes)
      sampleDetailTypes.forEach((sdt: any) => {
        this.repository.getData(`lab-sample-reception-details?caseId=${params.caseId}&recpId=${order.id}&stId=${sdt.sampleTypeId}`).pipe(first()).subscribe((sampleDetails: LabSampleDetails[]) => {
          // console.log(sampleDetails)
          let rowSpn = sampleDetails.length;
          sampleDetails.forEach((e: any, index: number) => {
            this.repository.getData(`lab-analysies/${e.analyId}?include=all`).pipe().subscribe((la: any) => {
              // console.log(la);
              e.groupDescription = la.group.name;
              e.testDescription = la.test.description;
              e.analysisGroupId = la.analysisGroupId;
              e.sampleDescription = la.sampleType.name;

            });
            if (e.sampleTypeId)
              this.repository.getData(`lab-sample-types/${e.sampleTypeId}`).pipe().subscribe((sType: LabSampleType) => {
                if (sType) {
                  e.sampleDescription = sType.name;
                }
              });
            if (!e.sampleHora)
              e.sampleHora = new Date();
            if (index === 0) e.rowspn = rowSpn;
            this.orderContentSource.data.push(e);
            const orderFormGroup = this.addSampleFormGroup();
            orderFormGroup.patchValue(e);
            this.orderDetailArray.push(orderFormGroup);
          })
        })
      });
    });
  }

  fieldsetToggle() { this.field = !this.field; }

  editToggle() {
    this.editMode = !this.editMode;
    this.orderForm.patchValue({
      // orderUserChangeCode: this.acc.email,
      orderUserChangeFecha: (new Date).toLocaleString(),
    })
  }

  newOrder() {
    this.submitted = false;
    this.editToggle();
    this.orderForm = this.initOrderFormGroup();
    this.orderDetailArray.clear();
    // this.orderContentSource.data = this.orderContentSource.data.filter((o) => { return o !== o });
    this.orderContentSource.data = [];
    this.selectedTabIndex = 1;
    this.orderForm.patchValue({
      caseId: this.casoInfo?.id,
      // caso_org: this.casoInfo?.origen,
      recpDate: new Date(Date.now()).toJSON().slice(0, 10),
      recpTime: (new Date()).toTimeString().slice(0, 5),
      // recp_fecha: new Date(Date.now()).toJSON().slice(0, 10),
      // recp_hora: (new Date(Date.now())).toTimeString().slice(0, 5),
      mdcoId: this.casoInfo.mdcoId,
      userId: this.authService.userValue?.id,
      // user_fecha: new Date(Date.now()),// (new Date).toJSON().slice(0, 10),
      status: true
    });
  }

  addOrderDetails(test: any) {
    // console.log(test)
    // Cargamos las analiticas segun prueba o etest
    this.repository.getData(`lab-analysies/?testId=${test.testId}&include=all`).pipe(first()).subscribe((la: any[]) => {
      la.forEach((e: any, index: number) => {
        e.rowspn = index + 1;
        e.groupDescription = e.group.name;
        e.testDescription = e.test.description;
        e.analysisGroupId = e.analysisGroupId;
        e.sampleDescription = e.sampleType.name;
        e.caseId = this.casoInfo.id;
        e.analyId = e.id
        // e.testId = test.testId;
        // e.groupId = test.grupoId;
        e.cargId = test.cargId;
        e.recpDate = new Date();
        e.sampleHora = new Date();
        e.sampleRecogida = new Date(Date.now());
        e.sampleProceso = new Date(Date.now());
        e.sampleEnvasada = new Date(Date.now());
        e.sampleCaduce = new Date(Date.now());
        e.resuEntrega = new Date(Date.now());
        e.sampleEstatus = 1;
        // e.reqId = test.reqId;
        e.cargSecuenciaId = test.secuencia;
        delete e.id;

        this.orderContentSource.data.push(e as LabSampleDetails);
        // console.log(this.orderContentSource.data)
        this.orderContentSource.data.sort(this.compareSample);
        this.orderContentSource.data = this.orderContentSource.data.map(o => { return o; });
        this.testSource.data = this.testSource.data.filter((o) => { return o !== test ? o : false; });
      });
    },
      (error) => {
        // this.errorService.handleError(error);
        this.loadingService.disableLoading()
      });
  }

  compareSample(a: LabSampleDetails, b: LabSampleDetails) {
    return a.sampleTypeId - b.sampleTypeId;
  }

  removeOrderDetailFromOrder(element: any) {
    /* Si no hay novedad regresamos */
    if (/* !this.testSourceTmp || !this.testSourceTmp.length || */ this.orderForm.value.recp_numero > 0) {
      window.alert('Solo se pueden retirar pruebas agregadas recientemente y de ordenes que no se hayan guardado previamente.!');
      return;
    }

    const myCompDialog = this.dialog.open(ConfirmDialogComponent,
      {
        width: '450px',
        data: {
          title: 'Quitar Prueba de la Lista',
          subTitle: 'Seguro que desea retirar esta prueba?',
          body: 'Haga click en SI para retirar la prueba. La misma volvera a la lista de Pruebas Pendientes'
        }
      }
    );
    myCompDialog.afterClosed().subscribe((res) => {
      // Trigger After Dialog Closed 
      if (res) {

        switch (res.event) {
          case "yes-option":
            this.orderContentSource.data = this.orderContentSource.data.filter((o) => { return o !== element });
            this.orderDetailArray.controls = this.orderDetailArray.controls.filter(e => { return e !== element });

            const std = {
              id: element.caso_numero,
              studioId: element.reng_codigo,
              grupoId: element.grup_codigo,
              reqId: element.requ_numero,
              cargId: element.carg_id,
              studio: element.reng_descripcion
            } as any;

            this.testSource.data.push({ ...std });
            this.testSource.data = this.testSource.data.map(o => {
              return o;
            });

            break;
          case "no-option":
            // console.log('No Clicked');
            break;
          case "maybe-option":
            // console.log('May Be Clicked');
            break;
          default:
            break;
        }
      }
    });
  }

  editOrder() {
    this.submitted = false;
    this.editToggle();
    this.orderForm.patchValue({
      user_change: this.authService.userValue?.id,
      fech_change: new Date().toLocaleString(),
    })
  }

  goBack() {
    const myCompDialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          title: 'Cancelar Orden',
          subTitle: 'Seguro que desea cancelar la orden ?',
          body: 'Haga click en SI para cancelar, haga click en No para ignorar.'
        }
      }
    );
    myCompDialog.afterClosed().subscribe((res) => {
      // Trigger After Dialog Closed 
      if (res) {

        switch (res.event) {
          case "yes-option":
            this.orderForm = this.initOrderFormGroup();
            this.orderContentSource.data = this.orderContentSource.data.filter((o) => { return o !== o });
            this.orderDetailArray.clear();
            this.testSourceTmp = null;
            this.selectedTabIndex = 0;
            this.editToggle();
            this.GetDetailInfo({ caseId: this.casoInfo?.id, org: this.casoInfo?.origen });
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

  anularOrder() {
    if (!editorRoles.includes(this.authService.userValue?.role?.name || '')) {
      // this.notificationService.error('No tienes privilegios para esta accion. Contacte un administrador.', { keepAfterRouteChange: true, });
      return;
    }
    window.alert('Orden Anulada');
    return;
  }

  showConfirmDialog(): void {
    const myCompDialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          title: 'Imprimir Etitiqueta',
          subTitle: 'Desea imprimir la(s) etiqueta(s)?',
          body: 'Las etiquetas son idenfiticadores adesivos para colocar a las muestras.'
        },
        width: '450px'
      }
    );
    myCompDialog.afterClosed().subscribe((res) => {
      // Trigger After Dialog Closed 
      if (res) {

        switch (res.event) {
          case "yes-option":
            console.log('Yes Clicked');
            this.generateBarcodePdf('print');
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

  public redirectToDetails = (sample: LabSample) => {
    // let url: string = `/ results / muestras / details / ${ id } `;
    // this.router.navigate([url]);
    this.router.navigate(['/dashboard/updateanalysisorder'], { queryParams: { caseId: sample.caseId, recpId: sample.id } });
  }

  redirectToAnalysisResultEdit(sample: LabSample) {
    // this.router.navigate(['/dashboard/updateanalysisorder', id]);
    this.router.navigate(['/dashboard/updateanalysisresult'], { queryParams: { caseId: sample.caseId, recpId: sample.id } });

  }

  public redirectToReport = (oId: string) => {
    // let url: string = `/ results / muestras / edit / ${ id } `;
    // this.router.navigate([url]);
    this.router.navigate(['/results/muestras/edit'], { queryParams: { caseId: this.casoInfo.id, recpId: oId } })
  }

  onSubmit() {
    // return;
    // if (!editorRoles.includes(this.authService.userValue?.role?.name || '')) {
    //   // this.notificationService.error('No tienes privilegios para esta accion. Contacte un administrador.', { keepAfterRouteChange: true, });
    //   return;
    // }

    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.orderForm.invalid || !this.orderContentSource.data.length) {
      window.alert('No has agregado ningun estudio. La orden no se ha guardado.');
      return;
    }

    const sendObj = {
      ...this.orderForm.getRawValue(),
      details: this.orderContentSource.data
    }

    // disabled edit mode
    this.editToggle();
    this.loadingService.enableLoading();
    // console.log(sendObj)
    this.save(sendObj);
  }

  save(params: any) {
    this.repository.create(`lab-sample-receptions`, params).pipe(first()).subscribe((data) => {
      // this.alertService.success('Orden guardada corectamente', { keepAfterRouteChange: true, });
      // this.notificationService.success('Orden guardada corectamente', { keepAfterRouteChange: true, });
      this.loadingService.disableLoading()
      this.GetDetailInfo({ caseId: this.casoInfo?.id, org: this.casoInfo?.origen, });
      this.selectedTabIndex = 0;
      this.showConfirmDialog();
      //this.router.navigate(['.', { relativeTo: this.route }]);
    },
      (error) => {
        // this.alertService.error(error);
        // this.errorService.handleError(error);
        this.loadingService.disableLoading()
        // disabled edit mode
        this.editToggle();
      })
  }

}
