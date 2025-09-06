import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { withViewTransitions } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { MyPreset } from './shared/theme/primeng-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: false }
      }
    }),
    provideHttpClient(
      withFetch(),
    ),
    HttpClient,
  ]
};
