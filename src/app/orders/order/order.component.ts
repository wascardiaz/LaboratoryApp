import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/shared/models/customer.model';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderItemsComponent } from '../order-items/order-items.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  customerList!: Customer[];
  isValid: boolean = true;

  constructor(public orderService: OrderService, private dialog: MatDialog, private customerService: CustomerService, private toastr: ToastrService,
    private router: Router, private currentRoute: ActivatedRoute, public loadingService: LoadingService) { }

  ngOnInit(): void {
    const id = this.currentRoute.snapshot.paramMap.get('id');
    if (id)
      this.orderService.getOrderById(parseInt(id)).subscribe({
        next: res => {
          if (res.body) {
            this.orderService.formData = res.body;
            this.orderService.orderItems = res.body.orderItems;
          }
        },
        error: error => {
          this.toastr.error(error.error.message);
          this.router.navigate(['orders']);
        }
      });
    else
      this.resetForm();
    this.customerService.getCustomerList().subscribe((lst: Customer[]) => this.customerList = lst);
  }

  resetForm(form?: NgForm) {
    if (form)
      form.resetForm();

    this.orderService.formData = {
      id: 0,
      orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      customerId: 0,
      pMethod: '',
      total: 0,
      deletedOrderItemsIds: ''
    }
    this.orderService.orderItems = [];
  }

  OrderItemAddEdit(orderItemIndex: number | null, orderId: number | undefined) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, orderId };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.UpdateGrandTotal();
    })
  }

  onOrderItemDelete(id: number | undefined, index: number) {
    console.log(id, index)
    if (id && id > 0 && this.orderService.formData)
      this.orderService.formData.deletedOrderItemsIds += id + ',';
    this.orderService.orderItems?.splice(index, 1);
    this.UpdateGrandTotal();
  }

  UpdateGrandTotal() {
    if (this.orderService.formData && this.orderService.orderItems) {
      this.orderService.formData.total = this.orderService.orderItems?.reduce((prev, curr) => {
        return prev + curr.total;
      }, 0);
      this.orderService.formData.total = parseFloat(this.orderService.formData.total?.toFixed(2));
    }
  }

  ValidateForm() {
    this.isValid = true;
    if (this.orderService.formData?.customerId == 0)
      this.isValid = false;
    else if (!this.orderService.orderItems?.length)
      this.isValid = false;
    return this.isValid;
  }

  OnSubmit(form: NgForm) {
    if (this.ValidateForm()) {
      this.orderService.saveOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'Laboratory App.');
        this.router.navigate(['orders']);
      })
    }
  }

}
