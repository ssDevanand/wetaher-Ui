import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { CitySearchComponent } from '../city-search/city-search.component';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../model/weather.models';

@Component({
  selector: 'app-list',
  imports: [CommonModule ,CitySearchComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
 
  weatherData: WeatherResponse = {} as WeatherResponse;
  modifiedWeastherData: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.weather();
  }

  weather(): void {
    const cities = this.httpService.selectedCities;
    this.httpService.getForecast(cities).subscribe(response => {
      console.log('Weather data:', response);
      this.weatherData = response; // Store the response in the component property
      this.modifiedWeastherData = this.deltaCalc(this.weatherData?.WeatherInfo); // Call deltaCalc with the cities array from the response
    });
  }

    deltaCalc(weatherArr:any) {
    const deltas = [];
    let city1 = weatherArr?.shift();
    deltas.push(city1);

    for (const city of weatherArr) {
      let delta:any = {};

      for (let key in city) {

        if (key === 'city') {
          delta = { city: `Delta: ${city1.city} ~ ${city.city}` };
        }
        else {
          delta[key] = {
            AvgTemp: Math.abs(city1[key]?.AvgTemp - city[key]?.AvgTemp).toFixed(2),
            MinTemp: Math.abs(city1[key]?.MinTemp - city[key]?.MinTemp).toFixed(2),
            MaxTemp: Math.abs(city1[key]?.MaxTemp - city[key]?.MaxTemp).toFixed(2)
          };
        }

      }
      deltas.push(city);
      deltas.push(delta);

    }
    return deltas;
  }

 averageCalc(weather:any) {

    let MinTemp = ((weather?.day1?.MinTemp + weather?.day2?.MinTemp + weather?.day3?.MinTemp + weather?.day4?.MinTemp + weather?.day5?.MinTemp + weather?.day6?.MinTemp + (weather?.day7?.MinTemp || 0)) / this.weatherData.dates?.length).toFixed(2);
    let MaxTemp = ((weather?.day1?.MaxTemp + weather?.day2?.MaxTemp + weather?.day3?.MaxTemp + weather?.day4?.MaxTemp + weather?.day5?.MaxTemp + weather?.day6?.MaxTemp + (weather?.day7?.MaxTemp || 0)) / this.weatherData.dates?.length).toFixed(2);

    return { MinTemp, MaxTemp };
  }

  toFahrenheit (celsius:any) {
    return celsius ? ((celsius * 9) / 5 + 32).toFixed(1) : '';
  }
}
