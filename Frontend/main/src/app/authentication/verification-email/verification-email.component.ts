import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification-email',
  standalone: true,
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class VerificationEmailComponent {
  verificationForm = this.fb.group({
    verificationCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]]
  });

  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get verificationCode() {
    return this.verificationForm.get('verificationCode');
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.verificationForm.invalid) {
      return;
    }

    this.loading = true;
    const code = this.verificationForm.value.verificationCode ?? '';

    this.authService.verifyEmail(code).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response?.message ?? 'Email validé avec succès',
          timer: 2000,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'Code incorrect ou expiré';

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: this.errorMessage,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
