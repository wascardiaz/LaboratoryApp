import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { ProductOrderRequest } from 'src/app/shared/models/product-order-request.model';
import { Product } from 'src/app/shared/models/product.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-product-orders-add',
  templateUrl: './product-orders-add.component.html',
  styleUrls: ['./product-orders-add.component.scss']
})
export class ProductOrdersAddComponent implements OnInit {
  productOrderRequest;
  distributor: Distributor[] = [];
  distributorId!: number;
  productId!: number;
  orderStatus!: string;
  products: Product[] = [];
  unit: string | undefined = 'Select Product';
  validationDate = new Date().toISOString().slice(0, 10);
  quantity!: string;
  price!: string;

  constructor(
    private productOrderService: RepositoryService,
    private productService: RepositoryService,
    private router: Router,
    private distributorService: RepositoryService
  ) {
    this.productOrderRequest = new ProductOrderRequest();
  }

  ngOnInit() {
    this.distributorService
      .getData('distributors')
      .subscribe((response: Distributor[]) => {
        this.distributor = response;
        console.log(this.distributor);
      });
    this.productService.getData('products').subscribe((response: Product[]) => {
      this.products = response;
    });
  }

  getSelectedOptionText(event: Event) {
    const id = (<HTMLInputElement>(event.target)).value
    this.distributorId = parseInt(id, 10);
  }

  selectProduct(event: Event) {
    console.log(event);
    const productId = (<HTMLInputElement>(event.target)).value
    this.productId = parseInt(productId, 10);
    this.unit = this.products.find((p: any) => p.productId == productId)?.quantityUnit;
  }

  placeOrder() {
    this.productOrderRequest.productId = this.productId;
    this.productOrderRequest.quantity = Number(this.quantity);
    this.productOrderRequest.pricePerUnit = Number(this.price);
    this.productOrderRequest.qualityCheck = 'Passed';
    this.productOrderRequest.distributorId = this.distributorId;

    this.productOrderService
      .create('product-order-requests', this.productOrderRequest)
      .subscribe((x) => {
        this.router.navigate(['/dashboard/productorders']);
      });

  }

}
