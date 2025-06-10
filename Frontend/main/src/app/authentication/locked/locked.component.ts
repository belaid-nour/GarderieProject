import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, Role } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-locked',
  standalone: true,
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ]
})
export class LockedComponent implements OnInit {
  authForm!: FormGroup;
  submitted = false;
  userimg: string = '';
  nom: string = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize the form group for the password field
    this.authForm = this.formBuilder.group({
      password: ['', Validators.required]
    });

    // Get the current user from the auth service
    const user = this.authService.currentUserValue;
    if (user) {
      this.userimg = user.userImg || '';
      this.nom = `${user.nom || ''} ${user.prenom || ''}`.trim();
    }
  }

  // Getter to access form controls
  get f() {
    return this.authForm.controls;
  }

  // Submit handler
  onSubmit(): void {
    this.submitted = true;
    if (this.authForm.invalid) return;

    // Retrieve the user's role and navigate accordingly
    const role = this.authService.currentUserValue?.role;

    switch (role) {
      case Role.Admin:
        this.router.navigate(['/admin/dashboard/main']);
        break;
      case Role.Teacher:
        this.router.navigate(['/teacher/dashboard']);
        break;
      case Role.Parent:
        this.router.navigate(['/student/dashboard']);
        break;
      default:
        this.router.navigate(['/authentication/signin']);
    }
  }
}
