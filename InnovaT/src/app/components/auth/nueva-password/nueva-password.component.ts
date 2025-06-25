import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-nueva-password',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  templateUrl: './nueva-password.component.html'
})
export class NuevaPasswordComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  sCorreo = '';
  codigo = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.sCorreo = sessionStorage.getItem('sCorreo') || '';
    this.codigo = sessionStorage.getItem('codigo') || '';

    this.form = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('nuevaPassword')?.value;
    const confirm = group.get('confirmarPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  };

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.resetPasswordWithCode(this.sCorreo, this.codigo, this.form.value.nuevaPassword!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña actualizada correctamente',
          life: 3000
        });
        sessionStorage.removeItem('sCorreo');
        sessionStorage.removeItem('codigo');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3100);
      },
      error: err => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.msg || 'Error al actualizar'
        });
      }
    });
  }

}
