import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/service/auth.service';
import { Role } from '@core/models/role';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  step1!: UntypedFormGroup;
  step2!: UntypedFormGroup;
  step3!: UntypedFormGroup;
  hide = true;
  chide = true;
  showConjoint = false;

  // Liste des situations parentales
  situationsParentales = [
    { value: 'célibataire', viewValue: 'Célibataire' },
    { value: 'marié(e)', viewValue: 'Marié(e)' },
    { value: 'divorcé(e)', viewValue: 'Divorcé(e)' },
    { value: 'veuf(ve)', viewValue: 'Veuf(ve)' },
    { value: 'concubinage', viewValue: 'Concubinage' }
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.initForms();
  }

  initForms(): void {
    // Étape 1: Informations personnelles
    this.step1 = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });

    // Étape 2: Compte
    this.step2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // Étape 3: Famille
    this.step3 = this.formBuilder.group({
      situationParentale: ['célibataire'], // Valeur par défaut
      nomConjoint: [''],
      prenomConjoint: [''],
      telephoneConjoint: ['', [Validators.pattern(/^[0-9]{8}$/)]]
    });
  }

  passwordMatchValidator(form: UntypedFormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('cpassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.markAllAsTouched(this.step1);
    this.markAllAsTouched(this.step2);

    if (this.step1.invalid || this.step2.invalid) {
      Swal.fire({
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir correctement tous les champs obligatoires',
        icon: 'warning',
        confirmButtonColor: '#6a1b9a'
      });
      return;
    }

    const formData = {
      ...this.step1.value,
      ...this.step2.value,
      ...this.step3.value
    };

    const newUser = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.password,
      telephone: formData.telephone,
      adresse: formData.adresse,
      cin: formData.cin,
      nomConjoint: formData.nomConjoint || null,
      prenomConjoint: formData.prenomConjoint || null,
      telephoneConjoint: formData.telephoneConjoint || null,
      situationParentale: formData.situationParentale || 'célibataire', // Valeur par défaut
      role: Role.Parent,
      emailVerifie: false,
      compteVerifie: false
    };

    this.authService.signup(newUser).subscribe({
      next: () => this.showSuccessAlert(),
      error: (err) => this.showErrorAlert(err)
    });
  }

  private markAllAsTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof UntypedFormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  private showSuccessAlert(): void {
    Swal.fire({
      title: 'Inscription réussie !',
      html: `
        <div style="text-align: center;">
          <p>Votre compte a été créé avec succès.</p>
          <p>Un email de vérification a été envoyé à <strong>${this.step2.value.email}</strong>.</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#6a1b9a',
      showCancelButton: false
    }).then(() => {
      this.router.navigate(['/authentication/verification-email'], {
        state: { email: this.step2.value.email }
      });
    });
  }

  private showErrorAlert(error: any): void {
    let errorMessage = 'Une erreur est survenue lors de l\'inscription';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.error === 'EMAIL_EXISTS') {
      errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
    }

    Swal.fire({
      title: 'Erreur',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#d32f2f'
    });
  }
}
