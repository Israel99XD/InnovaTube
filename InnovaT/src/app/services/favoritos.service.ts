import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private baseUrl = 'https://innovatube-hq5c.onrender.com/api/favoritos';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // Asegúrate de guardar el token al hacer login
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerFavoritos() {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  agregarFavorito(videoId: string, title: string) {
    return this.http.post(this.baseUrl, { videoId, title }, { headers: this.getHeaders() });
  }

  eliminarFavorito(videoId: string) {
    return this.http.delete(`${this.baseUrl}/${videoId}`, { headers: this.getHeaders() });
  }
}
