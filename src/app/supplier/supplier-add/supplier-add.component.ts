import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/shared/models/supplier.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.scss']
})
export class SupplierAddComponent implements OnInit {
  supplier: Supplier;
  supplierForm!: FormGroup;
  submitted = false;

  get f() { return this.supplierForm.controls }
  
  constructor(private service: RepositoryService, private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private toastr: ToastrService) {
    this.supplier = new Supplier();
  }

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      id: [null],
      rnc: [null],
      cedula: [null],
      razon_social: [null, [Validators.required, Validators.pattern("([a-zA-Z', .-]+( [a-zA-Z', .-]+)*){2,30}")]],
      nombre_comercial: [null, [Validators.required, Validators.pattern("([a-zA-Z', .-]+( [a-zA-Z', .-]+)*){2,30}")]],
      contacto: [null],
      web_site: [null],
      api_url: [null],
      comentario: [null],
      categoria: [null],
      grupo: [null],
      email: [null],
      local: [null],
      tipo: [null],
      mercado: [null],
      cuenta: [null],
      address: [null],
      direccion: [null],
      sector: [null],
      ciudad: [null],
      lugar_tipo: [null],
      lug_nombre: [null],
      lug_numero: [null],
      lug_apto: [null],
      sect_codigo: [null],
      ciud_codigo: [null],
      zona_codigo: [null],
      oficina: [null],
      telefono: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      fax: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      movil: [null, [Validators.pattern("[7-9][0-9]{9}")]],
      limite_credito: [null],
      fecha_corte: [null],
      descto_pago: [null],
      pago_codigo: [null],
      grup_codigo: [null],
      itbis: [null],
      descto: [null],
      mone_codigo: [null],
      apertura: [null],
      limite: [null],
      nucf_grupo: [null],
      nucf_prefijo: [null],
      dgii_tipo: [null],
      inve_grupo: [null],
      porc_itbis: [null],
      porc_retencion: [null],
      dgii_costo: [null],
      clas_codigo: [null],
      dpto_codigo: [null],
      tipodoc: [null],
      porc_isr: [null],
      bcos_cuenta: [null],
      bcos_codigo: [null],
      plan_codigo: [null],
      userId: [this.authService.userValue?.id]
    })
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.supplierForm.invalid) {
      return;
    }

    this.loadingService.enableLoading();
    this.addCustomer();
  }

  addCustomer() {
    this.service.create('suppliers', this.supplierForm.getRawValue()).subscribe({
      next: () => {
        this.loadingService.disableLoading;
        this.toastr.success('El cliente ha sido creado correctamente.', 'Laboratory App.');
        this.router.navigate(['/dashboard/suppliers']);
      },
      error: error => {
        this.loadingService.disableLoading;
      }
    });
  }

}
