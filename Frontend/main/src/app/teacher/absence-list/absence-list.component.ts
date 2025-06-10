import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Absence, Enfant, Seance } from './absence.model';
import { SeanceService } from '../seance-list/seance.service';
import { AbsenceService } from './absence.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-absence-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BreadcrumbComponent
  ],
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.scss']
})
export class AbsenceListComponent implements OnInit {
  breadscrums = [{
    title: "Gestion des absences",
    items: ["Dashboard", "Séances", "Absences"],
    active: "Liste"
  }];

  seance!: Seance;
  absences: Absence[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'present', 'justifiee', 'actions'];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private seanceService: SeanceService,
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const seanceId = +this.route.snapshot.params['seanceId'];
    this.loadData(seanceId);
  }

  private loadData(seanceId: number): void {
    forkJoin([
      this.seanceService.getSeanceById(seanceId),
      this.absenceService.getAbsencesBySeance(seanceId)
    ]).subscribe({
      next: ([seance, absences]) => this.processData(seance, absences),
      error: (err) => this.handleError(err)
    });
  }

  private processData(seance: Seance, absences: Absence[]): void {
    this.seance = seance;
    this.seanceService.getElevesByClasse(seance.classe.id).subscribe({
      next: (eleves) => this.mergeAbsences(eleves, absences),
      error: (err) => this.handleError(err)
    });
  }

  private mergeAbsences(eleves: Enfant[], existingAbsences: Absence[]): void {
    this.absences = eleves.map(eleve => {
      const absence = existingAbsences.find(a => a.enfant?.id === eleve.id);
      return absence || this.createNewAbsence(eleve);
    });
    this.isLoading = false;
  }

  private createNewAbsence(eleve: Enfant): Absence {
    return {
      present: true,
      justifiee: false,
      date: new Date().toISOString(),
      enfantId: eleve.id,
      seanceId: this.seance.id,
      enfant: eleve,
      seance: this.seance
    };
  }

  onPresentChange(absence: Absence): void {
    if (absence.present) {
      absence.justifiee = false;
    }
    this.saveAbsence(absence);
  }

  onJustificationChange(absence: Absence): void {
    this.saveAbsence(absence);
  }

  public saveAbsence(absence: Absence): void {
    if (absence.id) {
      this.absenceService.updateAbsenceStatus(absence.id, absence.justifiee)
        .subscribe({
          next: () => this.showMessage('Statut mis à jour'),
          error: (err) => this.handleError(err)
        });
    } else {
      // Adaptation pour le format attendu par le backend
      const newAbsence = {
        enfantId: absence.enfantId,
        seanceId: absence.seanceId,
        present: absence.present,
        justifiee: absence.justifiee,
        date: absence.date
      };

      this.absenceService.createAbsence(newAbsence)
        .subscribe({
          next: (createdAbsence) => {
            absence.id = createdAbsence.id;
            this.showMessage('Absence enregistrée');
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  deleteAbsence(absence: Absence): void {
    if (confirm('Confirmer la suppression ?') && absence.id) {
      this.absenceService.deleteAbsence(absence.id)
        .subscribe({
          next: () => {
            this.absences = this.absences.filter(a => a.id !== absence.id);
            this.showMessage('Absence supprimée');
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  private handleError(error: any): void {
    console.error(error);
    this.errorMessage = 'Erreur lors du chargement des données';
    this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 2000 });
  }

  confirmExit(): void {
    Swal.fire({
      title: 'Confirmer la sortie',
      text: 'Absences enregistrées avec succès. Voulez-vous vraiment quitter ?',
      icon: 'success',
      confirmButtonText: 'Quitter',
      cancelButtonText: 'Annuler',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.back();
      }
    });
  }
}
