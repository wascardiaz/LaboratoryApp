import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/helpers/my-error-state-matcher';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { EquitmentInteface } from 'src/app/shared/models/equitment-interface';
import { AnalysisGroup } from 'src/app/shared/models/lab-analysis-group.model';
import { AnalysisSubGroup } from 'src/app/shared/models/lab-analysis-sub-group.model';
import { LabAnalyVarType } from 'src/app/shared/models/lab-analysis-variable-type.model';
import { LabAnalysisVariable } from 'src/app/shared/models/lab-analysis-variable.model';
import { LabAnalysis } from 'src/app/shared/models/lab-analysis.model';
import { LabEquipment } from 'src/app/shared/models/lab-equipment.model';
import { LabLaboratory } from 'src/app/shared/models/lab-laboratory.model';
import { LabMethod } from 'src/app/shared/models/lab-method.model';
import { LabSampleContainer } from 'src/app/shared/models/lab-sample-container';
import { LabSampleType } from 'src/app/shared/models/lab-sample-type';
import { LabUnit } from 'src/app/shared/models/lab-unid.model';
import { PersonGender } from 'src/app/shared/models/person.model';
import { Studio } from 'src/app/shared/models/studio.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-analysis-add',
  templateUrl: './analysis-add.component.html',
  styleUrls: ['./analysis-add.component.scss']
})
export class AnalysisAddComponent implements OnInit {
  analysis: LabAnalysis;
  productId!: number;
  orderStatus!: string;

  pruebas: Studio[] = [];
  analysisGroupSource: AnalysisGroup[] | undefined;
  analysisSubGroupSource: AnalysisSubGroup[] | undefined;
  analysisSampleTypeSource: LabSampleType[] | undefined;
  analysisSampleContainerSource: LabSampleContainer[] | undefined;
  analysisMethodSource: LabMethod[] | undefined;
  analysisEquipmentSource: /* LabEquipment */EquitmentInteface[] | undefined;
  analysisLaboratorySource: LabLaboratory[] | undefined;
  laboratoryUnitSource: LabUnit[] | undefined;
  laboratoryAnalyVarTypeSource: LabAnalyVarType[] | undefined;

  personGenderSouruce: PersonGender[] | undefined;

  unit: string | undefined = 'Select Prueba';
  validationDate = new Date().toISOString().slice(0, 10);
  quantity!: string;
  price!: string;

  data!: any[];
  form!: FormGroup;

  matcher = new MyErrorStateMatcher();

  get f() { return this.form.controls; }

  get fv() {
    return <FormArray>this.form.get('variables');
  }

  getVbleValues(index: number) {
    return (<FormArray>(<FormArray>this.form.get('variables')).controls[index].get('lab_analysis_variable_values'));
  }

  constructor(
    private repository: RepositoryService,
    private productService: RepositoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private fb: FormBuilder,
    private location: Location,
  ) {
    // this.productOrderRequest = new ProductOrderRequest();
    this.analysis = new LabAnalysis();
  }

  ngOnInit() {

    this.GetTest();
    this.GetAnalysisGroup();
    this.GetAnalysisSubGroup();

    this.GetAnalysisSampleType();
    this.GetAnalysisSampleContainer();
    this.GetAnalysisMethod();
    this.GetAnalysisEquipment();

    this.GetAnalysisLaboratory();
    this.GetLaboratoryUnits();
    this.GetLabAnalyVbleType();

    this.getPersonGender();

    // this.loadData();
    this.form = this.fb.group({
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
      variables: this.fb.array([])
    });

    this.activeRoute.queryParams.subscribe((params: any) => {
      if (params.analyId) {
        this.loadingService.enableLoading();
        this.repository.getData(`lab-analysies/${params.analyId}`).subscribe((response: LabAnalysis) => {
          this.loadingService.disableLoading();
          this.analysis = response;
          this.form = this.fb.group({
            ...response,
            variables: this.fb.array(this.getVBles(response.variables))
          });
        })
      }
    });
  }

  getVBles(dictionaries: LabAnalysisVariable[]) {
    return dictionaries.map(vble => this.fb.group({
      id: vble.id,
      analyId: vble.analyId,
      unitId: vble.unitId,
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
      lab_analysis_variable_values: this.fb.array(this.getVBleValue(vble.lab_analysis_variable_values))

    }));
  }

  getVBleValue(values: any[]) {
    return values.map(value => this.fb.group({
      id: value.id,
      vbleId: value.vbleId,
      mtdoId: value.mtdoId,
      vbleSecuencia: value.vbleSecuencia,
      sex: value.sex,
      from: value.from,
      to: value.to,
      min: value.min,
      max: value.max,
      value: value.value,
      text: value.text,
      alarmMin: value.alarmMin,
      alarmMax: value.alarmMax,
      default: value.default,
      // attributes: this.fb.array(this.getAttributes(group.attributes))
    }));
  }

  addVbleFormGroup() {
    return this.fb.group({
      id: [null],
      analyId: [null],
      unitId: [null],
      typeCode: [null, [Validators.required]],
      Vble_ID: [null],
      secuencia: [null],
      analySecuencia: [null],
      description: [null, [Validators.required]],
      type: [null],
      analyVNormales: [null],
      groupId: [null],
      send: [null],
      interface: [null],
      status: [null],
      lab_analysis_variable_values: this.fb.array([])
    })
  }

  addVbleValueFormGroup() {
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
      default: [null]
    })
  }

  newVble() {
    this.fv.push(this.addVbleFormGroup())
  }

  newVbleValue(index: number) {
    this.getVbleValues(index).push(this.addVbleValueFormGroup());
  }

  removeVble(index: number) {
    this.fv.removeAt(index);
  }

  removeVbleValue(vbleIndex: number, valueIndex: number) {
    this.getVbleValues(vbleIndex).removeAt(valueIndex);
  }

  public hasVarError = (index: number, controlName: string, errorName: string) => {
    return (<any>(<FormArray>this.fv.at(index)).get(controlName)).hasError(errorName);
  }

  public hasVarValError = (index: number, subIndex: number, controlName: string, errorName: string) => {
    const r = ((<FormArray>(<FormArray>this.fv.at(index)).get('lab_analysis_variable_values')).at(subIndex)).get(controlName);
    // console.log(r)
    return r?.hasError(errorName);
  }

  drop(fa: FormArray, event: CdkDragDrop<string[]>) {
    // moveItemInArray(this.av.controls, event.previousIndex, event.currentIndex);
    const formArray = fa;
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(formArray, from, to);
  }

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);

    if (from === to) {
      return;
    }

    const previous = formArray.at(from);
    const current = formArray.at(to);
    // formArray.setControl(to, previous);
    // formArray.setControl(from, current);

    const currentGroup = formArray.at(from);
    formArray.removeAt(from);
    formArray.insert(to, currentGroup);
  }

  /** Clamps a number between zero and a maximum. */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

  getSelectedOptionText(event: Event) {
    const id = (<HTMLInputElement>(event.target)).value
    // this.distributorId = parseInt(id, 10);
  }

  selectPrueba(event: Event) {
    const pruebaId = (<HTMLInputElement>(event.target)).value;
    this.analysis = new LabAnalysis();
    // this.pruebaId = parseInt(pruebaId, 10);
    if (parseInt(pruebaId) > 0) {
      if (this.analysis.id && this.analysis.id > 0) {
        this.form.patchValue(this.analysis)
      }
      
      this.repository.getData(`lab-analysies/?testId=${pruebaId}`).subscribe((response: any) => {
        if (response) {
          this.analysis = response.records[0];
          this.form.patchValue(this.analysis)
        }
        else {
          this.analysis.testId = parseInt(pruebaId);
          this.analysis.description = this.pruebas.find((p: Studio) => p.id == parseInt(pruebaId))?.description;
          this.form.patchValue(this.analysis)
          // this.f['description'].setValue(this.pruebas.find((p: Studio) => p.id == parseInt(pruebaId))?.description);
        }
      });
    }
    else {
      this.analysis.testId = parseInt(pruebaId);
      this.analysis.description = this.pruebas.find((p: Studio) => p.id == parseInt(pruebaId))?.description;
      this.form.patchValue(this.analysis)
    }
    // this.unit = this.pruebas.find((p: Studio) => p.id == pruebaId)?.quantityUnit;
  }

  GetTest() { this.productService.getData('tests').subscribe((response: Studio[]) => { this.pruebas = response; }); }
  GetAnalysisGroup() { this.repository.getData('lab-group-analysies').subscribe((lst: AnalysisGroup[]) => { this.analysisGroupSource = lst; }); }
  GetAnalysisSubGroup() { this.repository.getData('lab-sub-group-analysies').subscribe((lst: AnalysisSubGroup[]) => { this.analysisSubGroupSource = lst; }); }
  GetAnalysisSampleType() { this.repository.getData('lab-sample-types').subscribe((lst: LabSampleType[]) => { this.analysisSampleTypeSource = lst; }); }
  GetAnalysisSampleContainer() { this.repository.getData('lab-sample-containers').subscribe((lst: LabSampleContainer[]) => { this.analysisSampleContainerSource = lst; }); }
  GetAnalysisMethod() { this.repository.getData('lab-methods').subscribe((lst: LabMethod[]) => { this.analysisMethodSource = lst; }); }
  GetAnalysisEquipment() { this.repository.getData('lab-equipments').subscribe((lst: /* LabEquipment */EquitmentInteface[]) => { this.analysisEquipmentSource = lst; }); }
  GetAnalysisLaboratory() { this.repository.getData('lab-laboratories').subscribe((lst: LabLaboratory[]) => { this.analysisLaboratorySource = lst; }); }
  GetLaboratoryUnits() { this.repository.getData('lab-unids').subscribe((lst: LabUnit[]) => { this.laboratoryUnitSource = lst; }); }
  GetLabAnalyVbleType() { this.repository.getData('lab-analysis-variable-types').subscribe((lst: LabAnalyVarType[]) => { this.laboratoryAnalyVarTypeSource = lst; }); }

  getPersonGender() { this.repository.getData('person-gender').pipe().subscribe((lst: PersonGender[]) => { this.personGenderSouruce = lst; }); }

  placeOrder() {
    // this.productOrderRequest.productId = this.productId;
    // this.productOrderRequest.quantity = Number(this.quantity);
    // this.productOrderRequest.pricePerUnit = Number(this.price);
    // this.productOrderRequest.qualityCheck = 'Passed';
    // this.productOrderRequest.distributorId = this.distributorId;
    // console.log(this.form.getRawValue());
    if (this.analysis.id && this.analysis.id > 0)
      this.repository.update(`lab-analysies/${this.analysis.id}`, this.form.getRawValue()).subscribe((x) => {
        this.router.navigate(['/dashboard/analysis']);
      });
    else
      this.repository.create('lab-analysies', this.form.getRawValue()).subscribe((x) => {
        this.router.navigate(['/dashboard/analysis']);
      });

  }

  public onCancel = () => {
    this.location.back();
  }

  loadData() {
    this.data = [{
      "id": 1,
      "analyId": 1,
      "unitId": '',
      "typeCode": '',
      "Vble_ID": '',
      "secuencia": '',
      "analySecuencia": '',
      "description": '',
      "type": '',
      "analyVNormales": '',
      "groupId": '',
      "send": '',
      "interface": '',
      "status": '',
      "lab_analysis_variable_values": [{
        "name": "Main Heading",
        "contentid": 767,
        "value": "Multitasking",
        "translationvalue": "Realización de varias tareas al mismo tiempo",
        "placeholder": "Main Heading",
        "label": "Main Heading",
        "defaultvalue": "",
        "type": "text",
        "element": "input",
        "altered": false,
        "translation_id": 3063,
        "isnew": false
      },
      {
        "name": "Sub-Heading",
        "contentid": 155,
        "value": "Driver Attitude",
        "translationvalue": "Actitud del conductor",
        "placeholder": "Type Heading",
        "label": "Sub-Heading",
        "defaultvalue": "",
        "type": "text",
        "element": "input",
        "altered": false,
        "translation_id": 3064,
        "isnew": false
      },
      {
        "name": "Full-Screen Image",
        "contentid": 211,
        "value": "/media/lessons/dst/intro/image01-right.jpg",
        "translationvalue": null,
        "placeholder": "Image Url",
        "label": "Full-Screen Image",
        "defaultvalue": "",
        "type": "image",
        "element": "input",
        "altered": false,
        "translation_id": null,
        "isnew": true
      },
      {
        "name": "Full-Screen Image",
        "contentid": 212,
        "value": "/media/lessons/dst/intro/image01-left.jpg",
        "translationvalue": null,
        "placeholder": "Image Url",
        "label": "Full-Screen Image",
        "defaultvalue": "",
        "type": "image",
        "element": "input",
        "altered": false,
        "translation_id": null,
        "isnew": true
      },
      {
        "name": "Full-Screen Image",
        "contentid": 213,
        "value": "/media/lessons/dst/intro/image01-right.jpg",
        "translationvalue": null,
        "placeholder": "Image Url",
        "label": "Full-Screen Image",
        "defaultvalue": "",
        "type": "image",
        "element": "input",
        "altered": false,
        "translation_id": null,
        "isnew": true
      },
      {
        "name": "Full-Screen Image Alt",
        "contentid": 880,
        "value": "Multitasking - Driver Attitude",
        "translationvalue": "Multitasking - Driver Attitude",
        "placeholder": "Full-Screen Image Alt",
        "label": "Full-Screen Image Alt",
        "defaultvalue": "",
        "type": "alt",
        "element": "input",
        "altered": false,
        "translation_id": 3062,
        "isnew": false
      },
      {
        "name": "Icon SVG Data",
        "contentid": 3063,
        "value": "",
        "translationvalue": null,
        "placeholder": "SVG Data",
        "label": "Icon SVG Data",
        "defaultvalue": "",
        "type": "html",
        "element": "textarea",
        "altered": false,
        "translation_id": null,
        "isnew": true
      }
      ]
    },
    {
      "id": 2,
      "analyId": 1,
      "unitId": '',
      "typeCode": '',
      "Vble_ID": '',
      "secuencia": '',
      "analySecuencia": '',
      "description": '',
      "type": '',
      "analyVNormales": '',
      "groupId": '',
      "send": '',
      "interface": '',
      "status": '',
      "lab_analysis_variable_values": [{
        "name": "Question Text",
        "contentid": 956,
        "value": "Welcome to the Multitasking exercise. Before we begin, please select the statement that best describes your current view on the subject.",
        "translationvalue": "Bienvenido al ejercicio sobre realización de varias tareas al mismo tiempo. Antes de comenzar, seleccione la afirmación que mejor describa su opinión actual sobre el tema.",
        "placeholder": "Question Text",
        "label": "Question Text",
        "defaultvalue": "",
        "type": "textarea",
        "element": "textarea",
        "altered": false,
        "translation_id": 3462,
        "isnew": false
      },
      {
        "name": "Randomize Answers",
        "contentid": 1100,
        "value": "1",
        "translationvalue": null,
        "placeholder": "Randomize Answers",
        "label": "Randomize Answers",
        "defaultvalue": "2",
        "type": "truefalse",
        "element": "select",
        "altered": false,
        "translation_id": null,
        "isnew": true
      }
      ]
    }]
  }

}
