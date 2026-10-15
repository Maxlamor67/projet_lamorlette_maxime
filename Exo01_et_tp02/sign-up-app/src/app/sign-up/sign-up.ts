import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  user = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: '',
  };

  submitted = false;

  get passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.passwordsMatch) {
      return;
    }
    this.submitted = true;
    console.log('Utilisateur inscrit :', this.user);
  }
}