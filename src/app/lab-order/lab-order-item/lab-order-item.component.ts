import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnalysisOrderItem } from 'src/app/shared/models/analysis-order-item.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-lab-order-item',
  templateUrl: './lab-order-item.component.html',
  styleUrls: ['./lab-order-item.component.scss']
})
export class LabOrderItemComponent implements OnInit {
  formData!: AnalysisOrderItem;
  itemList!: any[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LabOrderItemComponent>,
    private respositoryService: RepositoryService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.respositoryService.getData('tests').subscribe(lst => this.itemList = lst);
    if ((this.data.item))
      this.formData = Object.assign({}, { ...this.data.item, price: this.data.item.cost });
    else
      this.formData = {
        id: 0,
        secuencia: 0,
        orderId: this.data.orderId,
        groupId: 0,
        testId: 0,
        itemName: '',
        groupName: '',
        description: '',
        cost: 0.00,
        price: 0.00,
        qty: 0,
        percent: 0.00,
        acuerdo: 0.00,
        descto: 0.00,
        coberture: 0.00,
        diference: 0.00,
        ajuste: 0.00,
        total: 0.00,
        referencia: '',
        caseId: this.data.orderId,
        userId: this.authService.userValue?.id
      }
  }

  UpdatePrice(event: any) {
    if (event.selectedIndex == 0) {
      // this.formData.secuencia = 0;
      // this.formData.orderId = this.data.orderId;
      this.formData.groupId = 0;
      // this.formData.testId = 0;
      this.formData.itemName = '';
      this.formData.groupName = '';
      this.formData.description = '';
      this.formData.cost = 0.00;
      this.formData.price = 0.00;
      this.formData.qty = 0;
      this.formData.percent = 0.00;
      this.formData.acuerdo = 0.00;
      this.formData.descto = 0.00;
      this.formData.coberture = 0.00;
      this.formData.diference = 0.00;
      this.formData.ajuste = 0.00;
      this.formData.total = 0.00;
      this.formData.referencia = '';
      // this.formData.caseId = this.data.orderId;
      // this.formData.userId = this.authService.userValue?.id;
    }
    else {
      // this.formData.secuencia = 0;
      // this.formData.orderId = this.data.orderId;
      this.formData.groupId = this.itemList[event.selectedIndex - 1].test_group?.id;
      // this.formData.testId = this.itemList[event.selectedIndex - 1].testId;
      this.formData.itemName = this.itemList[event.selectedIndex - 1].description;
      this.formData.groupName = this.itemList[event.selectedIndex - 1].test_group?.name;
      this.formData.description = this.itemList[event.selectedIndex - 1].description;
      this.formData.cost = Number(this.itemList[event.selectedIndex - 1].price);
      this.formData.price = Number(this.itemList[event.selectedIndex - 1].price);
      this.formData.qty = 1;
      this.formData.percent = 0.00;
      this.formData.acuerdo = 0.00;
      this.formData.descto = 0.00;
      this.formData.coberture = 0.00;
      this.formData.diference = 0.00;
      this.formData.ajuste = 0.00;
      this.formData.total = 0.00;
      this.formData.referencia = '';
      // this.formData.caseId = this.data.orderId;
      // this.formData.userId = this.authService.userValue?.id;
    }
    this.UpdateTotal();
  }

  UpdateTotal() {
    if (this.formData)
      this.formData.total = parseFloat((this.formData.qty * this.formData?.price - this.formData.descto).toFixed(2));
  }

  OnSubmit(form: NgForm) {
    if (this.ValidateForm(form.value)) {
      this.formData.qty = form.value.qty;
      this.dialogRef.close(this.formData);
    }
  }

  ValidateForm(formData: AnalysisOrderItem) {
    this.isValid = true;
    if (this.formData.testId == 0)
      this.isValid = false;
    else if (this.formData.qty = 0)
      this.isValid = false;
    return this.isValid;
  }

}
