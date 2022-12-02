import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/shared/models/customer.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormSubmitModalService } from 'src/app/shared/services/form-submit-modal.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {
  id!: number;
  customer: Customer;
  customerForm!: FormGroup;
  submitted = false;

  get f() { return this.customerForm.controls }

  constructor(
    public dialogRef: MatDialogRef<CustomerUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any,
    private repositoryService: RepositoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private formModal: FormSubmitModalService
  ) {
    if (!mydata.id)
      this.dialogRef.close();
    else
      this.id = mydata.id

    this.customer = new Customer();
  }

  ngOnInit(): void {
    this.customer = new Customer();

    this.customerForm = this.fb.group({
      id: [null],
      cust_descripcion: [null, [Validators.required, Validators.pattern("([a-zA-Z', .-]+( [a-zA-Z', .-]+)*){2,30}")]],
      nucf_grupo: [null],
      nucf_lote: [null],
      cust_contacto: [null],
      cust_website: [null],
      cust_api_url: [null],
      cust_email: [null],
      cust_documtos: [null],
      cust_autorizacion: [null],
      cust_envios: [null],
      cust_formato: [null],
      cust_medcmtos: [null],
      cust_cirugia: [null],
      cust_direccion: [null],
      cust_lug_tipo: [null],
      cust_lug_nombre: [null],
      cust_lug_numero: [null],
      cust_lug_apto: [null],
      sect_codigo: [null],
      ciud_codigo: [null],
      cust_telefono: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      cust_fax: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      cust_celular: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      cust_beeper: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      cust_contrato: [null],
      cust_limite: [null],
      cust_ini_contrato: [null],
      cust_fin_contrato: [null],
      cust_fecha_corte: [null],
      cust_porc_descto: [null],
      pago_codigo: [null],
      cust_rnc: [null],
      ctas_numero: [null],
      grup_codigo: [null],
      cust_comentario: [null],
      cust_estatus: [null],
      cust_referencia: [null],
      naci_codigo: [null],
      cust_web_site: [null],
      cust_local: [null],
      ctas_debito: [null],
      ctas_credito: [null],
      ctas_itbis: [null],
      ctas_descto: [null],
      ctas_retencion: [null],
      cust_tipo: [null],
      cust_movil: [null],
      cust_oficina: [null],
      cust_limite_credito: [null],
      cust_descto_pago: [null],
      ctas_isr: [null],
      cust_categoria: [null],
      cust_grupo: [null],
      cust_descto: [null],
      mone_codigo: [null],
      cust_apertura: [null],
      nucf_prefijo: [null],
      dgii_tipo: [null],
      inve_grupo: [null],
      porc_itbis: [null],
      porc_retencion: [null],
      dgii_costo: [null],
      clas_codigo: [null],
      dpto_codigo: [null],
      userId: [this.authService.userValue?.id]
    });
    if (this.id) {
      this.repositoryService.getData('customers/' + this.id).subscribe(
        (data: Customer) => {
          this.customer = data;
          this.customerForm.patchValue(data);
        },
        (error) => console.log(error)
      );
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerForm.invalid) {
      return;
    }

    this.loadingService.enableLoading();
    this.updateCustomer();
  }

  updateCustomer() {
    if (this.authService.userValue?.id)
      this.customer.userId = this.authService.userValue?.id
    this.repositoryService.update(`customers/${this.id}`, this.customerForm.getRawValue()).subscribe({
      // next: () => {
      //   this.loadingService.disableLoading;
      //   this.toastr.success('El cliente ha sido creado correctamente.', 'Laboratory App.');
      //   this.dialogRef.close(true);
      // },
      // error: error => {
      //   this.loadingService.disableLoading;
      // }
      next: (response: any) => {
        this.loadingService.disableLoading();
        this.formModal.open(response.message, '/dashboard/customers');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loadingService.disableLoading();
        if (error?.error?.message === 'FieldException')
          error.error.errors.forEach((element: any) => {
            this.f[element.field]?.setErrors({ serverValidationError: element.message })
          }
          );
        else throw new Error(error);
      }
    });
  }
}
