// page-garde.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-page-garde',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './page-garde.component.html',
  styleUrls: ['./page-garde.component.scss']
})
export class PageGardeComponent {
  currentYear = new Date().getFullYear();

  // Points éducatifs
  aboutPoints = [
    {
      title: 'Développement global',
      description: 'Programmes adaptés pour stimuler tous les aspects du développement'
    },
    {
      title: 'Apprentissage par le jeu',
      description: 'Des activités ludiques pour apprendre en s\'amusant'
    },
    {
      title: 'Communication constante',
      description: 'Application mobile pour suivre le quotidien de votre enfant'
    }
  ];

  // Caractéristiques principales
  features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Environnement sécurisé',
      description: 'Locaux adaptés avec contrôle d\'accès et personnel formé aux premiers secours'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Éducateurs qualifiés',
      description: 'Professionnels diplômés et passionnés par la petite enfance'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Nutrition équilibrée',
      description: 'Repas sains préparés sur place avec produits frais et bio'
    },
    {
      icon: 'fas fa-seedling',
      title: 'Espace extérieur',
      description: 'Grand jardin sécurisé avec aire de jeux et potager éducatif'
    }
  ];

programmes = [
  {
    age: 'Nom anniversaire',
    title: 'Organisation complète',
    description: 'Un espace festif et adapté pour célébrer l\'anniversaire de votre enfant avec jeux, animations et goûter.',
    image: 'assets/images/annif.jpg'
  },
  {
    age: 'Fête des Libsa traditionnelle',
    title: 'Célébration culturelle',
    description: 'Découvrez nos activités et ateliers pour vivre pleinement la fête traditionnelle des Libsa avec chants et danses.',
    image: 'assets/images/aid.jpg'
  },
  {
    age: 'Événement de l\'Aïd',
    title: 'Fête et partage',
    description: 'Participez à nos animations spéciales Aïd, entre jeux, contes et gourmandises pour petits et grands.',
    image: 'assets/images/img.jpg'
  }
];

  // Activités quotidiennes
  activites = [
    { time: '8h00-9h00', title: 'Accueil échelonné', icon: 'fas fa-door-open' },
    { time: '9h00-10h00', title: 'Ateliers Montessori', icon: 'fas fa-puzzle-piece' },
    { time: '10h00-10h30', title: 'Collation santé', icon: 'fas fa-apple-alt' },
    { time: '10h30-11h30', title: 'Sortie extérieure', icon: 'fas fa-tree' },
    { time: '11h30-12h30', title: 'Repas équilibré', icon: 'fas fa-utensils' },
    { time: '12h30-14h30', title: 'Temps calme', icon: 'fas fa-bed' },
    { time: '14h30-16h00', title: 'Activités créatives', icon: 'fas fa-paint-brush' },
    { time: '16h00-16h30', title: 'Goûter', icon: 'fas fa-cookie' },
    { time: '16h30-18h30', title: 'Départ échelonné', icon: 'fas fa-home' }
  ];

  // Témoignages
 temoignages = [
  {
    nom: 'Imène B.',
    role: 'Maman de Youssef, 4 ans',
    texte: 'Grâce à GardeRire, Youssef s’épanouit dans un environnement chaleureux et stimulant. Je recommande vivement ce lieu pour les parents qui cherchent le meilleur.',
    image: 'assets/images/parent2.jpg'
  },
  {
    nom: 'Ahmed K.',
    role: 'Papa de Leïla, 3 ans',
    texte: 'L’équipe est très professionnelle et attentionnée. Leïla adore les activités éducatives et nous sommes ravis de son progrès chaque semaine.',
    image: 'assets/images/parent2.jpg'
  },
  {
    nom: 'Asma M.',
    role: 'Maman de Sami, 2 ans',
    texte: 'Les repas bio et les activités en plein air ont convaincu notre famille. Sami revient chaque jour avec de nouvelles découvertes.',
    image: 'assets/images/parent2.jpg'
  }
];
}
