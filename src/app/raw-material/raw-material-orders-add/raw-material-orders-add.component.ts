import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Gender } from 'src/app/shared/models/gender.model';
import { RawMaterial } from 'src/app/shared/models/raw-material.model';
import { Supplier } from 'src/app/shared/models/supplier.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-raw-material-orders-add',
  templateUrl: './raw-material-orders-add.component.html',
  styleUrls: ['./raw-material-orders-add.component.scss']
})
export class RawMaterialOrdersAddComponent implements OnInit {
  genders = Gender;
  submitted = false;
  rawMaterialForm!: FormGroup;
  message: any = null;
  rawMaterials: RawMaterial[] = [];
  suppliers: Supplier[] = [];
  measurementUnit: string | undefined = 'Select Raw Material';

  constructor(
    private rawMateriOrderService: RepositoryService,
    private router: Router,
    private rawMaterialService: RepositoryService,
    private supplierService: RepositoryService
  ) {
    this.initForm();
    this.initSupplierDropdown();
    this.initRawmterialDropdown();
  }
  initSupplierDropdown() {
    this.supplierService
      .getData('suppliers')
      .subscribe((res: Supplier[]) => (this.suppliers = res));
  }
  initRawmterialDropdown() {
    this.rawMaterialService
      .getData('raw-materials')
      .subscribe((res: RawMaterial[]) => (this.rawMaterials = res));
  }

  ngOnInit(): void { }

  submitForm() {
    this.submitted = true;
    console.log(this.rawMaterialForm.value);

    if (this.rawMaterialForm.valid)
      this.createRawMaterial(this.rawMaterialForm.value);
  }

  createRawMaterial(formData: any) {
    this.rawMateriOrderService
      .create('raw-materials-order', formData)
      .subscribe(
        (response: any) => {
          this.message =
            'Successfully purchased Raw Material with Order ID ' +
            response['rawMaterialId'];
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard/rawmaterialorders');
          }, 3000);
        },
        (error) => {
          console.log(error);
          if (error.error.message === 'FieldException')
            error.error.errors.forEach((element: any) =>
              this.rawMaterialForm.controls[element.field]?.setErrors({
                serverValidationError: element.message,
              })
            );
          else throw new Error(error);
        }
      );
  }

  initForm() {
    this.rawMaterialForm = new FormGroup({
      rawMaterialId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      pricePerUnit: new FormControl('', [Validators.required]),
      qualityCheck: new FormControl('', [Validators.required]),
      deliveryDate: new FormControl('', [Validators.required]),
      expiryDate: new FormControl('', [Validators.required]),
      supplierId: new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.rawMaterialForm.controls }

  updateUnit(event: Event) {
    const id = (<HTMLInputElement>(event.target)).value
    this.measurementUnit = this.rawMaterials.find((rm: any) => rm.rawMaterialId == id)?.quantityUnit;
  }

}
