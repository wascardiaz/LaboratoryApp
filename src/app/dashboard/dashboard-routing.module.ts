import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisAddComponent } from '../analysis/analysis-add/analysis-add.component';
import { AnalysisOrdersAddComponent } from '../analysis/analysis-orders-add/analysis-orders-add.component';
import { AnalysisOrdersEditComponent } from '../analysis/analysis-orders-edit/analysis-orders-edit.component';
import { AnalysisOrdersViewComponent } from '../analysis/analysis-orders-view/analysis-orders-view.component';
import { AnalysisResultListComponent } from '../analysis/analysis-result-list/analysis-result-list.component';
import { AnalysisUpdateComponent } from '../analysis/analysis-update/analysis-update.component';
import { AnalysisViewComponent } from '../analysis/analysis-view/analysis-view.component';
import { CustomerListComponent } from '../customer/customer-list/customer-list.component';
import { DistributorAddComponent } from '../distributor/distributor-add/distributor-add.component';
import { DistributorUpdateComponent } from '../distributor/distributor-update/distributor-update.component';
import { DistributorViewComponent } from '../distributor/distributor-view/distributor-view.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { LabOrderAddComponent } from '../lab-order/lab-order-add/lab-order-add.component';
import { LabOrderListComponent } from '../lab-order/lab-order-list/lab-order-list.component';
import { LabOrderUpdateComponent } from '../lab-order/lab-order-update/lab-order-update.component';
import { PatientListComponent } from '../patients/patient-list/patient-list.component';
import { ProductAddComponent } from '../produt/product-add/product-add.component';
import { ProductOrdersAddComponent } from '../produt/product-orders-add/product-orders-add.component';
import { ProductOrdersViewComponent } from '../produt/product-orders-view/product-orders-view.component';
import { ProductViewComponent } from '../produt/product-view/product-view.component';
import { EditProfileComponent } from '../profile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from '../profile/view-profile/view-profile.component';
import { RawMaterialAddComponent } from '../raw-material/raw-material-add/raw-material-add.component';
import { RawMaterialOrdersAddComponent } from '../raw-material/raw-material-orders-add/raw-material-orders-add.component';
import { RawMaterialOrdersViewComponent } from '../raw-material/raw-material-orders-view/raw-material-orders-view.component';
import { RawMaterialViewComponent } from '../raw-material/raw-material-view/raw-material-view.component';
import { SupplierAddComponent } from '../supplier/supplier-add/supplier-add.component';
import { SupplierUpdateComponent } from '../supplier/supplier-update/supplier-update.component';
import { SupplierViewComponent } from '../supplier/supplier-view/supplier-view.component';
import { AddUsersComponent } from '../users/add-users/add-users.component';
import { UsersComponent } from '../users/users.component';
import { ViewUsersComponent } from '../users/view-users/view-users.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path:'lab-orders', component: LabOrderListComponent},
      {path:'lab-order-add', component: LabOrderAddComponent, canActivate: [RoleGuard], data: {role:'Admin'}},
      {path:'lab-order-update', component: LabOrderUpdateComponent, canActivate: [RoleGuard], data: {role:'Admin'}},
      {
        path: 'analysis',
        component: AnalysisViewComponent,
      },
      {
        path: 'addanalysis',
        component: AnalysisAddComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'updateanalysisorder',
        component: AnalysisOrdersEditComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      { path: 'analysisorders', component: AnalysisOrdersViewComponent },
      { path: 'addanalysisorder', component: AnalysisOrdersAddComponent },
      { path: 'analysisresults', component: AnalysisResultListComponent },
      {
        path: 'updateanalysisresult',
        component: AnalysisUpdateComponent,
        canActivate: [RoleGuard],
        // data: { role: 'Admin' },
      },
      {
        path: 'products',
        component: ProductViewComponent,
      },
      {
        path: 'addproduct',
        component: ProductAddComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      { path: 'productorders', component: ProductOrdersViewComponent },
      { path: 'addproductorder', component: ProductOrdersAddComponent },
      {
        path: 'rawmaterials',
        component: RawMaterialViewComponent,
      },
      {
        path: 'addrawmaterial',
        component: RawMaterialAddComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      { path: 'rawmaterialorders', component: RawMaterialOrdersViewComponent },
      { path: 'addrawmaterialorder', component: RawMaterialOrdersAddComponent },
      {
        path: 'patients',
        component: PatientListComponent,
      },
      {
        path: 'customers',
        component: CustomerListComponent,
      },
      {
        path: 'suppliers',
        component: SupplierViewComponent,
      },
      {
        path: 'addsupplier',
        component: SupplierAddComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'distributors',
        component: DistributorViewComponent,
      },
      {
        path: 'adddistributors',
        component: DistributorAddComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'updatesupplier/:id',
        component: SupplierUpdateComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'updatedistributor/:id',
        component: DistributorUpdateComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'users', component: UsersComponent, children: [{
          path: '',
          component: ViewUsersComponent,
          canActivate: [RoleGuard],
          data: { role: 'Admin' },
        },
        {
          path: 'add',
          component: AddUsersComponent,
          canActivate: [RoleGuard],
          data: { role: 'Admin' },
        }]
      },
      {
        path: 'editprofile/:id',
        component: EditProfileComponent,
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
      },
      { path: 'viewprofile', component: ViewProfileComponent },
      { path: 'editprofile', component: EditProfileComponent },
      { path: '', component: ViewProfileComponent },
      { path: '**', redirectTo: '/404' },
    ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
