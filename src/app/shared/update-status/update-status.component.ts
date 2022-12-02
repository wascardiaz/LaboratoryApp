import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';
import { RepositoryService } from '../services/repository.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {
  statuses = ['Delivered', 'Cancelled'];
  statusForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private analysisOrderService: RepositoryService,
    private rawMaterialOrderService: RepositoryService,
    private dialogRef: MatDialogRef<UpdateStatusComponent>,
    public loadingService: LoadingService
  ) {
    console.log(data);
    this.initForm();
  }
  initForm() {
    this.statusForm = new FormGroup({
      newStatus: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void { }

  submitForm() {
    if (this.data['id']) {
      this.updateAnalysisData();
    } else this.updateRawMaterialData();
  }

  updateRawMaterialData() {
    let data = {
      id: this.data.id,
      ordeStatus: this.statusForm.value.newStatus,
    };

    this.loadingService.enableLoading();
    this.rawMaterialOrderService.update(`hos-cases/${data.id}`, data).subscribe(
      (res: any) => {
        console.log(res);

        this.loadingService.disableLoading();
        this.dialogRef.close(res);
      },
      (error: any) => {
        this.loadingService.disableLoading();
        throw new Error(error);
      }
    );
  }

  updateAnalysisData() {
    let data = {
      id: this.data.id,
      orderStatus: this.statusForm.value.newStatus,
    };
    this.loadingService.enableLoading();
    this.analysisOrderService.update(`hos-cases/${data.id}`, data).subscribe(
      (res: any) => {
        console.log(res);
        this.loadingService.disableLoading();
        this.dialogRef.close(res);
      },
      (error: any) => {
        this.loadingService.disableLoading();
        throw new Error(error);
      }
    );
  }

}
