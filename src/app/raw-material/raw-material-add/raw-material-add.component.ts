import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RawMaterial } from 'src/app/shared/models/raw-material.model';
import { Warehouse } from 'src/app/shared/models/warehouse.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-raw-material-add',
  templateUrl: './raw-material-add.component.html',
  styleUrls: ['./raw-material-add.component.scss']
})
export class RawMaterialAddComponent implements OnInit {
  rawMaterial!: RawMaterial;
  warehouses: Warehouse[] = [];

  constructor(
    private rawMaterialService: RepositoryService,
    private warehouseService: RepositoryService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.rawMaterial = new RawMaterial();
    this.warehouseService.getData('warehouses').subscribe((data: Warehouse[]) => {
      this.warehouses = data;
    });
  }

  saveRawMaterial(formData: any) {
    let warehouse = new Warehouse();
    this.rawMaterial.quantityAvailable = 0;
    warehouse.id = +formData.warehouse;
    this.rawMaterial.warehouse = warehouse;

    this.rawMaterialService
      .create('raw-materials', this.rawMaterial)
      .subscribe((res) => {
        this.router.navigate(['/dashboard/rawmaterials'])
      });
  }

}
