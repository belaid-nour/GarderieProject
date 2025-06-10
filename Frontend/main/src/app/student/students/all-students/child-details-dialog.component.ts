import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-child-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>child_care</mat-icon>
          Détails de {{data.prenom}} {{data.nom}}
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <div class="profile-section">
          <div class="avatar-container">
            <img [src]="getChildAvatar(data)" class="profile-avatar">
            <div class="profile-status" [ngClass]="{
              'status-paid': data.paye,
              'status-confirmed': data.confirmed && !data.paye,
              'status-pending': !data.confirmed
            }">
              {{ data.confirmed ? (data.paye ? 'PAYÉ' : 'CONFIRMÉ') : 'EN ATTENTE' }}
            </div>
          </div>

          <div class="profile-info">
            <h3>{{data.prenom}} {{data.nom}}</h3>
            <p class="text-muted">
              <mat-icon>cake</mat-icon>
              {{data.dateNaissance | date:'dd/MM/yyyy'}} ({{data.age}} ans)
            </p>
            <p class="text-muted">
              <mat-icon>school</mat-icon>
              {{data.classe || 'Classe non spécifiée'}}
            </p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="details-section">
          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon>person</mat-icon>
              <div matListItemTitle>Sexe</div>
              <div matListItemLine>{{data.sexe === 'M' ? 'Garçon' : 'Fille'}}</div>
            </mat-list-item>

            <mat-list-item *ngIf="data.typeInscription">
              <mat-icon matListItemIcon>assignment</mat-icon>
              <div matListItemTitle>Type d'inscription</div>
              <div matListItemLine>{{data.typeInscription}}</div>
            </mat-list-item>

            <mat-list-item *ngIf="data.comportementEnfant">
              <mat-icon matListItemIcon>psychology</mat-icon>
              <div matListItemTitle>Comportement</div>
              <div matListItemLine>{{data.comportementEnfant}}</div>
            </mat-list-item>
          </mat-list>
        </div>

        <mat-divider></mat-divider>

        <div class="contacts-section">
          <h3><mat-icon>contacts</mat-icon> Contacts Autorisés</h3>
          <mat-list>
            <mat-list-item *ngIf="data.personneAutorisee1Nom">
              <mat-icon matListItemIcon>person_outline</mat-icon>
              <div matListItemTitle>{{data.personneAutorisee1Prenom}} {{data.personneAutorisee1Nom}}</div>
            </mat-list-item>

            <mat-list-item *ngIf="data.personneAutorisee2Nom">
              <mat-icon matListItemIcon>person_outline</mat-icon>
              <div matListItemTitle>{{data.personneAutorisee2Prenom}} {{data.personneAutorisee2Nom}}</div>
            </mat-list-item>

            <mat-list-item *ngIf="!data.personneAutorisee1Nom && !data.personneAutorisee2Nom">
              <div matListItemTitle>Aucun contact autorisé</div>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Fermer</button>
        <button mat-raised-button
                color="primary"

                mat-dialog-close>
          <mat-icon>edit</mat-icon> Modifier
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 600px;
      max-width: 800px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        margin: 0;
        display: flex;
        align-items: center;

        mat-icon {
          margin-right: 10px;
          color: #3f51b5;
        }
      }
    }

    .dialog-content {
      padding: 24px;
    }

    .profile-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .avatar-container {
      position: relative;
      margin-right: 20px;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #f5f5f5;
    }

    .profile-status {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;

      &.status-paid {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.status-confirmed {
        background: #fff8e1;
        color: #ff8f00;
      }

      &.status-pending {
        background: #ffebee;
        color: #c62828;
      }
    }

    .profile-info {
      h3 {
        margin: 0 0 8px 0;
        font-size: 1.5rem;
      }

      p {
        display: flex;
        align-items: center;
        margin: 5px 0;

        mat-icon {
          margin-right: 8px;
          font-size: 20px;
        }
      }
    }

    .details-section, .contacts-section {
      margin: 20px 0;

      h3 {
        display: flex;
        align-items: center;
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: #424242;

        mat-icon {
          margin-right: 8px;
          color: #3f51b5;
        }
      }
    }

    mat-divider {
      margin: 20px 0;
    }
  `]
})
export class ChildDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getChildAvatar(enfant: any): string {
    return enfant.sexe === 'M'
      ? 'assets/images/garcon.jpg'
      : 'assets/images/fille.jpg';
  }
}
