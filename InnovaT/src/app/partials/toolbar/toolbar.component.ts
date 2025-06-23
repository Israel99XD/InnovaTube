import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-toolbar',
  imports: [Toolbar, ButtonModule, SplitButton, InputTextModule, IconField, InputIcon, AvatarModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
buscar() {
throw new Error('Method not implemented.');
}
   items: MenuItem[] | undefined;
termino: any;

    ngOnInit() {
        this.items = [
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out'
            }
        ];
    }
}
