import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AllAssets } from './all-assets.model';

@Injectable({
  providedIn: 'root',
})
export class AllAssetsService {
  private readonly API_URL = 'assets/data/allAssets.json';
  dataChange: BehaviorSubject<AllAssets[]> = new BehaviorSubject<AllAssets[]>(
    []
  );
  dialogData!: AllAssets; // Temporarily stores data from dialogs

  constructor(private httpClient: HttpClient) {}

  get data(): AllAssets[] {
    return this.dataChange.value;
  }

  getDialogData(): AllAssets {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch all assets */
  getAllAssets(): Observable<AllAssets[]> {
    return this.httpClient.get<AllAssets[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data); // Update dataChange with fetched data
        return data; // Return fetched data
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new asset */
  addAsset(allAssets: AllAssets): Observable<AllAssets> {
    return this.httpClient.post<AllAssets>(this.API_URL, allAssets).pipe(
      map(() => {
        this.dialogData = allAssets; // Store the added asset in dialogData
        return allAssets; // Return the added asset
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing asset */
  updateAsset(allAssets: AllAssets): Observable<AllAssets> {
    return this.httpClient.put<AllAssets>(`${this.API_URL}`, allAssets).pipe(
      map(() => {
        this.dialogData = allAssets; // Store the updated asset in dialogData
        return allAssets; // Return the updated asset
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove an asset by ID */
  deleteAsset(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted asset
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
