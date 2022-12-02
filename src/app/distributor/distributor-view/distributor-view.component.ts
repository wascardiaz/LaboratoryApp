import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { Role } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-distributor-view',
  templateUrl: './distributor-view.component.html',
  styleUrls: ['./distributor-view.component.scss']
})
export class DistributorViewComponent implements OnInit {
  distributor!: Distributor;
  distributors!: Distributor[];
  role: Role | undefined;
  constructor(
    private distributorService: RepositoryService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.distributorService.getData('distributors').subscribe((response: Distributor[]) => { this.distributors = response; });
  }

  updateDistributor(id: number) {
    this.router.navigate(['/dashboard/updatedistributor', id]);
  }

}
