import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { ThemeService } from './core/services/theme.service';
import { filter } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarModule,
    TabMenuModule,
    SharedModule,
    FontAwesomeModule,
    CommonModule,
    TooltipModule
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  isDarkTheme = false;
  activeMenuItem: MenuItem | undefined;
  private themeSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  menuItems: MenuItem[] = [
    { 
      label: 'Döviz',
      icon: 'pi pi-dollar',
      routerLink: '/currency',
      command: () => this.navigateToRoute('/currency')
    },
    { 
      label: 'Altın',
      icon: 'pi pi-sun',
      routerLink: '/gold',
      command: () => this.navigateToRoute('/gold')
    },
    { 
      label: 'Kripto',
      icon: 'pi pi-bitcoin',
      routerLink: '/crypto',
      command: () => this.navigateToRoute('/crypto')
    }
  ];

  constructor(
    private themeService: ThemeService,
    private router: Router
  ) {
    const storedTheme = localStorage.getItem('app-theme');
    this.isDarkTheme = storedTheme ? storedTheme === 'dark' : false;
    if (!storedTheme) {
      localStorage.setItem('app-theme', 'light');
    }
  }

  ngOnInit() {
    // Tema değişikliklerini takip et
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkTheme = isDark;
      // Tema değiştiğinde localStorage'ı güncelle
      localStorage.setItem('app-theme', isDark ? 'dark' : 'light');
    });

    // Aktif rotayı ve tema durumunu ayarla
    this.setActiveItemFromRoute(this.router.url);
    this.themeService.setDarkMode(this.isDarkTheme);

    // Router event'lerini takip et
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveItemFromRoute(this.router.url);
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private setActiveItemFromRoute(url: string) {
    const path = url.split('/')[1] || 'currency';
    this.activeMenuItem = this.menuItems.find(item => 
      item.routerLink === '/' + path
    );
  }

  private navigateToRoute(route: string) {
    this.router.navigate([route]);
  }
}
