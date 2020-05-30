import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  title?: string;
  content?: string;

  actions: {
    result: any;
    title: string;
  }[];

  constructor(@Inject(MAT_DIALOG_DATA) data: AlertDialogData) {
    this.title = data.title;
    this.content = data.content;
    this.actions = data.actions ?? [];
  }
}

interface AlertDialogData {
  title?: string;
  content?: string;
  actions: {
    result: any;
    title: string;
  }[];
}
