import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BookStatusService } from '../../book-status.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  bookStatusID: number;
  bookID: string;
  bookName: string;
  status: string;
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
export class BookStatusDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BookStatusDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bookStatusService: BookStatusService
  ) {}

  confirmDelete(): void {
    this.bookStatusService.deleteBookStatus(this.data.bookStatusID).subscribe({
      next: (response) => {
        // Handle successful deletion
        this.dialogRef.close(response); // Close the dialog with the response
        // Optionally, refresh a list or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle error appropriately
      },
    });
  }
}
