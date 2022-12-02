import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {
  dataSource = new MatTableDataSource<UserDetails>();
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Specify columns tht should be rendered, must match names of matColumnDef
  // ID is not beign displayed as its not present here
  displayedColumns: string[] = [
    'id',
    'username',
    // 'name',
    'role',
    // 'phoneNo',
    // 'city',
    'edit'
  ];
  userSubscription!: Subscription;

  constructor(
    private manageUserService: RepositoryService, // private store: Store<fromTraining.State>,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
  fetchAllUsers() {
    this.loadingService.enableLoading();
    this.userSubscription = this.manageUserService.getData(`users`).subscribe((response: UserDetails[]) => {
      this.dataSource.data = response;
      this.loadingService.disableLoading();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
