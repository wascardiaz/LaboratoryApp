import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderComponent } from './order/order.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OrdersListComponent } from './orders-list/orders-list.component';


@NgModule({
  declarations: [  
    OrdersComponent,
    OrdersListComponent,
    OrderComponent,
    OrderItemsComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersModule { }
