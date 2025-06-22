import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

import { MyPreset } from './my-preset';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';

const AppProviders = [MessageService, ConfirmationService]; // ? Can add more global service here for injector

export const appConfig: ApplicationConfig = {
  providers: [
    ...AppProviders,
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor, tokenInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: false,
        },
      },
    }),
  ],
};
