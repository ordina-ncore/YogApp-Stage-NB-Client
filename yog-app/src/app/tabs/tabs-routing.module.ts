import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../upcoming-sessions/upcoming-sessions.module').then(m => m.UpcomingSessionsPageModule)
      },
      {
        path: 'upcoming-sessions',
        loadChildren: () => import('../upcoming-sessions/upcoming-sessions.module').then(m => m.UpcomingSessionsPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'session-details/:id',
        loadChildren: () => import('../session-details/session-details.module').then(m => m.SessionDetailsModule)
      },
      {
        path: 'create-session',
        loadChildren: () => import('../create-session/create-session.module').then(m => m.CreateSessionPageModule)
      },
      {
        path: '',
        redirectTo: '/upcoming-sessions',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/upcoming-sessions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
