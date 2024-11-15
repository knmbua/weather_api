import { promises as fs } from 'fs';
import { v4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = v4();
    this.name = name;
  }
}

class HistoryService {
  private dbFilePath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.dbFilePath = path.join(__dirname, '../../db/searchHistory.json');
  }
  private async read(): Promise<City[]> {
    try {
      const rawArray = await fs.readFile(this.dbFilePath, 'utf-8');
      const cityArray: City[] = JSON.parse(rawArray);

    
      return cityArray;
    } catch (error) {
      console.error('Error reading the searchHisory.json file', error)
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      // Convert the cities array to a JSON string
      const data = JSON.stringify(cities, null, 2);

      await fs.writeFile(this.dbFilePath, data, 'utf-8');
    } catch (error) {
      console.error('Error writing to the searchHistory.json file', error);
    }

  }

  async getCities() {
    const cityArray = await this.read();
    return cityArray;
  }

  async addCity(city: string) {
    const citiesArray = await this.getCities();

    const existingCity = citiesArray.find((c: any) => c.name === city);
    if (existingCity) {
      return;
    }

    const newCity = new City(city);

    citiesArray.push(newCity);

    await this.write(citiesArray);

    
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the db.json file
  async removeCity(id: string) {
    const citiesArray = await this.getCities();

    const filterCity = citiesArray.filter((city: City) => city.id !== id);

    await this.write(filterCity);
    console.log(`city with an id ${id} has been deleted`);

}
}

export default new HistoryService();