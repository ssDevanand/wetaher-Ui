export interface TemperatureData {
  AvgTemp: number;
  MinTemp: number;
  MaxTemp: number;
}

export interface CityWeather {
  city: string;
  [key: string]: string | TemperatureData | undefined; 
}

export interface WeatherResponse {
  dates: string[];
  WeatherInfo: CityWeather[];
}