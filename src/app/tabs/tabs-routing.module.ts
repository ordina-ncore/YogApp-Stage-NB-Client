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
        loadChildren: () =>
          import('../upcoming-sessions/upcoming-sessions.module').then(
            (m) => m.UpcomingSessionsPageModule
          ),
      },
      {
        path: 'upcoming-sessions',
        loadChildren: () =>
          import('../upcoming-sessions/upcoming-sessions.module').then(
            (m) => m.UpcomingSessionsPageModule
          ),
      },
      {
        path: 'my-sessions',
        loadChildren: () =>
          import('../my-sessions/my-sessions.module').then((m) => m.MySessionsPageModule),
      },
      {
        path: 'rooms',
        loadChildren: () =>
          import('../rooms/rooms.module').then((m) => m.RoomsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'session-details/:id',
        loadChildren: () =>
          import('../session-details/session-details.module').then(
            (m) => m.SessionDetailsModule
          ),
      },
      {
        path: 'create-session',
        loadChildren: () =>
          import('../create-session/create-session.module').then(
            (m) => m.CreateSessionPageModule
          ),
      },
      {
        path: 'create-room',
        loadChildren: () =>
          import('../create-room/create-room.module').then(
            (m) => m.CreateRoomPageModule
          ),
      },
      {
        path: 'room-details/:id',
        loadChildren: () =>
          import('../room-details/room-details.module').then(
            (m) => m.RoomDetailsPageModule
          ),
      },
      {
        path: 'edit-room/:id',
        loadChildren: () =>
          import('../edit-room/edit-room.module').then(
            (m) => m.EditRoomPageModule
          ),
      },
      {
        path: 'edit-session/:id',
        loadChildren: () =>
          import('../edit-session/edit-session.module').then(
            (m) => m.EditSessionPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/upcoming-sessions',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/upcoming-sessions',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
