import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './partials/toolbar/toolbar.component';
import { NgIf } from '@angular/common';  // <-- Importa NgIf

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, NgIf],  // <-- Agrégalo aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'InnovaT';
  mostrarToolbar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const rutasSinToolbar = ['/login', '/register'];
      this.mostrarToolbar = !rutasSinToolbar.includes(event.urlAfterRedirects);
    });
  }
}
