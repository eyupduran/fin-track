import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface ApiResponse {
  Meta_Data: MetaData;
  Rates: { [key: string]: CurrencyRate };
}

export interface GoldApiResponse {
  Meta_Data: MetaData;
  Rates: { [key: string]: GoldRate };
}

export interface CryptoApiResponse {
  Meta_Data: MetaData;
  Rates: { [key: string]: CryptoRate };
}

export interface MetaData {
  Minutes_Ago: number;
  Current_Date: string;
  Update_Date: string;
}

export interface CurrencyRate {
  Type: string;
  Change: number;
  Name: string;
  Buying: number;
  Selling: number;
}

export interface GoldRate {
  Type: string;
  Name: string;
  Buying: number;
  Selling: number;
  Change: number;
}

export interface CryptoRate {
  Name: string;
  USD_Price: number;
  TRY_Price: number;
  Selling: number;
  Change: number;
  Type: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private baseUrl = 'https://finance.truncgil.com/api';

  constructor(private http: HttpClient) {}

  getCurrencyData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/today.json`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getGoldData(): Observable<GoldApiResponse> {
    return this.http.get<GoldApiResponse>(`${this.baseUrl}/gold-rates`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCryptoData(): Observable<CryptoApiResponse> {
    return this.http.get<CryptoApiResponse>(`${this.baseUrl}/crypto-currency-rates`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Veri alınamadı. Lütfen daha sonra tekrar deneyiniz.'));
  }

  getSilverData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gumus`);
  }
}
