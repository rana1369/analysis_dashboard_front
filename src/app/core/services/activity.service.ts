import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Activity, ActivityFormData, ActivityApiResponse } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `/api/Activity`;

  constructor(private http: HttpClient) {}

 

  getActivityById(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  createActivity(activityData: ActivityFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateActivity`, activityData);
  }

  updateActivity(id: string, activityData: ActivityFormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, activityData);
  }

  deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllActivities(): Observable<ActivityApiResponse> {
    return this.http.get<ActivityApiResponse>(`${this.apiUrl}/FilterActivities`);
  }
}

