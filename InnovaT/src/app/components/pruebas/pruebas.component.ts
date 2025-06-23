import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from '../../youtube.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule],
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.scss'],  // corregí styleUrl -> styleUrls
})
export class PruebasComponent implements OnInit {
  termino: string = '';
  videos: { title: string; url: SafeResourceUrl; favorito: boolean }[] = [];
  videoSeleccionado: { title: string; url: SafeResourceUrl; favorito: boolean } | null = null;

  constructor(private yt: YoutubeService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.cargarVideosPopulares();
  }

  cargarVideosPopulares() {
    this.yt.getVideosPopulares(12).subscribe((res: any) => {
      if (!res.items || res.items.length === 0) {
        this.videos = [];
        this.videoSeleccionado = null;
        return;
      }

      this.videos = res.items.map((item: any) => {
        const videoId = item.id;
        const title = item.snippet.title;
        const url = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}`
        );
        return { title, url, favorito: false };
      });

      this.seleccionarVideo(this.videos[0]);
    });
  }

  buscar() {
    if (this.termino.trim() === '') return;

    this.yt.getVideosPorBusqueda(this.termino, 12).subscribe((res: any) => {
      if (!res.items || res.items.length === 0) {
        this.videos = [];
        this.videoSeleccionado = null;
        return;
      }

      this.videos = res.items.map((item: any) => {
        const videoId = item.id?.videoId || item.id;
        const title = item.snippet.title;
        const url = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}`
        );
        return { title, url, favorito: false };
      });

      this.seleccionarVideo(this.videos[0]);
    });
  }

  seleccionarVideo(video: { title: string; url: SafeResourceUrl; favorito: boolean }) {
    this.videoSeleccionado = video;
  }

  toggleFavorito(video: { favorito: boolean }, event: MouseEvent) {
    event.stopPropagation();
    video.favorito = !video.favorito;
  }
}
