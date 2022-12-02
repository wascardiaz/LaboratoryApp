import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  getItemList(): Observable<Item[]> {
    let randomItemList = this.getTenRandomElements();
    return of(randomItemList);
  }

  private getTenRandomElements(): Item[] {
    // Create 100 Items
    const casos = Array.from({ length: 100 }, (_, k) => createNewItem(k + 1));

    return casos;
  }
}

const itemNames: string[] = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium',
  'Boron',
  'Carbon',
  'Nitrogen',
  'Oxygen',
  'Fluorine',
  'Neon',
  'Sodium',
  'Magnesium',
  'Aluminum',
  'Silicon',
  'Phosphorus',
  'Sulfur',
  'Chlorine',
  'Argon',
  'Potassium',
  'Calcium',
];

/** Builds and returns a new Item. */
function createNewItem(id: number): Item {
  const name = `${itemNames[Math.round(Math.random() * (itemNames.length - 1))]}`;

  return {
    id: id,
    name: name,
    // Caso_Ingreso: new Date(`${Math.floor(Math.random() * (12 - 1)) + 1}/${Math.floor(Math.random() * (24 - 1)) + 1}/${Math.floor(Math.random() * (2022 - 1950)) + 1950}`).toString(),
    price: parseFloat((Math.random() * (2999.99 - 0.99) + 0.99).toFixed(2))
  };
}