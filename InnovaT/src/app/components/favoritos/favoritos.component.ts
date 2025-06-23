import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../../services/favoritos.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  imports: [CardModule, CommonModule],
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  videoSeleccionado: any = null;

  constructor(private favoritosService: FavoritosService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.favoritosService.obtenerFavoritos().subscribe({
      next: (data) => {
        this.favoritos = data.map((video) => ({
          ...video,
          favorito: true,
        }));
      }
    });
  }

  cargarFavoritos() {
    this.favoritosService.obtenerFavoritos().subscribe({
      next: (data) => {
        this.favoritos = data.map((video) => ({
          ...video,
          favorito: true,
          url: `https://www.youtube.com/embed/${video.videoId}?autoplay=1`,
        }));
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
      },
    });
  }

  seleccionarVideo(video: any) {
    this.videoSeleccionado = {
      ...video,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.videoId}?autoplay=1`
      )
    };
  }


  toggleFavorito(video: any, event: MouseEvent) {
    event.stopPropagation();

    video.favorito = !video.favorito;

    if (video.favorito) {
      this.favoritosService.agregarFavorito(video.videoId, video.title).subscribe();
    } else {
      this.favoritosService.eliminarFavorito(video.videoId).subscribe();
    }
  }


  getMiniatura(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }
}
