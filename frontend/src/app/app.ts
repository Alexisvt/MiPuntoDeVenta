import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly systemStatus = signal('Comprobando conexión…');
  protected readonly capabilities = [
    'Usuarios y roles',
    'Inventario',
    'Ventas y caja',
    'Recibos internos',
  ];

  constructor() {
    this.http.get<{ status: string }>('/api/v1/health').subscribe({
      next: ({ status }) => {
        const available = status === 'UP';
        this.systemStatus.set(available ? 'Sistema disponible' : 'Sistema no disponible');
      },
      error: () => this.systemStatus.set('Sistema no disponible'),
    });
  }
}
