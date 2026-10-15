import { Component, signal } from '@angular/core';
import { SignupComponent } from './components/signup/signup.component';

@Component({
  selector: 'app-root',
  imports: [SignupComponent],                                              
  template: `<app-signup />` 
})
export class App {
  protected readonly title = signal('signup-app-reel');
}
