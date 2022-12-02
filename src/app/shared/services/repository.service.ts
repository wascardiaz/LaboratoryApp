import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  authServiceUrl = `${environment.protocol}${environment.applicationUrl}/${environment.apiService}`;

  constructor(private http: HttpClient) { }

  public getData = (route: string): Observable<any> => {
    return this.http.get(this.createCompleteRoute(route, this.authServiceUrl));
  }

  public getDataExternalApi(route: string, url: string, body: any) {
    // return this.http.get(this.createCompleteRoute(route, url));
    return this.http.post(this.createCompleteRoute(route, url), body);
  }

  public create = (route: string, body: any) => {
    return this.http.post(this.createCompleteRoute(route, this.authServiceUrl), body, this.generateHeaders());
  }

  public update = (route: string, body: any) => {
    return this.http.put(this.createCompleteRoute(route, this.authServiceUrl), body, this.generateHeaders());
  }

  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.authServiceUrl));
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
}
