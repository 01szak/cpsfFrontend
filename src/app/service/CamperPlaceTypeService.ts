import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BackendService} from './BackendService';
import {CamperPlaceType} from '../components/Interface/CamperPlaceType';

@Injectable({providedIn: "root"})
export class CamperPlaceTypeService extends BackendService<CamperPlaceType> {

  private camperPlaceTypeSubject = new BehaviorSubject<CamperPlaceType[]>([]);
  public camperPlaceType$ = this.camperPlaceTypeSubject.asObservable();

  constructor(http: HttpClient) {
    super('api/camperPlaceType', http, new BehaviorSubject<CamperPlaceType | null>(null));
  }

  getCamperPlaceTypes(): Observable<CamperPlaceType[]> {
    return this.http.get<CamperPlaceType[]>(this.api).pipe(
      tap(p => {
        this.camperPlaceTypeSubject.next(p)
      })
    );
  }

}
