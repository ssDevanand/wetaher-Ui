import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { HttpService } from '../services/http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-search',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: string[] = [];
  selectedCities: string[] = [];
  isDropdownOpen = false;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(250), // Wait 250ms after the user stops typing
      distinctUntilChanged(), // Only trigger if the value actually changed
      filter(value => typeof value === 'string'), // Ensure it's a string
      switchMap(value => {
        if (value && value.trim().length > 0) {
          this.isDropdownOpen = true;
          return this.http.searchCities(value);
        } else {
          this.isDropdownOpen = false;
          return []; 
        }
      })
    ).subscribe(cities => {
      // Filter out cities that are already selected
      this.searchResults = cities.filter(city => !this.selectedCities.includes(city));
    });
  }

  selectCity(city: string): void {
    if (!this.selectedCities.includes(city)) {
      this.selectedCities.push(city);
      this.http.selectedCities = this.selectedCities; 
    }
    // Reset search
    this.searchControl.setValue('');
    this.searchResults = [];
    this.isDropdownOpen = false;
  }

  removeCity(city: string): void {
    this.selectedCities = this.selectedCities.filter(c => c !== city);
    this.http.selectedCities = this.selectedCities;
  }
}