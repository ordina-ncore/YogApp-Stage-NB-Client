import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'create-session',
    loadChildren: () => import('./create-session/create-session.module').then( m => m.CreateSessionPageModule)
  },
  {
    path: 'edit-session',
    loadChildren: () => import('./edit-session/edit-session.module').then( m => m.EditSessionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
