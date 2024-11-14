// Import fs promises version to read and write to our searchHistory.json file
import { promises as fs } from 'fs';
import {v4} from 'uuid';

class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = v4();
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = './searchHistory.json';

  // TODO: Define a private read method that reads from the searchHistory.json file - this method will only be accessible within the HistoryService class
  private async read(): Promise<City[]> {
    try {
      const rawArray = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(rawArray);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to search history:', error);
    }
  }
 
  // TODO: Define a get method that returns an array of city objects, using the read method to retrieve the array from searchHistory.json
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const citiesArray = await this.getCities();


    // First use citiesArray.find() to check if there is already a city object matching the city name
    // If there is, return without continuing the rest of the code below
    if (citiesArray.find(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      return;
    }

    
    // Create a city variable that stores a new City object - Pass in the city parameter as an argument
    
    // Push the new city object to the citiesArray above
    const newCity = new City(cityName);
    citiesArray.push(newCity);
    // Use this.write to overwrite the searchHistory.json file with our new array of city objects
    await this.write(citiesArray);
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const citiesArray = await this.getCities();

    // Filter out the city object within citiesArray that has an id matching the id above - ie. citiesArray.filter(() => {})
    const updatedCitiesArray = citiesArray.filter(city => city.id !== id);
    await this.write(updatedCitiesArray);

    // console.log a confirmation that the city has been removed
    
    console.log(`City with ID ${id} has been removed from search history.`);
  }
  }

export default new HistoryService();
