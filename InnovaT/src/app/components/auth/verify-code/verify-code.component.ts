import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputOtp } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { decrypt } from '../../../utils/crypto.util';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputOtp,
    ButtonModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './verify-code.component.html',
})
export class VerifyCodeComponent {
  form!: FormGroup;
  submitted = false;
  loading = false;
  sCorreo!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    const correoCifrado = this.route.snapshot.queryParamMap.get('sCorreo');
    this.sCorreo = correoCifrado ? decrypt(decodeURIComponent(correoCifrado)) : '';

    this.form = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.verifyResetCode(this.sCorreo, this.form.value.codigo).subscribe({
      next: () => {
        sessionStorage.setItem('sCorreo', this.sCorreo);
        sessionStorage.setItem('codigo', this.form.value.codigo);
        this.router.navigate(['/nueva-password']);
      },
      error: err => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.msg || 'Código inválido'
        });
      }
    });
  }
}
