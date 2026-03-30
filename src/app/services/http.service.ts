import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WeatherResponse } from '../model/weather.models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  selectedCities: string[] = [];
  
  constructor(private http: HttpClient) { }

  searchCities(searchTerm: string): Observable<string[]> {
    return this.http.get<{success: boolean, data: string[]}>(`${environment.apiUrl}/search?city=${searchTerm}`)
      .pipe(map(response => response.data));
  }

  getForecast(cities: string[]): Observable<WeatherResponse> {    
    return this.http.post<WeatherResponse>(environment.apiUrl + '/weatherforecast', cities);
  }
}
