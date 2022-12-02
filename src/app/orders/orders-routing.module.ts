import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  // { path: '', redirectTo: 'orders', pathMatch: 'full' },
  {
    path: '', component: OrdersComponent, children: [
      { path: '', component: OrdersListComponent },
      { path: 'order', component: OrderComponent, children: [{ path: '', component: OrderComponent }, { path: 'edit/:id', component: OrderComponent }] }]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
