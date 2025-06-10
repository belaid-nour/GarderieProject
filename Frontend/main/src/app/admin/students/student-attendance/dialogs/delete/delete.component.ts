import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { StudentAttendanceService } from '../../student-attendance.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  rollNo: string;
  sName: string;
  date: string;
}

@Component({
    selector: 'app-student-attendance-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
        DatePipe,
    ]
})
export class StudentAttendanceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<StudentAttendanceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public studentAttendanceService: StudentAttendanceService
  ) {}

  confirmDelete(): void {
    this.studentAttendanceService
      .deleteStudentAttendance(this.data.id)
      .subscribe({
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
