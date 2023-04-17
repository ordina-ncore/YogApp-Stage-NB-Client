import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})

export class BearerTokenInterceptor implements HttpInterceptor {

  constructor(private msalService: MsalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Check if the request URL is for your GraphQL API
    if (request.url.includes('https://localhost:7242/graphql/')) {

      // Get the access token from MSAL
      return this.msalService.acquireTokenSilent({scopes: ['api://9eba4a57-7daa-473b-8efb-5a0e6e96ca6c/access_all']}).pipe(
        mergeMap(token => {
          // Clone the request and set the bearer token in the Authorization header
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          // Pass on the modified request
          return next.handle(authReq);
        })
      );

    } else {
      // Pass on the original request
      return next.handle(request);
    }

  }

}

