import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  orderList!: any[];

  constructor(private orderService: OrderService, private router: Router, private toastr: ToastrService, public loadingService: LoadingService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.orderService.getOrders().subscribe(res => this.orderList = res.body);
  }


  openForEdit(id: number) {
    this.router.navigate(['/orders/order/edit/' + id]);
  }

  onOrderDelete(id: number) {
    if (confirm('Are you sure to delete this order?')) {
      this.orderService.deleteOder(id).subscribe(() => {
        this.toastr.warning('Deleted Successfully', 'Laboratory App.');
        this.refreshList();
      });
    }
  }

}
