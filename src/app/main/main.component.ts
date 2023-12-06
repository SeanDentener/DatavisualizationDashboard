import { Component } from '@angular/core';
import { DataManager } from '../providers/datamanager';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  public theAllData: any;
  public theData: any;
  public theGeoData: any;

  public dataReady: boolean = false;

  mapCenter = [ 18.423300, -33.918861];
  basemapType = 'streets';
  mapZoomLevel = 10;
  
  public ShowComponent:string = "bar";

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  constructor(private dataManager: DataManager) {
  }

  ngOnInit(): void {
    this.dataManager.getHexData().subscribe(response => {
      this.theData =  response;
      console.log(this.theData);

      this.dataManager.getgeoData().subscribe(response => {
        this.theGeoData =  response;
        console.log(this.theGeoData);

        // this.dataManager.getAlldata().subscribe(response => {
        //   this.theAllData =  response;
        //   console.log(this.theAllData);



        this.dataReady = true;

    //});
    });
    });
  }


  public   showThisComponent(theComponent:string) {
    this.ShowComponent = theComponent;
  }
  
}
