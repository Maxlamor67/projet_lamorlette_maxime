import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  // 1. Injection des dépendances
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // 2. Le formulaire, avec ses règles de validation
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // 3. L'état de l'interface, géré avec des Signals
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // 4. Action déclenchée à la soumission du formulaire
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // fait apparaître les messages d'erreur
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // subscribe() déclenche réellement la requête HTTP
    this.authService.signUp(this.form.getRawValue()).subscribe({
      next: (user) => {
        this.successMessage.set(`Compte créé pour ${user.username} !`);
        this.form.reset();
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.message ?? "Erreur lors de l'inscription. Réessayez."
        );
        this.loading.set(false);
      }
    });
  }
}