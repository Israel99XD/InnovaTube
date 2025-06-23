import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolbarEventsService } from '../../services/toolbar-events.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-toolbar',
    imports: [Toolbar, ButtonModule, SplitButton, InputTextModule, IconField, InputIcon, AvatarModule, FormsModule, CommonModule],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {

    items: MenuItem[] = [];
    username: string = '';

    @Output() favoritosClick = new EventEmitter<void>();
    termino: string = '';
    esMovil: boolean = false;

    constructor(
        private router: Router,
        private toolbarEvents: ToolbarEventsService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.verificarResolucion();
        window.addEventListener('resize', this.verificarResolucion.bind(this));

        this.actualizarMenuItems();

        this.username = this.authService.getUsername();
    }

    verificarResolucion() {
        this.esMovil = window.innerWidth <= 768;
        this.actualizarMenuItems();
    }

    actualizarMenuItems() {
        const accionesExtras: MenuItem[] = this.esMovil ? [
            {
                label: 'Favoritos',
                icon: 'pi pi-heart',
                command: () => this.mostrarFavoritos(),
            },
            {
                label: 'Todos',
                icon: 'pi pi-video',
                command: () => this.irATodos(),
            }
        ] : [];

        this.items = [
            ...accionesExtras,
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => this.cerrarSesion(),
            }
        ];
    }

    cerrarSesion() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    mostrarFavoritos() {
    this.router.navigate(['/favoritos']);
}


    irATodos() {
        this.router.navigate(['/pruebas']);
    }

    buscar() {
        if (this.termino.trim()) {
            this.toolbarEvents.emitBuscar(this.termino.trim());
        }
    }
}
