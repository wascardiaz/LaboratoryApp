import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-distributor-add',
  templateUrl: './distributor-add.component.html',
  styleUrls: ['./distributor-add.component.scss']
})
export class DistributorAddComponent implements OnInit {
  distributor: Distributor;
  constructor(private service: RepositoryService, private router: Router, private authService: AuthService) {
    this.distributor = new Distributor();
  }

  ngOnInit(): void { }

  addDistributor() {
    this.distributor.userId = this.authService.userValue?.id;
    this.service.create('distributors', this.distributor).subscribe((res) => {
      this.router.navigate(['/dashboard/distributors']);
    });
  }

}
