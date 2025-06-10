import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isScrolled = false;
  isNavbarCollapsed = true;
  currentSection = 'accueil';

  constructor(private router: Router) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;

    const sections = ['accueil', 'programmes', 'apropos', 'activites', 'temoignages', 'contact'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.currentSection = section;
          break;
        }
      }
    }
  }

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.currentSection = section;
    this.isNavbarCollapsed = true;
  }
}
