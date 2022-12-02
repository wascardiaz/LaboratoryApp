import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order/order.component';
import { OrderItemsComponent } from './orders/order-items/order-items.component';
import { OrderService } from './shared/services/order.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './material/material.module';
import { httpInterceptors } from './interceptors';
import { GlobalErrorModalComponent } from './shared/global-error-modal/global-error-modal.component';
import { FormSubmitModalComponent } from './shared/form-submit-modal/form-submit-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalErrorModalComponent,
    FormSubmitModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MaterialModule
  ],
  entryComponents: [OrderItemsComponent],
  providers: [OrderService, httpInterceptors, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
