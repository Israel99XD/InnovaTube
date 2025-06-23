import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from '../../services/youtube.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FavoritosService } from '../../services/favoritos.service';
import { ToolbarEventsService } from '../../services/toolbar-events.service';

interface Video {
  title: string;
  videoId: string;
  favorito: boolean;
}

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule],
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.scss'],
})
export class PruebasComponent implements OnInit {
  videos: Video[] = [];
  favoritos: string[] = [];
  termino: string = '';
  ultimaBusqueda: string = '';
  nextPageToken: string = '';
  videoSeleccionado: { title: string; url: SafeResourceUrl; favorito: boolean } | null = null;
  maxPaginas = 5;
  paginasCargadas = 0;
  constructor
    (
      private yt: YoutubeService,
      private sanitizer: DomSanitizer,
      private favoritosService: FavoritosService,
      private toolbarEvents: ToolbarEventsService
    ) { }

  ngOnInit() {
    // Escuchar cuando se emite el evento para mostrar favoritos
    this.toolbarEvents.favoritosClick$.subscribe(() => {
      this.mostrarFavoritos();
    });

    // Cargar favoritos para marcar los videos en la lista
    this.favoritosService.obtenerFavoritos().subscribe(data => {
      this.favoritos = data.map(f => f.videoId);
      this.cargarVideosPopulares(); // o buscar()
    });

    // Escuchar el evento de búsqueda emitido desde ToolbarComponent
    this.toolbarEvents.buscar$.subscribe((termino: string) => {
      this.termino = termino; // Actualiza término local
      this.buscar();          // Ejecuta búsqueda con el término recibido
    });

    // También carga los favoritos y videos iniciales (tu código ya lo tiene)
    this.favoritosService.obtenerFavoritos().subscribe(data => {
      this.favoritos = data.map(f => f.videoId);
      this.cargarVideosPopulares();
    });
  }
  cargarFavoritos() {
    this.favoritosService.obtenerFavoritos().subscribe(data => {
      this.favoritos = data.map(v => v.videoId);
      this.actualizarEstadoFavoritos();
    });
  }

  actualizarEstadoFavoritos() {
    this.videos = this.videos.map(video => ({
      ...video,
      favorito: this.favoritos.includes(video.videoId)
    }));
  }

  cargarVideosPopulares() {
    this.yt.getVideosPopulares(12).subscribe(res => this.procesarVideos(res));
  }

  buscar() {
    if (this.termino.trim() === '') return;

    this.ultimaBusqueda = this.termino;
    this.nextPageToken = '';
    this.videos = [];

    this.yt.getVideosPorBusqueda(this.termino, 12, '').subscribe(res => this.procesarVideos(res));
  }
  cargarMas() {
    if (!this.ultimaBusqueda || !this.nextPageToken) {
      console.log('No hay más páginas para cargar');
      return;
    }

    if (this.paginasCargadas >= this.maxPaginas) {
      console.log('Se alcanzó el límite máximo de páginas cargadas');
      return;
    }

    this.yt.getVideosPorBusqueda(this.ultimaBusqueda, 12, this.nextPageToken)
      .subscribe(res => {
        this.procesarVideos(res, true);
        this.paginasCargadas++;
      });
  }


  private procesarVideos(res: any, append: boolean = false) {
    if (!res.items?.length) return;

    if (res.nextPageToken === this.nextPageToken && append) {
      console.log('El nextPageToken no cambió, no hay más páginas para cargar.');
      return;
    }

    const nuevosVideos = res.items
      .map((item: any) => {
        let id = '';
        if (typeof item.id === 'string') {
          id = item.id;
        } else if (item.id && typeof item.id.videoId === 'string') {
          id = item.id.videoId;
        }
        if (!id) return null;

        return {
          title: item.snippet.title,
          videoId: id,
          favorito: this.favoritos.includes(id),
        };
      })
      .filter((v: any) => v !== null);

    this.videos = append ? [...this.videos, ...nuevosVideos] : nuevosVideos;

    this.nextPageToken = res.nextPageToken || '';
    console.log('Nuevo nextPageToken:', this.nextPageToken);
  }

  seleccionarVideo(video: Video) {
    const url = this.crearUrlVideo(video.videoId);
    this.videoSeleccionado = {
      title: video.title,
      favorito: video.favorito,
      url,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFavorito(video: Video, event: MouseEvent) {
    event.stopPropagation();

    if (video.favorito) {
      this.favoritosService.eliminarFavorito(video.videoId).subscribe(() => {
        video.favorito = false;
      });
    } else {
      this.favoritosService.agregarFavorito(video.videoId, video.title).subscribe(() => {
        video.favorito = true;
      });
    }
  }

  mostrarFavoritos() {
    this.favoritosService.obtenerFavoritos().subscribe(data => {
      this.videos = data.map((f: any) => ({
        title: f.title,
        videoId: f.videoId,
        favorito: true,
      }));

      this.videoSeleccionado = null;
    });
  }

  getMiniatura(videoId: string): string {
    if (!videoId) {
      return 'assets/default-thumbnail.jpg'; // o cualquier imagen local
    }
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  private crearUrlVideo(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );
  }
}
