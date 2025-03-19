import { Component } from '@angular/core';
import {HeaderComponent} from './components/header.component';
import {SidebarComponent} from './components/sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
