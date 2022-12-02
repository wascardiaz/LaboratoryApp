import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ProductOrder } from 'src/app/shared/models/temporalModelsForInventoryProject';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { UpdateStatusComponent } from 'src/app/shared/update-status/update-status.component';

@Component({
  selector: 'app-product-orders-view',
  templateUrl: './product-orders-view.component.html',
  styleUrls: ['./product-orders-view.component.scss']
})
export class ProductOrdersViewComponent implements OnInit {
  dataSource = new MatTableDataSource<ProductOrder>();
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Specify columns tht should be rendered, must match names of matColumnDef
  // ID is not beign displayed as its not present here 
  displayedColumns: string[] = [
    'productOrderId',
    'productName',
    'pricePerUnit',
    'orderedOn',
    'distributorName',
    'quantity',
    'orderStatus',
  ];
  userSubscription!: Subscription;

  constructor(
    private productOrderService: RepositoryService,
    public loadingService: LoadingService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
  fetchAllUsers() {
    this.loadingService.enableLoading();
    this.userSubscription = this.productOrderService
      .getData('product-orders')
      .subscribe((response: ProductOrder[]) => {
        this.dataSource.data = response;
        this.loadingService.disableLoading();
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  updateStatus(element:any) {
    const dialogRef = this.dialogRef.open(UpdateStatusComponent, {
      data: element
    })
    dialogRef.afterClosed().subscribe(result => {
      this.fetchAllUsers();
    })
  }

}
