import { Routes } from '@angular/router';
import { CurrencyTrackingComponent } from './features/currency-tracking/currency-tracking.component';
import { GoldTrackingComponent } from './features/gold-tracking/gold-tracking.component';
import { CryptoTrackingComponent } from './features/crypto-tracking/crypto-tracking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'currency', pathMatch: 'full' },
  { path: 'currency', component: CurrencyTrackingComponent },
  { path: 'gold', component: GoldTrackingComponent },
  { path: 'crypto', component: CryptoTrackingComponent }
];
