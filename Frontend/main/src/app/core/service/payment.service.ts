import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `http://localhost:8081/api/payment`;

  constructor(private http: HttpClient) { }

  initiatePayment(enfantId: number, paymentData: any) {
    return this.http.post(`${this.apiUrl}/initiate/${enfantId}`, paymentData);
  }
}
