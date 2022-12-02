import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { Warehouse } from 'src/app/shared/models/warehouse.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  product: Product;
  warehouses: Warehouse[] = [];
  warehouseId!: number;

  constructor(
    private service: RepositoryService,
    private warehouseService: RepositoryService,
    private router: Router
  ) {
    this.product = new Product();
    this.warehouseService.getData('warehouses').subscribe((data: Warehouse[]) => {
      this.warehouses = data;
    });
  }

  ngOnInit(): void {
    this.product = new Product();
  }

  saveProduct(formData: any) {
    let warhouse = new Warehouse();
    this.product.quantityAvailable = 0;
    warhouse.id = +formData.warehouseId;
    this.product.warehouse = warhouse;
    this.service.create('products', this.product).subscribe((res) => {
      this.router.navigate(['/dashboard/products']);
    });
  }

}
