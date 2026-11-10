
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  readonly currentYear = new Date().getFullYear();

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  get f() {
    return this.contactForm.controls;
  }

  scrollToSection(sectionId: string, event?: Event): void {
    event?.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollToContact(): void {
    this.scrollToSection('contact');
  }

  submitContact(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http.post('/api/contact', this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage =
          'Thank you for contacting ET-Richmond Taxi. Your NEMT request has been submitted.';
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage =
          'We could not submit your transportation request right now. Please try again or contact us by phone.';
        this.isSubmitting = false;
      }
    });
  }
}
