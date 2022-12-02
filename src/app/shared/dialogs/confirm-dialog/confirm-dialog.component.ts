import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  fromPage!: any;
  fromDialog!: string;
  optionEnabled!: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  ) {
    this.fromPage = { ...mydata };
    this.optionEnabled = mydata.option;
  }

  ngOnInit(): void {
    this.fromPage = this.mydata;
    this.fromDialog = "I am from dialog land...";
  }

  yesDialog() {
    this.dialogRef.close({ event: 'yes-option', data: this.fromDialog });
  }
  noDialog() {
    this.dialogRef.close({ event: 'no-option', data: this.fromDialog });
  }
  maybeDialog() {
    this.dialogRef.close({ event: 'maybe-option', data: this.fromDialog });
  }

}
