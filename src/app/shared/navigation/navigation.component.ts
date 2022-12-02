import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public user!: User;
  paths = [
    // {
    //   route: '/orders',
    //   class: 'fas fa-flask',
    //   label: 'Lab Orders',
    //   role: 'User',
    // },
    {
      route: '/dashboard/lab-orders',
      class: 'fas fa-flask',
      label: 'Facturas',
      role: 'Admin',
    },
    {
      route: '/dashboard/analysisorders',
      class: 'fas fa-flask',
      label: 'Analysis Order',
      role: 'Admin',
    },
    {
      route: '/dashboard/analysisresults',
      class: 'fas fa-flask',
      label: 'Analysis Results',
      role: 'User',
    },
    {
      route: '/dashboard/analysis',
      class: 'fas fa-vial',
      label: 'Analysis',
      role: 'Admin',
    },
    // {
    //   route: '/dashboard/productorders',
    //   class: 'fas fa-truck-moving',
    //   label: 'Products Orders',
    //   role: 'User',
    // },
    // {
    //   route: '/dashboard/products',
    //   class: 'fas fa-boxes',
    //   label: 'Products',
    //   role: 'User',
    // },
    // {
    //   route: '/dashboard/rawmaterialorders',
    //   class: 'fas fa-truck-moving',
    //   label: 'RM Orders',
    //   role: 'User',
    // },
    // {
    //   route: '/dashboard/rawmaterials',
    //   class: 'fas fa-boxes',
    //   label: 'Raw Materials',
    //   role: 'User',
    // },
    {
      route: '/dashboard/patients',
      class: 'fas fa-people-carry',
      label: 'Pacientes',
      role: 'Admin',
    },
    {
      route: '/dashboard/customers',
      class: 'fas fa-people-carry',
      label: 'Clientes',
      role: 'Admin',
    },
    {
      route: '/dashboard/suppliers',
      class: 'fas fa-people-carry',
      label: 'Suppliers',
      role: 'Admin',
    },
    // {
    //   route: '/dashboard/distributors',
    //   class: 'fas fa-people-carry',
    //   label: 'Distributors',
    //   role: 'User',
    // },
    {
      route: '/dashboard/viewprofile',
      class: 'fas fa-user',
      label: 'Profile',
      role: 'User',
    },
    {
      route: '/dashboard/users',
      class: 'fas fa-users',
      label: 'Manage Users',
      role: 'Admin',
    },
  ];

  constructor(private authService: AuthService, private router: Router,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    if (this.authService.fetchFromSessionStorage() !== null)
      this.user = this.authService.fetchFromSessionStorage();
    else
      this.router.navigateByUrl('/auth/login');

    const role = this.authService && this.authService.getRole() ? this.authService.getRole() : '';

    if (role?.toString() === 'User')
      this.paths = this.paths.filter(path => path.role.includes(role.toString()));
    else if (role?.toString() === 'Moderator')
      this.paths = this.paths.filter(path => path.role.includes(role.toString()) || path.role.includes('User'));
    else if (role?.toString() === 'Admin')
      this.paths = this.paths;
  }

  signOut() {
    this.authService.logout();
    this.loadingService.disableLoading;
  }

}
