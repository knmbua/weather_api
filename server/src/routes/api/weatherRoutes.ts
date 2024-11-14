import { Router, Request, Response } from 'express';
const router = Router();

import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try{
  // Use the weatherService object to retrieve both current weather and forecast weather for the city the user searched for
  // req.body.cityName is the city value that the user searched for in the browser form input
  const currentData = await weatherService.getCurrentWeatherForCity(req.body.cityName);
  // Create a variable forecastData that stores the forecast data, using the weatherService.getForecastWeatherForCity()
  const forecastData = await weatherService.getForecastWeatherForCity(req.body.cityName);

  // Create a variable weatherData that stores an array of the currentData as the first item and forecastData as the second item
  const weatherData = [currentData, forecastData];
  
  // TODO: save city to search history
  await historyService.addCity(req.body.cityName);

  // Use the historyService.addCity() to store the searched city into our searchHistory.json - use req.body.cityName to get the city the user searched for

  // Send back a json response of the weatherData
  res.json(weatherData);
  }catch (error){
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// // TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try{
    const cities = await historyService.getCities();

  // Send back a json response of the city object array
  res.json(cities);
  }catch (error){
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
  });

// // * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await historyService.removeCity(req.params.id);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
