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


      public  getSRData() {
        return this.http.get(this.apiBaseUrl + '/getsrdata');
      }


      public  getgeoData() {
        return this.http.get(this.apiBaseUrl + '/getgeojsondata');
      }


      public  getsuburbData() {
        return this.http.get(this.apiBaseUrl + '/getsuburbcountdata');
      }
      public  getHexData() {
        return this.http.get(this.apiBaseUrl + '/getHexcountdata');
      }


      // public getAlldata() {
      //   return this.http.get(this.apiBaseUrl + '/getAlldata');

      // }

      public getDirectoratedata() {
        return this.http.get(this.apiBaseUrl + '/getDirectoratedata');
      }

      public getDepartmentdata(directorate:string) {
        return this.http.get(this.apiBaseUrl + '/getDepartmentdata?directorate=' + directorate);
      }

  }
  