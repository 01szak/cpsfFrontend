import {inject, Injectable} from '@angular/core';
import {Api, Pageable, SearchRequest} from '../../../api';
import {findBy, findBy1} from '../../../api';
import {from, Observable, of} from 'rxjs';

export enum ResourceType {
  RESERVATION = 'RESERVATION',
  GUEST = 'GUEST'
}

@Injectable({providedIn: "root"})
export class DataFetchFacade {
  private readonly api = inject(Api)

  public findByBasedOnType(type: ResourceType, pageable?: Pageable, body?: SearchRequest): Observable<any> {
    //TODO this should be a static default value
    if (!pageable) pageable = {page: 0, size: 10, sort: []} as Pageable
    if (!body) body = {searchCriteria: []} as SearchRequest

    const params = {pageable, body};
    switch (type) {
      case ResourceType.RESERVATION: return from(this.api.invoke(findBy, params));
      case ResourceType.GUEST: return from(this.api.invoke(findBy1, params));
      default: throw new Error(`Provided incorrect resource type: ${type}`);
    }
  }
}
