import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './dashboard/pages/overview/overview.component';
import { ServersComponent } from './dashboard/pages/servers/servers.component';
import { UsersComponent } from './dashboard/pages/users/users.component';
import { NetworkComponent } from './dashboard/pages/network/network.component';
import { AdvicesComponent } from './dashboard/pages/advices/advices.component';
import { SettingsComponent } from './dashboard/pages/settings/settings.component';
import { DocumentationComponent } from './dashboard/pages/documentation/documentation.component';
import { ProfileComponent } from './dashboard/pages/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "auth", component: AuthComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: "", component: OverviewComponent },
      { path: "servers", component: ServersComponent },
      { path: "users", component: UsersComponent },
      { path: "network", component: NetworkComponent },
      { path: "advices", component: AdvicesComponent },
      { path: "documentation", component: DocumentationComponent },
      { path: "profile", component: ProfileComponent },
      { path: "settings", component: SettingsComponent }
    ]}
];
