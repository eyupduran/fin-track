import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CurrencyService, GoldApiResponse, GoldRate, MetaData } from '../../core/services/currency.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoins, faGem, faRing, faSearch, faClock } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

const GOLD_TYPE_ORDER: { [key: string]: number } = {
  'GRA': 1,  // Gram Altın
  'CEY': 2,  // Çeyrek Altın
  'YAR': 3,  // Yarım Altın
  'TAM': 4,  // Tam Altın
  'CUM': 5,  // Cumhuriyet Altını
  'YIA': 6,  // 22 Ayar Bilezik
  'ONS': 7,  // Ons
  'HAS': 8,  // Has Altın
  'ATA': 9,  // Ata Altın
  'RES': 10, // Reşat Altın
  'HAM': 11, // Hamit Altın
  'IKI': 12, // İkibuçuk Altın
  'BES': 13, // Beşli Altın
  'GRE': 14, // Gremse Altın
  'ODA': 15, // 14 Ayar Altın
  'OSA': 16, // 18 Ayar Altın
  'GPL': 17  // Gram Platin
};

@Component({
  selector: 'app-gold-tracking',
  templateUrl: './gold-tracking.component.html',
  styleUrls: ['./gold-tracking.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule, 
    FontAwesomeModule, 
    ProgressSpinnerModule,
    InputTextModule,
    FormsModule
  ]
})
export class GoldTrackingComponent implements OnInit, OnDestroy {
  goldRates: { [key: string]: GoldRate } | null = null;
  metaData: MetaData | null = null;
  loading = true;
  private subscription: Subscription | null = null;
  searchText = '';

  // Font Awesome icons
  faCoins = faCoins;
  faGem = faGem;
  faRing = faRing;
  readonly faSearch = faSearch;
  readonly faClock = faClock;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.subscription = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.currencyService.getGoldData())
    ).subscribe({
      next: (response: GoldApiResponse) => {
        this.goldRates = response.Rates;
        this.metaData = response.Meta_Data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching gold data:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getGoldKeys(): string[] {
    if (!this.goldRates) return [];
    return Object.keys(this.goldRates)
      .filter(key => {
        const goldCode = key.toLowerCase();
        const goldRate = this.goldRates![key];
        const goldName = goldRate?.Name?.toLowerCase() || '';
        const formattedName = this.formatGoldName(key).toLowerCase();
        const searchText = this.searchText.toLowerCase();

        return (goldCode.includes(searchText) || 
                goldName.includes(searchText) || 
                formattedName.includes(searchText)) && 
                goldRate?.Type === 'Gold' && 
                (goldRate?.Buying || 0) > 0;
      })
      .sort((a, b) => (GOLD_TYPE_ORDER[a] || 99) - (GOLD_TYPE_ORDER[b] || 99));
  }

  getGoldIcon(code: string): any {
    switch(code) {
      case 'YIA': // 22 Ayar Bilezik
      case 'ODA': // 14 Ayar
      case 'OSA': // 18 Ayar
        return this.faRing;
      case 'GRA': // Gram Altın
      case 'HAS': // Has Altın
      case 'GPL': // Gram Platin
        return this.faGem;
      default:
        return this.faCoins;
    }
  }

  formatGoldName(name: string): string {
    const goldTypes: { [key: string]: string } = {
      'GRA': 'Gram Altın',
      'CEY': 'Çeyrek Altın',
      'YAR': 'Yarım Altın',
      'TAM': 'Tam Altın',
      'CUM': 'Cumhuriyet Altını',
      'YIA': '22 Ayar Bilezik',
      'ONS': 'Ons',
      'HAS': 'Has Altın',
      'ATA': 'Ata Altını',
      'RES': 'Reşat Altını',
      'HAM': 'Hamit Altını',
      'IKI': 'İkibuçuk Altın',
      'BES': 'Beşli Altın',
      'GRE': 'Gremse Altın',
      'ODA': '14 Ayar Altın',
      'OSA': '18 Ayar Altın',
      'GPL': 'Gram Platin'
    };

    return goldTypes[name] || name;
  }
}
