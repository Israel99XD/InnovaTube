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
  styleUrl: './pruebas.component.scss',
})
export class PruebasComponent implements OnInit {
  termino: string = '';
  videos: { title: string; url: SafeResourceUrl }[] = [];
  videoSeleccionado: { title: string; url: SafeResourceUrl } | null = null;

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
        return { title, url };
      });

      this.seleccionarVideo(this.videos[0]);
    });
  }

  
buscar() {
  console.log('Buscar ejecutado con término:', this.termino); // ← Asegúrate de ver esto

  if (this.termino.trim() === '') return;

  this.yt.getVideosPorBusqueda(this.termino, 12).subscribe((res: any) => {
    console.log('Respuesta de búsqueda:', res); // ← Inspecciona aquí

    if (!res.items || res.items.length === 0) {
      this.videos = [];
      this.videoSeleccionado = null;
      return;
    }

    this.videos = res.items.map((item: any) => {
      const videoId = item.id?.videoId || item.id; // por si id viene directo
      const title = item.snippet.title;
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
      return { title, url };
    });

    this.seleccionarVideo(this.videos[0]);
  });
}


  seleccionarVideo(video: { title: string; url: SafeResourceUrl }) {
    this.videoSeleccionado = video;
  }
}
