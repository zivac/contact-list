import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() {}

  set(name: string, value: any): void {
      if (typeof value !== 'string') value = JSON.stringify(value);
      localStorage.setItem(name, value);
  }

  unset(name: string): void {
      localStorage.removeItem(name);
  }

  get(name: string): any {
      let item = localStorage.getItem(name);
      
      try {
          item = JSON.parse(item);
      } catch (err) {}
      
      return item;
  }

  update(name: string, added: any): void {
      let current = localStorage.getItem(name);
      let parsed = null;

      try {
          parsed = JSON.parse(current);
      } catch (err) {}

      if (!parsed) parsed = {};
      for (let key in added)  parsed[key] = added[key];

      localStorage.setItem(name, JSON.stringify(parsed));
  }

}
