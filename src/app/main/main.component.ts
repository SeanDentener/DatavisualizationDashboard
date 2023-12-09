import { Component } from '@angular/core';
import { DataManager } from '../providers/datamanager';
import { Globals } from '../providers/globals.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {


  public theData: any;
  public theGeoData: any;
  public theSuburbData: any;

  public dataReady: boolean = false;


  mapCenter = [ 18.423300, -33.918861];
  basemapType = 'streets';
  mapZoomLevel = 10;
  
  public ShowComponent:string = "";

  
  barLoadedEvent(status: boolean) {
    console.log('The bar loaded: ' + status);
    this.dataReady = true;
  }

  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
    this.dataReady = true;
  }

  constructor(private dataManager: DataManager, public globals: Globals) {
  }

  ngOnInit(): void {

    this.dataManager.gethexData().subscribe(response => {
      this.theData =  response;
      console.log(this.theData);

    this.dataManager.getsuburbData().subscribe(response => {
      this.theSuburbData =  response;
      console.log(this.theSuburbData);

      this. globals.currentView = "bar";

      this.dataManager.getgeoData().subscribe(response => {
        this.theGeoData =  response;
        console.log(this.theGeoData);

    });
    });
  });
  }


  // public   showThisComponent(theComponent:string) {
  //   this.ShowComponent = theComponent;
  // }
  
}
