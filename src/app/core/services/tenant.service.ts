import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantResponse } from './report.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  //private apiUrl = 'http://galalshaaban99-001-site1.anytempurl.com/api/Tenant';
  private apiUrl = `${environment.apiUrl}/Tenant`;

  constructor(private http: HttpClient) { }

  filterTenants(filters: {
    filter?: string;
    rentType?: number | null;
    pageNumber?: number;
    pageSize?: number;
    activityId?: string | null;
    brandId?: string | null;
  }): Observable<TenantResponse> {

    const params = new URLSearchParams();

    if (filters.filter) params.append('Filter', filters.filter);
    if (filters.rentType) params.append('RentType', filters.rentType.toString());
    if (filters.pageNumber !== undefined) params.append('PageNumber', filters.pageNumber.toString());
    if (filters.pageSize !== undefined) params.append('PageSize', filters.pageSize.toString());
    if (filters.activityId) params.append('ActivityId', filters.activityId);
    if (filters.brandId) params.append('BrandId', filters.brandId);

    return this.http.get<TenantResponse>(
      `${this.apiUrl}/FilterTenants?${params.toString()}`
    );
  }
}
