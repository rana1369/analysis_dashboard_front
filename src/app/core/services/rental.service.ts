import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = `http://galalshaaban99-001-site1.anytempurl.com/api/Tenant`;

  constructor(private http: HttpClient) {}

  /** ✔ GET all rentals from backend */
  getAllRentals(): Observable<Rental[]> {
    return this.http
      .get<{ data: Rental[] }>(`${this.apiUrl}/FilterTenants`)
      .pipe(map(res => res.data));
  }
  getAllSales(TenantId:any): Observable<[]> {
    return this.http
      .get<any>(`${this.apiUrl}/FilterTenantSales?TenantId=${TenantId}`)
      .pipe(map(res => res.data));
  }
  createSales(body:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/AddTenantSales`,
      body
    )
  }
   createRents(body:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/AddTenantRend`,
      body
    )
  }
  getAllRent(TenantId:any): Observable<[]> {
    return this.http
      .get<any>(`${this.apiUrl}/FilterTenantRent?TenantId=${TenantId}`)
      .pipe(map(res => res.data));
  }

  /** ✔ GET rental by ID (backend endpoint example — adjust if needed) */
  getRentalById(id: string): Observable<Rental> {
    return this.http.get<Rental>(`${this.apiUrl}/Tenant/${id}`);
  }

  /** ✔ Get rentals by brand */
  getRentalsByBrandId(brandId: string): Observable<Rental[]> {
    return this.http
      .get<{ data: Rental[] }>(
        `${this.apiUrl}/api/Tenant/FilterTenants?brandId=${brandId}`
      )
      .pipe(map(res => res.data));
  }

  /** ✔ Create rental based on backend model */
 createRental(body: any): Observable<Rental> {
  return this.http.post<Rental>(
    `${this.apiUrl}/CreateTenant`,
    body
  );
}


  /** ✔ Update existing rental */
  updateRental(id: string, formData: any): Observable<Rental> {
    return this.http.put<Rental>(
      `${this.apiUrl}/api/Tenant/${id}`,
      formData
    );
  }

  /** ✔ Delete rental */
  deleteRental(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/Tenant/${id}`
    );
  }

  /** ✔ Upload contract file */
  uploadContractFile(rentalId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${this.apiUrl}/api/Tenant/${rentalId}/UploadContract`,
      formData
    );
  }
}
