import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageGardeComponent } from './page-garde.component'; // Vérifiez le chemin

const routes: Routes = [
  {
    path: 'garde',
    component: PageGardeComponent,
  },
  // Autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
