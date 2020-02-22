import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SynergiComponent } from './synergi/synergi.component';
import { ClusterComponent } from './cluster/cluster.component';
import { DrugtargetComponent } from './drugtarget/drugtarget.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: 'home',  component: HomeComponent, pathMatch: 'full' },
  { path: 'synergi', component: SynergiComponent, pathMatch: 'full' },
  { path: 'cluster', component: ClusterComponent, pathMatch: 'full' },
  { path: 'drugtarget', component: DrugtargetComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
