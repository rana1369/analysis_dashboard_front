import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
import { Brand, BrandFormData } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private brands: Brand[] = [];
  private apiUrl = `/api/Brand`;

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.initializeMockData();
  }

  getAllBrands() {
  return this.http.get<any>(`${this.apiUrl}/FilterBrands`).pipe(
    map(res => res.data)   // ← extract data array
  );
}

createBrand(body: any) {
  return this.http.post<any>(`${this.apiUrl}/CreateBrand`, body);
}


  getBrandById(id: string): Observable<Brand> {
    // In real app: return this.http.get<Brand>(`${environment.apiUrl}/brands/${id}`);
    const brand = this.brands.find(b => b.id === id);
    return of(brand!);
  }

 

  updateBrand(id: string, brandData: BrandFormData): Observable<Brand> {
    // In real app: return this.http.put<Brand>(`${environment.apiUrl}/brands/${id}`, brandData);
    const index = this.brands.findIndex(b => b.id === id);
    if (index !== -1) {
      this.brands[index] = {
        ...this.brands[index],
        ...brandData,
       
      };
      return of(this.brands[index]);
    }
    throw new Error('Brand not found');
  }

  deleteBrand(id: string): Observable<void> {
    // In real app: return this.http.delete<void>(`${environment.apiUrl}/brands/${id}`);
    this.brands = this.brands.filter(b => b.id !== id);
    return of(undefined);
  }

  uploadDocument(brandId: string, file: File): Observable<string> {
    // In real app: upload file and return URL
    return of(`/uploads/brands/${brandId}/${file.name}`);
  }

  private initializeMockData(): void {
    this.brands = [
      {
        id: '1',
        name: 'Brand A',
        description:''
       
      }
     
    ];
  }
}

