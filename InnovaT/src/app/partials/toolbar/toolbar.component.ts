import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolbarEventsService } from '../../services/toolbar-events.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


@Component({
    selector: 'app-toolbar',
    imports: [
        Toolbar,
        ButtonModule,
        SplitButton,
        InputTextModule,
        AvatarModule,
        FormsModule,
        CommonModule,
        AutoCompleteModule,
        ToastModule,
        ConfirmDialog
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class ToolbarComponent implements OnInit {

    items: MenuItem[] = [];
    username: string = '';
    sugerencias: string[] = [];

    @Output() favoritosClick = new EventEmitter<void>();
    termino: string = '';
    esMovil: boolean = false;

    constructor(
        private router: Router,
        private toolbarEvents: ToolbarEventsService,
        private authService: AuthService,
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
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
        this.items = [
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: (event) => {
                    console.log('MenuItem command event:', event);
                    if (event.originalEvent) {
                        this.confirmCerrarSesion(event.originalEvent);
                    }
                }

            }
        ];
    }



    cerrarSesion() {
        console.log('Cerrando sesión...');
        this.authService.logout();
        this.router.navigate(['/login']).then(() => {
            console.log('Navegación a login terminada');
        });
    }


    mostrarFavoritos() {
        this.router.navigate(['/favoritos']);
    }


    irATodos() {
        this.router.navigate(['/pruebas']);
    }

    buscar() {
        const terminoLimpio = this.termino.trim();
        if (terminoLimpio) {
            this.toolbarEvents.emitBuscar(terminoLimpio);
            this.termino = ''; // ← limpia el campo después de buscar
        }
    }

    buscarSugerencias(event: any) {
        const query = encodeURIComponent(event.query.trim());

        if (!query) {
            this.sugerencias = [];
            return;
        }

        const url = `https://corsproxy.io/?https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`;

        this.http.get(url, { responseType: 'text' }).subscribe((res: string) => {
            try {
                const parsed = JSON.parse(res);
                this.sugerencias = parsed[1];
            } catch (e) {
                this.sugerencias = [];
            }
        });
    }

    confirmCerrarSesion(event: Event) {
        this.confirmationService.confirm({
            target: event.target ?? undefined,
            message: '¿Seguro que quieres cerrar sesión?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.cerrarSesion();
                this.messageService.add({ severity: 'info', summary: 'Sesión cerrada', detail: 'Has cerrado sesión exitosamente' });
            },
            reject: () => {
                this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'No se cerró sesión' });
            }
        });
    }

}
