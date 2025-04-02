import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerTableComponent } from './components/server-table/server-table.component';
import { ServerDetailsComponent } from './components/server-details/server-details.component';
import { Server } from './interfaces/server.interface';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-servers',
  imports: [CommonModule, ServerTableComponent, ServerDetailsComponent],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersComponent {
  selectedServer: Server | null = null;
  servers: Server[] = [];

  constructor(private http: HttpClient) {

    this.http.get<Server[]>('http://localhost:8080/server/all', { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error fetching servers:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.servers = data;
      });
  }

  selectServer(server: Server) {
    this.selectedServer = server;
  }

  closeDetails() {
    this.selectedServer = null;
  }
}
