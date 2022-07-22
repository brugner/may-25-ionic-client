import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth-page.module').then(m => m.AuthPageModule)
  },
  {
    path: 'cars',
    loadChildren: () => import('./pages/cars/cars-page.module').then(m => m.CarsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',
    loadChildren: () => import('./pages/trips/trips-page.module').then(m => m.TripsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile-page.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account-page.module').then(m => m.AccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ratings',
    loadChildren: () => import('./pages/ratings/ratings-page.module').then(m => m.RatingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications-page.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages-page.module').then(m => m.MessagesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts',
    loadChildren: () => import('./pages/alerts/alerts-page.module').then(m => m.AlertsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help-page.module').then(m => m.HelpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test-pages/test-pages.module').then(m => m.TestPagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
