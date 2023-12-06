import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: any;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('assets/config/appsettings.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }


  get apiBaseUrl() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.apiBaseUrl;
  }
}