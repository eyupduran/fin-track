import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CurrencyService, CryptoApiResponse, CryptoRate, MetaData } from '../../core/services/currency.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoins, faSearch, faClock } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

const CRYPTO_ORDER: { [key: string]: number } = {
  'BTC': 1,
  'ETH': 2,
  'XRP': 3,
  'USDT': 4
};

@Component({
  selector: 'app-crypto-tracking',
  templateUrl: './crypto-tracking.component.html',
  styleUrls: ['./crypto-tracking.component.scss'],
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
export class CryptoTrackingComponent implements OnInit, OnDestroy {
  cryptoRates: { [key: string]: CryptoRate } | null = null;
  metaData: MetaData | null = null;
  loading = true;
  searchText = '';
  private subscription: Subscription | null = null;

  // Font Awesome icons
  readonly faBitcoin = faBitcoin;
  readonly faEthereum = faEthereum;
  readonly faCoins = faCoins;
  readonly faSearch = faSearch;
  readonly faClock = faClock;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.subscription = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.currencyService.getCryptoData())
    ).subscribe({
      next: (response: CryptoApiResponse) => {
        this.cryptoRates = response.Rates;
        this.metaData = response.Meta_Data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching crypto data:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCryptoKeys(): string[] {
    if (!this.cryptoRates) return [];
    return Object.keys(this.cryptoRates)
      .filter(key => {
        const cryptoName = this.cryptoRates![key].Name.toLowerCase();
        return cryptoName.includes(this.searchText.toLowerCase());
      })
      .sort((a, b) => (CRYPTO_ORDER[a] || 99) - (CRYPTO_ORDER[b] || 99));
  }

  getCryptoIcon(code: string): any {
    switch(code) {
      case 'BTC':
        return this.faBitcoin;
      case 'ETH':
        return this.faEthereum;
      default:
        return this.faCoins;
    }
  }
}