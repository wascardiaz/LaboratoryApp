import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  getCustomerList(): Observable<Customer[]> {
    let randomItemList = this.getTenRandomElements();
    return of(randomItemList);
  }

  private getTenRandomElements(): Customer[] {
    // Create 100 users
    const casos = Array.from({ length: 100 }, (_, k) => createNewCustomer(k + 1));

    return casos;
  }
}

const CustomerNames: string[] = [
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
/** Builds and returns a new User. */
function createNewCustomer(id: number): any {
  const name = `${CustomerNames[Math.round(Math.random() * (CustomerNames.length - 1))]} 
  ${CustomerNames[Math.round(Math.random() * (CustomerNames.length - 1))].charAt(0)}. 
  ${CustomerNames[Math.round(Math.random() * (CustomerNames.length - 1))]}`;

  return {
    id: id,
    name: name,
    // Caso_Ingreso: new Date(`${Math.floor(Math.random() * (12 - 1)) + 1}/${Math.floor(Math.random() * (24 - 1)) + 1}/${Math.floor(Math.random() * (2022 - 1950)) + 1950}`).toString(),
    // Orig_Descripcion: origen,
    // price: Math.round(Math.random() * 10),
    // Esta_Codigo: status.code,
    // Esta_Descripcion: status.description,
  };
}