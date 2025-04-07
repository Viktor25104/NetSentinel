import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerTableComponent } from './components/server-table/server-table.component';
import { ServerDetailsComponent } from './components/server-details/server-details.component';
import { Server } from './interfaces/server.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, of, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-servers',
  imports: [CommonModule, ServerTableComponent, ServerDetailsComponent],
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {
  selectedServer: Server | null = null;
  servers: Server[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    interval(10000).pipe(
      startWith(0),
      switchMap(() =>
        this.http.get<Server[]>('http://localhost:8080/server/all', { withCredentials: true })
          .pipe(
            catchError(error => {
              console.error('Error fetching servers:', error);
              return of([]);
            })
          )
      )
    ).subscribe(data => {
      this.servers = data;
      // Если сервер выбран, обновляем его, создавая новый объект для срабатывания change detection
      if (this.selectedServer) {
        const updated = data.find(s => s.id === this.selectedServer!.id);
        if (updated) {
          this.selectedServer = { ...updated };
        }
      }
    });
  }

  selectServer(server: Server): void {
    // Создаем новый объект при выборе сервера
    this.selectedServer = { ...server };
  }

  closeDetails(): void {
    this.selectedServer = null;
  }
}
