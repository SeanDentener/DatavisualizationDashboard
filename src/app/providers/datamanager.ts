import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: 'root',
  })
  export class DataManager {

    public apiBaseUrl = "";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiBaseUrl = configService.apiBaseUrl;
      }


      public  getgeoData() {
        return this.http.get(this.apiBaseUrl + '/getgeojsondata');
      }

      public  gethexData() {
        return this.http.get(this.apiBaseUrl + '/getHexcountdata');
      }


      public  getsuburbData() {
        return this.http.get(this.apiBaseUrl + '/getsuburbcountdata');
      }




  }
  