import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolbarEventsService {
  private buscarSubject = new Subject<string>();
  private favoritosSubject = new Subject<void>();

  buscar$ = this.buscarSubject.asObservable();
  favoritosClick$ = this.favoritosSubject.asObservable();

  emitirFavoritosClick() {
    this.favoritosSubject.next();
  }

  emitBuscar(termino: string) {
    this.buscarSubject.next(termino);
  }
}
