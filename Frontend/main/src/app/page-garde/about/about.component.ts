import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  aboutPoints = [
    {
      title: 'Développement global',
      description: 'Programmes adaptés pour stimuler tous les aspects du développement',
      icon: 'fas fa-child'
    },
    {
      title: 'Apprentissage par le jeu',
      description: 'Des activités ludiques pour apprendre en s\'amusant',
      icon: 'fas fa-puzzle-piece'
    },
    {
      title: 'Communication constante',
      description: 'Application mobile pour suivre le quotidien de votre enfant',
      icon: 'fas fa-mobile-alt'
    },
    {
      title: 'Environnement sécurisé',
      description: 'Locaux spécialement conçus pour la sécurité des tout-petits',
      icon: 'fas fa-shield-alt'
    }
  ];
}
