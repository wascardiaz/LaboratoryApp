import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/shared/models/item.model';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { ItemService } from 'src/app/shared/services/item.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsComponent implements OnInit {
  formData!: OrderItem;
  itemList!: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.itemService.getItemList().subscribe(lst => this.itemList = lst);
    if ((this.data.orderItemIndex || this.data.orderItemIndex == 0) && this.orderService.orderItems)
      this.formData = Object.assign({}, this.orderService.orderItems[this.data.orderItemIndex]);
    else
      this.formData = {
        id: 0,
        orderId: this.data.orderId,
        itemId: 0,
        itemName: '',
        price: 0,
        qty: 0,
        total: 0
      }
  }
  UpdatePrice(event: any) {
    if (event.selectedIndex == 0) {
      this.formData.price = 0;
      this.formData.itemName = '';
    }
    else {
      this.formData.qty = 1;
      this.formData.price = this.itemList[event.selectedIndex - 1].price;
      this.formData.itemName = this.itemList[event.selectedIndex - 1].name;
    }
    this.UpdateTotal();
  }
  UpdateTotal() {
    if (this.formData.qty && this.formData.price)
      this.formData.total = parseFloat((this.formData.qty * this.formData?.price).toFixed(2));
  }

  OnSubmit(form: NgForm) {
    if (this.ValidateForm(form.value)) {
      if ((this.data.orderItemIndex || this.data.orderItemIndex == 0) && this.orderService.orderItems)
        this.orderService.orderItems[this.data.orderItemIndex] = form.value;
      else
        this.orderService.orderItems?.push(form.value);
      this.dialogRef.close();
    }
  }

  ValidateForm(formData: OrderItem) {
    this.isValid = true;
    if (this.formData.itemId == 0)
      this.isValid = false;
    else if (this.formData.qty = 0)
      this.isValid = false;
    return this.isValid;
  }

}
