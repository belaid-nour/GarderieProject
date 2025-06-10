// features-section.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-features-section',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesSectionComponent {
  features = [
    {
      icon: 'fas fa-heart',
      title: 'Environnement bienveillant',
      description: 'Un cadre chaleureux où chaque enfant se sent en confiance et épanoui.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Pédagogie innovante',
      description: 'Méthodes éducatives modernes adaptées au rythme de chaque enfant.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Espaces naturels',
      description: 'Grand jardin arboré pour les activités en plein air et le contact avec la nature.'
    },
    {
      icon: 'fas fa-users',
      title: 'Petits groupes',
      description: 'Effectif limité pour un accompagnement personnalisé de chaque enfant.'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Cuisine maison',
      description: 'Repas équilibrés préparés sur place par notre cuisinière.'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Activités variées',
      description: 'Programme riche et diversifié pour stimuler tous les aspects du développement.'
    }
  ];
}
