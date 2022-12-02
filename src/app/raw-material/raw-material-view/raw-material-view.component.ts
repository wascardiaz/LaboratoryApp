import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RawMaterial } from 'src/app/shared/models/raw-material.model';
import { Role } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-raw-material-view',
  templateUrl: './raw-material-view.component.html',
  styleUrls: ['./raw-material-view.component.scss']
})
export class RawMaterialViewComponent implements OnInit {
  rawMaterials: RawMaterial[] = [];
  role: Role | undefined;

  constructor(
    private rawMaterialService: RepositoryService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.rawMaterialService
      .getData('raw-materials')
      .subscribe((data: RawMaterial[]) => {
        this.rawMaterials = data;
      });
  }

  navigate(): void {
    this.router.navigate(['/dashboard/addrawmaterial']);
  }

}
