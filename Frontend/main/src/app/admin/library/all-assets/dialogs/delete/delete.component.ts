import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AllAssetsService } from '../../all-assets.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  no: string;
  title: string;
  subject: string;
}

@Component({
    selector: 'app-all-assets-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class AllAssetsDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllAssetsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public allAssetsService: AllAssetsService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.allAssetsService.deleteAsset(this.data.id);
  }
}
