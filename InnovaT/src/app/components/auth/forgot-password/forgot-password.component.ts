import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule, Location } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { encrypt } from '../../../utils/crypto.util';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      sCorreo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.forgotPassword(this.form.value.sCorreo).subscribe({
      next: () => {
        const correoCifrado = encodeURIComponent(encrypt(this.form.value.sCorreo));
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Código enviado', life: 3000 });
        setTimeout(() => {
          this.router.navigate(['/verificar-codigo'], { queryParams: { sCorreo: correoCifrado } });
        }, 3000);
      },
      error: err => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.msg || 'Error al enviar código', life: 3000 });
      }
    });
  }

  cancelar() {
  this.router.navigate(['/login']);
}

}
