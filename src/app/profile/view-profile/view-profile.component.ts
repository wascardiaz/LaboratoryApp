import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  user!: UserDetails;

  constructor(
    public loadingService: LoadingService,
    private manageUser: RepositoryService,
    private authService: AuthService,
    private repository: RepositoryService
  ) {
    this.fetchUser();
  }

  fetchUser() {
    this.loadingService.enableLoading();
    this.manageUser.getData('users/' + this.authService.fetchFromSessionStorage()?.id).subscribe(
      (res: UserDetails) => {
        this.user = res;
        if (res.person?.id) {
          this.repository.getData(`people/${res.person.id}`).pipe(first()).subscribe(perRes => {
            perRes.address = perRes.addresses ? perRes.addresses[0] : {};
            res.person = perRes;
            this.user = res;
          });
        }
        this.loadingService.disableLoading();
      },
      (error) => {
        this.loadingService.disableLoading();
        throw new Error('No se puede conectar con el servidor');
      }
    );
  }

  ngOnInit(): void { }

}
