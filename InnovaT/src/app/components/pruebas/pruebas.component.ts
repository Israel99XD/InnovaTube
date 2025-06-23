import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from '../../youtube.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

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
  termino: string = '';
  videos: Video[] = [];
  videoSeleccionado: { title: string; url: SafeResourceUrl; favorito: boolean } | null = null;

  constructor(private yt: YoutubeService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.cargarVideosPopulares();
  }

  cargarVideosPopulares() {
    this.yt.getVideosPopulares(12).subscribe(res => this.procesarVideos(res));
  }

  buscar() {
    if (this.termino.trim() === '') return;

    this.yt.getVideosPorBusqueda(this.termino, 12).subscribe(res => this.procesarVideos(res));
  }

  private procesarVideos(res: any) {
    if (!res.items?.length) {
      this.videos = [];
      this.videoSeleccionado = null;
      return;
    }

    this.videos = res.items.map((item: any) => {
      const id = item.id?.videoId || item.id;
      const title = item.snippet.title;
      return { title, videoId: id, favorito: false };
    });

    this.videoSeleccionado = null;
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
    video.favorito = !video.favorito;
  }

  getMiniatura(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  private crearUrlVideo(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );
  }
}
