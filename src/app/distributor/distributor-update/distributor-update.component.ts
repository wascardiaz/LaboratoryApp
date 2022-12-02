import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Distributor } from 'src/app/shared/models/distributor.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-distributor-update',
  templateUrl: './distributor-update.component.html',
  styleUrls: ['./distributor-update.component.scss']
})
export class DistributorUpdateComponent implements OnInit {
  id!: number;
  distributor!: Distributor;
  constructor(
    private route: ActivatedRoute,
    private service: RepositoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.distributor = new Distributor();
    this.id = this.route.snapshot.params['id'];
    this.service.getData('distributors/' + this.id).subscribe((data: Distributor) => { this.distributor = data; },
      (error) => console.log(error)
    );
  }

  updateDistributor() {
    this.service.update(`distributors/${this.id}`, this.distributor).subscribe(
      (data) => {
        this.distributor = new Distributor();
        this.gotoList();
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    this.updateDistributor();
  }
  
  gotoList() {
    this.router.navigate(['/dashboard/distributors']);
  }

}
