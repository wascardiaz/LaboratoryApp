import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { Role } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  products: Product[] = [];
  role!: Role | undefined;

  constructor(
    private productService: RepositoryService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.productService.getData('products').subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  navigate(): void {
    this.router.navigate(['/dashboard/addproduct']);
  }

}
