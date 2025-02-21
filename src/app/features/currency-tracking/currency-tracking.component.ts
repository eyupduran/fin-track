import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CurrencyService, MetaData } from '../../core/services/currency.service';
import { ApiResponse, CurrencyRate } from '../../core/services/currency.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDollar, faEuro, faPoundSign, faMoneyBill, faSearch, faClock } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-currency-tracking',
  templateUrl: './currency-tracking.component.html',
  styleUrls: ['./currency-tracking.component.scss'],
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
export class CurrencyTrackingComponent implements OnInit, OnDestroy {
  currencyData: { [key: string]: CurrencyRate } | null = null;
  metaData: MetaData | null = null;
  loading = true;
  private subscription: Subscription | null = null;

  // Font Awesome icons
  faDollar = faDollar;
  faEuro = faEuro;
  faPoundSign = faPoundSign;
  faMoneyBill = faMoneyBill;
  readonly faSearch = faSearch;
  readonly faClock = faClock;

  // Currency icon mapping
  currencyIcons: { [key: string]: any } = {
    'USD': this.faDollar,
    'EUR': this.faEuro,
    'GBP': this.faPoundSign,
    'CHF': this.faMoneyBill,
    'CAD': this.faDollar,
    'RUB': this.faMoneyBill,
    'AED': this.faMoneyBill
  };

  searchText = '';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.subscription = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.currencyService.getCurrencyData())
    ).subscribe({
      next: (response: ApiResponse) => {
        this.currencyData = response.Rates;
        this.metaData = response.Meta_Data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching currency data:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCurrencyKeys(): string[] {
    if (!this.currencyData) return [];
    return Object.keys(this.currencyData)
      .filter(key => {
        const currencyCode = key.toLowerCase();
        const currencyRate = this.currencyData![key];
        const currencyName = currencyRate?.Name?.toLowerCase() || '';
        const searchText = this.searchText.toLowerCase();
        return currencyCode.includes(searchText) || currencyName.includes(searchText);
      });
  }

  getCurrencyIcon(code: string): any {
    return this.currencyIcons[code] || this.faMoneyBill;
  }
}
