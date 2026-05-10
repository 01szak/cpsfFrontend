import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { from, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor to automatically convert Blobs with 'application/json' type back to JSON objects.
 */
@Injectable()
export class BlobJsonInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      switchMap(event => {
        const contentType = event instanceof HttpResponse
        && event.body instanceof Blob? (event.body.type || '').toLowerCase() : '';
        if (
          event instanceof HttpResponse
          && event.body instanceof Blob
          && (contentType.includes('application/json') || contentType.endsWith('+json'))
        ) {
          return from(event.body.text()).pipe(
            map(text => {
                try {
                    return event.clone({ body: JSON.parse(text) });
                } catch (e) {
                    return event;
                }
            })
          );
        }
        return of(event);
      })
    );
  }
}
