import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private readonly THEME_KEY = 'app-theme';
  private darkMode = new BehaviorSubject<boolean>(false); // Start with light theme by default
  isDarkMode$ = this.darkMode.asObservable();
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryListener = (e: MediaQueryListEvent) => this.handleSystemThemeChange(e);

  constructor() {
    if (typeof window !== 'undefined') {
      // Safely initialize mediaQuery
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Get saved theme or set light theme as default
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (!savedTheme) {
        // Set light theme as default
        localStorage.setItem(this.THEME_KEY, 'light');
        this.darkMode.next(false);
      } else {
        this.darkMode.next(savedTheme === 'dark');
      }

      // Apply initial theme
      this.applyTheme(this.darkMode.value);

      // Listen for system theme changes
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    }
  }

  ngOnDestroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }

  private handleSystemThemeChange(e: MediaQueryListEvent) {
    if (!localStorage.getItem(this.THEME_KEY)) {
      this.setDarkMode(false); // Always default to light theme
    }
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dark-theme', 'light-theme');
      document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
      localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.setDarkMode(!this.darkMode.value);
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }
}