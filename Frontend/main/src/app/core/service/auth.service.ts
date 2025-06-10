import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/role';

interface LoginResponse {
  token: string;
  role: string;
  nom: string;
  prenom: string;
  email: string;
  id_utilisateur: number;
  emailVerifie: boolean;
  compteVerifie: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private readonly apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, motDePasse: password })
      .pipe(
        map(response => {
          const user: User = {
            id_utilisateur: response.id_utilisateur,
            nom: response.nom,
            prenom: response.prenom,
            email: response.email,
            motDePasse: '',
            cin: '',
            telephone: '',
            role: response.role as Role,
            emailVerifie: response.emailVerifie,
            compteVerifie: response.compteVerifie,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(this.handleError)
      );
  }


  signup(userData: any): Observable<User> {
    const payload = {
      ...userData,
      role: Role.Parent,
      emailVerifie: false,
      compteVerifie: false
    };

    return this.http.post<any>(`${this.apiUrl}/signup`, payload).pipe(
      map(response => {
        if (response.user) {
          return response.user;
        }
        throw new Error(response.message || 'Erreur lors de la création du compte');
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.message === 'Email déjà utilisé') {
          return throwError(() => new Error('Cet email est déjà utilisé. Veuillez en choisir un autre.'));
        }

        let errorMessage = 'Une erreur est survenue lors de l\'inscription';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<{ success: boolean }> {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return of({ success: true });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password/reset`, { email })
      .pipe(catchError(this.handleError));
  }

  verifyEmail(verificationCode: string): Observable<any> {
    const params = new HttpParams().set('code', verificationCode);
    return this.http.get(`${this.apiUrl}/auth/validate-code`, { params })
      .pipe(
        map(response => {
          if (!response) throw new Error('Invalid response');
          return response;
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-verification`, { email })
      .pipe(catchError(this.handleError));
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isEmailVerified(): boolean {
    return this.currentUserValue?.emailVerifie ?? false;
  }

  getToken(): string | null {
    return this.currentUserValue?.token ?? null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 500 && error.error?.message?.includes('Email already exists')) {
        errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Erreur ${error.status}: ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // Méthode pour mettre à jour l'utilisateur connecté
  updateCurrentUser(user: User): void {
  this.currentUserSubject.next(user);
  localStorage.setItem('currentUser', JSON.stringify(user)); // <-- Ajouter la persistance
}

// Corriger la méthode getCurrentUserId
getCurrentUserId(): number | null {
  return this.currentUserSubject.value?.id_utilisateur ?? null;
}

  private getDefaultErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0: return 'Impossible de se connecter au serveur';
      case 400: return 'Requête invalide';
      case 401: return 'Non autorisé';
      case 403: return 'Accès refusé';
      case 404: return 'Ressource non trouvée';
      case 500: return 'Erreur interne du serveur';
      default: return `Erreur ${error.status}: ${error.message}`;
    }
  }
}
