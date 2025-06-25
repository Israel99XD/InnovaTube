import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../../services/favoritos.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToolbarEventsService } from '../../services/toolbar-events.service';


@Component({
  imports: [CardModule, CommonModule],
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  videoSeleccionado: any = null;

  constructor(
    private favoritosService: FavoritosService,
    private sanitizer: DomSanitizer,
    private toolbarEvents: ToolbarEventsService
  ) { }
  favoritosOriginales: any[] = [];

  ngOnInit(): void {
    this.favoritosService.obtenerFavoritos().subscribe({
      next: (data) => {
        this.favoritosOriginales = data.map((video) => ({
          ...video,
          favorito: true,
        }));
        this.favoritos = [...this.favoritosOriginales];
      }
    });

    // 👇 Escucha del evento de búsqueda desde la barra de herramientas
    this.toolbarEvents.buscar$.subscribe((termino: string) => {
      this.buscarEnFavoritos(termino);
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

  buscarEnFavoritos(termino: string) {
    const terminoLimpio = termino.trim().toLowerCase();

    if (!terminoLimpio) {
      this.favoritos = [...this.favoritosOriginales];
      return;
    }

    this.favoritos = this.favoritosOriginales.filter(video =>
      video.title.toLowerCase().includes(terminoLimpio)
    );
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
