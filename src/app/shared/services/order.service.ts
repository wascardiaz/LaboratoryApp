import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, dematerialize, materialize, of, throwError } from 'rxjs';
import { OrderItem } from '../models/order-item.model';
import { Order } from '../models/order.model';

let orders: any[] = [];

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData?: Order;
  orderItems?: OrderItem[];

  constructor(private http: HttpClient) { }

  saveOrder() {
    let order: any;
    if (!this.formData)
      return error("Sin contenido.");

    console.log({ ...this.formData, orderItems: this.orderItems });

    if (this.formData.id && this.formData.id > 0) {
      order = orders.find((x: any) => x.id === this.formData?.id);
      if (order) {
        this.orderItems = this.orderItems?.map((x: any, i: any) => { x.id = i + 1; x.orderId = order?.id; return x });

        Object.assign(order, { ...this.formData, orderItems: this.orderItems });
      }

      return ok();
    }

    this.formData.id = orders.length + 1;
    this.orderItems = this.orderItems?.map((x: any, i: any) => { x.id = i + 1; x.orderId = this.formData?.id; return x });

    orders.push({ ...this.formData, orderItems: this.orderItems });

    return ok();
  }

  getOrders() {
    return ok(orders);
  }

  getOrderById(id: number) {
    let order = orders.find((x: any) => x.id === id);
    if (order)
      return ok(order);
    else
      return error('No se ha encontrado la Orden con ID:' + id);
  }

  deleteOder(id: number) {
    orders = orders.filter(o => o.id != id)
    return ok();
  }

}

function error(message: string) {
  return throwError({ error: { message } }).pipe(materialize(), delay(500), dematerialize());
}

function ok(body?: any) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
}
