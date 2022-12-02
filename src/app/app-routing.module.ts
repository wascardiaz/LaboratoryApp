import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const dashboardModule = () => import('./dashboard/dashboard.module').then(x => x.DashboardModule);
const orderModule = () => import('./orders/orders.module').then(x => x.OrdersModule);

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: authModule },
  { path: 'dashboard', loadChildren: dashboardModule },
  { path: 'orders', loadChildren: orderModule },
  { path: '404', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
