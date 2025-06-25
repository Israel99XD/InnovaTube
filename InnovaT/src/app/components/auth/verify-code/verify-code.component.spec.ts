import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCodeComponent } from './verify-code.component';
import { InputOtp } from 'primeng/inputotp';

describe('VerifyCodeComponent', () => {
  let component: VerifyCodeComponent;
  let fixture: ComponentFixture<VerifyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VerifyCodeComponent,
        InputOtp
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
