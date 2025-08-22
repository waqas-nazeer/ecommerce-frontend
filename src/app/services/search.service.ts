  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';

  @Injectable({ providedIn: 'root' })
  export class SearchService {
    private searchQuerySubject = new BehaviorSubject<string>('');

    setQuery(query: string): void {
      this.searchQuerySubject.next(query);
    }

    get query$(): Observable<string> {
      return this.searchQuerySubject.asObservable();
    }
  }
 

