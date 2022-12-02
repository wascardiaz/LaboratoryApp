import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerAddComponent } from 'src/app/customer/customer-add/customer-add.component';
import { PatientSearchComponent } from 'src/app/patients/patient-search/patient-search.component';
import { AnalysisOrderItem } from 'src/app/shared/models/analysis-order-item.model';
import { AnalysisOrder } from 'src/app/shared/models/analysis-order.model';
import { Customer } from 'src/app/shared/models/customer.model';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { Patient } from 'src/app/shared/models/patient.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { AnalysisOrdersItemsComponent } from '../analysis-orders-items/analysis-orders-items.component';

@Component({
  selector: 'app-analysis-orders-add',
  templateUrl: './analysis-orders-add.component.html',
  styleUrls: ['./analysis-orders-add.component.scss']
})
export class AnalysisOrdersAddComponent implements OnInit {

  customerList!: Customer[];
  patientList!: Patient[];
  orderData: AnalysisOrder;
  // orderItems!: AnalysisOrderItem[];

  constructor(
    private analysisOrderService: RepositoryService,
    private repositoryService: RepositoryService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private location: Location,
    private authService: AuthService
  ) {
    this.orderData = new AnalysisOrder();
  }

  ngOnInit() {
    this.getCustomers();
    this.getPatients();
    this.resetForm();
  }

  getCustomers() {
    this.analysisOrderService.getData('customers').subscribe((lst: Customer[]) => {
      this.customerList = lst;
    });
  }

  getPatients() {
    this.analysisOrderService.getData('patients').subscribe((lst: Patient[]) => {
      lst.map((r: any) => {
        if (r.personId > 0)
          this.repositoryService.getData(`people/${r.personId}`).subscribe(p => r.person = p);
      });
      this.patientList = lst;
    });
  }

  resetForm(form?: NgForm) {
    if (form)
      form.resetForm();
  }

  addPatient() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      title: 'Pruebas y/o Estudios',
      subTitle: 'Esta seguro que desea agregar un nuevo item?',
      body: 'Haga click en SI para proceder, haga click en NO para ignorar.',
      // params,
    }
    this.dialog.open(PatientSearchComponent, dialogConfig).afterClosed().subscribe(res => {
      if (res) {
        this.orderData.patientId = res.id;
      }
    })
  }

  addCustomer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      title: 'Pruebas y/o Estudios',
      subTitle: 'Esta seguro que desea agregar un nuevo item?',
      body: 'Haga click en SI para proceder, haga click en NO para ignorar.',
      // params,
    }
    this.dialog.open(CustomerAddComponent, dialogConfig).afterClosed().subscribe(res => {
      if (res) {
        this.orderData.customerId = res.id;
        this.getCustomers();
      }
    })
  }

  OrderItemAddEdit(item: AnalysisOrderItem | null, orderId: number | undefined) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { item, orderId };
    this.dialog.open(AnalysisOrdersItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      if (res) {
        console.log(this.orderData);
        // const pExists = this.orderData?.cargos?.find(i => i.testId === res.testId);
        const pExists = this.orderData?.cargos?.find(i => i.testId === res.testId);
        if (pExists)
          pExists.qty = res.qty > 1 ? res.qty : pExists.qty + 1;
        else
          // this.orderItems?.push(res);
          this.orderData.cargos?.push(res);
        this.UpdateGrandTotal();
      }
    })
  }

  onOrderItemDelete(id: number | undefined, index: number) {
    if (id && id > 0 && this.orderData)
      this.orderData.deletedOrderItemsIds += id + ',';
    // this.orderItems?.splice(index, 1);
    this.orderData?.cargos?.splice(index, 1);
    this.UpdateGrandTotal();
  }

  UpdateGrandTotal() {
    // if (this.orderData && this.orderItems) {
    if (this.orderData && this.orderData.cargos) {
      // this.orderData.total = parseFloat(this.orderItems?.reduce((prev, curr) => {
      this.orderData.total = parseFloat(this.orderData.cargos?.reduce((prev, curr) => {
        return Number(prev) + Number(curr.total);
      }, 0)?.toFixed(2));
    }
  }

  public onCancel = () => {
    this.location.back();
  }

  placeOrder(form?: NgForm) {

    // if (!this.orderItems.length)
    if (!this.orderData.cargos?.length)
      return ("Sin contenido.");

    if (form?.invalid) return "Formulario Incompleto."

    this.orderData.userId = this.authService.userValue?.id;

    // console.log({ ...this.orderData, cargos: this.orderItems } as AnalysisOrder);
    // console.log(this.orderData);

    if (this.orderData.id && this.orderData.id > 0) {
      // this.updateExistsOrder({ ...this.orderData, cargos: this.orderItems } as AnalysisOrder);
      this.updateExistsOrder(this.orderData);
    }
    else {
      // this.createNewOrder({ ...this.orderData, cargos: this.orderItems } as AnalysisOrder);
      this.createNewOrder(this.orderData);
    }

    return;

  }

  updateExistsOrder(obj: any) {
    this.analysisOrderService
      .update(`hos-cases/${obj.id}`, obj)
      .subscribe((x) => {
        this.resetForm();
        this.toastr.success('Orden Actualizada Correctamente', 'Laboratory App.');
        this.router.navigate(['/dashboard/analysisorders']);
      });
  }
  createNewOrder(obj: any) {
    this.analysisOrderService
      .create('hos-cases', obj)
      .subscribe((x) => {
        this.resetForm();
        this.toastr.success('Orden Guardada Correctamente', 'Laboratory App.');
        this.router.navigate(['/dashboard/analysisorders']);
      });
  }

}
