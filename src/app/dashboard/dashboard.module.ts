import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from '../users/users.component';
import { ViewUsersComponent } from '../users/view-users/view-users.component';
import { AddUsersComponent } from '../users/add-users/add-users.component';
import { EditProfileComponent } from '../profile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from '../profile/view-profile/view-profile.component';
import { SupplierComponent } from '../supplier/supplier.component';
import { SupplierAddComponent } from '../supplier/supplier-add/supplier-add.component';
import { SupplierUpdateComponent } from '../supplier/supplier-update/supplier-update.component';
import { SupplierViewComponent } from '../supplier/supplier-view/supplier-view.component';
import { DistributorComponent } from '../distributor/distributor.component';
import { DistributorViewComponent } from '../distributor/distributor-view/distributor-view.component';
import { DistributorAddComponent } from '../distributor/distributor-add/distributor-add.component';
import { DistributorUpdateComponent } from '../distributor/distributor-update/distributor-update.component';
import { ProdutComponent } from '../produt/produt.component';
import { ProductViewComponent } from '../produt/product-view/product-view.component';
import { ProductAddComponent } from '../produt/product-add/product-add.component';
import { ProductUpdateComponent } from '../produt/product-update/product-update.component';
import { ProductOrdersAddComponent } from '../produt/product-orders-add/product-orders-add.component';
import { ProductOrdersViewComponent } from '../produt/product-orders-view/product-orders-view.component';
import { RawMaterialComponent } from '../raw-material/raw-material.component';
import { RawMaterialViewComponent } from '../raw-material/raw-material-view/raw-material-view.component';
import { RawMaterialAddComponent } from '../raw-material/raw-material-add/raw-material-add.component';
import { RawMaterialUpdateComponent } from '../raw-material/raw-material-update/raw-material-update.component';
import { RawMaterialOrdersViewComponent } from '../raw-material/raw-material-orders-view/raw-material-orders-view.component';
import { RawMaterialOrdersAddComponent } from '../raw-material/raw-material-orders-add/raw-material-orders-add.component';
import { AnalysisComponent } from '../analysis/analysis.component';
import { AnalysisViewComponent } from '../analysis/analysis-view/analysis-view.component';
import { AnalysisAddComponent } from '../analysis/analysis-add/analysis-add.component';
import { AnalysisUpdateComponent } from '../analysis/analysis-update/analysis-update.component';
import { AnalysisOrdersAddComponent } from '../analysis/analysis-orders-add/analysis-orders-add.component';
import { AnalysisOrdersViewComponent } from '../analysis/analysis-orders-view/analysis-orders-view.component';
import { AnalysisOrdersItemsComponent } from '../analysis/analysis-orders-items/analysis-orders-items.component';
import { PatientsComponent } from '../patients/patients.component';
import { PatientSearchComponent } from '../patients/patient-search/patient-search.component';
import { PatientAddComponent } from '../patients/patient-add/patient-add.component';
import { PersonFormComponent } from '../patients/person-form/person-form.component';
import { CustomerComponent } from '../customer/customer.component';
import { CustomerAddComponent } from '../customer/customer-add/customer-add.component';
import { CustomerUpdateComponent } from '../customer/customer-update/customer-update.component';
import { CustomerListComponent } from '../customer/customer-list/customer-list.component';
import { AnalysisOrdersEditComponent } from '../analysis/analysis-orders-edit/analysis-orders-edit.component';
import { LabOrderComponent } from '../lab-order/lab-order.component';
import { LabOrderListComponent } from '../lab-order/lab-order-list/lab-order-list.component';
import { LabOrderAddComponent } from '../lab-order/lab-order-add/lab-order-add.component';
import { LabOrderUpdateComponent } from '../lab-order/lab-order-update/lab-order-update.component';
import { LabOrderItemComponent } from '../lab-order/lab-order-item/lab-order-item.component';
import { AnalysisResultListComponent } from '../analysis/analysis-result-list/analysis-result-list.component';
import { PatientListComponent } from '../patients/patient-list/patient-list.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    ViewUsersComponent,
    AddUsersComponent,
    EditProfileComponent,
    ViewProfileComponent,
    SupplierComponent,
    SupplierAddComponent,
    SupplierUpdateComponent,
    SupplierViewComponent,
    DistributorComponent,
    DistributorViewComponent,
    DistributorAddComponent,
    DistributorUpdateComponent,
    ProdutComponent,
    ProductViewComponent,
    ProductAddComponent,
    ProductUpdateComponent,
    ProductOrdersAddComponent,
    ProductOrdersViewComponent,
    RawMaterialComponent,
    RawMaterialViewComponent,
    RawMaterialAddComponent,
    RawMaterialUpdateComponent,
    RawMaterialOrdersViewComponent,
    RawMaterialOrdersAddComponent,
    AnalysisComponent,
    AnalysisViewComponent,
    AnalysisAddComponent,
    AnalysisUpdateComponent,
    AnalysisOrdersAddComponent,
    AnalysisOrdersViewComponent,
    AnalysisOrdersItemsComponent,
    PatientsComponent,
    PatientSearchComponent,
    PatientAddComponent,
    PersonFormComponent,
    CustomerComponent,
    CustomerAddComponent,
    CustomerUpdateComponent,
    CustomerListComponent,
    AnalysisOrdersEditComponent,
    LabOrderComponent,
    LabOrderListComponent,
    LabOrderAddComponent,
    LabOrderUpdateComponent,
    LabOrderItemComponent,
    AnalysisResultListComponent,
    PatientListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule { }
