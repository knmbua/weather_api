import dotenv from 'dotenv';
import axios from 'axios';
import dayjs from 'dayjs';
dotenv.config();



class WeatherService {
  [x: string]: any;
  baseURL: string;
  apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  async fetchLocationData(city: string) {
    const url = this.baseURL + `/weather?units=imperial&q=${city}&appid=${this.apiKey}`;
    const res = await axios.get(url);
    return res.data;
  }

  async getForecastWeatherForCity(city: string) {
    
    const url = this.baseURL + `/forecast?units=imperial&q=${city}&appid=${this.apiKey}`;
    const res = await axios.get(url);
    console.log(res.data);
    const forecastData = res.data.list.filter((item: any) => item.dt_txt.includes('12:00:00')).map((item: any) => ({
      date: dayjs(item.dt * 1000).format('MM/DD/YYYY'),
      tempF: item.main.temp,
      icon: item.weather[0].icon,
      iconDescription: item.weather[0].description,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity
    }));
    return forecastData;
  }

  async getCurrentWeatherForCity(city: string) {
    const url = this.baseURL + `/weather?units=imperial&q=${city}&appid=${this.apiKey}`;
    const res = await axios.get(url);
    const data = {
      city: res.data.name,
      date: dayjs(res.data.dt * 1000).format('MM/DD/YYYY'),
      icon: res.data.weather[0].icon,
      iconDescription: res.data.weather[0].description,
      tempF: res.data.main.temp,
      windSpeed: res.data.wind.speed,
      humidity: res.data.main.humidity
    };
    return data;
  }
}

export default new WeatherService();