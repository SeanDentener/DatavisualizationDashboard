import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri; 
import { ConfigService } from "../providers/config.service";
import { DataManager } from "../providers/datamanager";




@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css']
})

export class Map2Component implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  @Input() public theData: any
  @Input() public theGeoData: any;

  public finalFilteredData:any;
  public theDirectorateData:any;
  public theDepartmentData:any;
  public dataReady: boolean = false;
  public departmentsReady: boolean = false;
  public directoratesReady: boolean = false;
  

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true })
  private mapViewEl!: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [-33.918861, 18.423300];
  private _basemap = "streets";
  private _loaded = false;
  private _view!: esri.MapView;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  public apiBaseUrl = "";
  public geoDataFeatures:any[] = [];
  public sliderSmall:number = 0;
  public sliderBig:number = 100;

  constructor(private configService: ConfigService,private dataManager: DataManager) {

    this.apiBaseUrl = configService.apiBaseUrl;
  }

  async  initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, GeoJSONLayer, theColor, theCircle, theGraphic] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GeoJSONLayer",
        "esri/Color",
        "esri/geometry/Circle",
        "esri/Graphic"
      ]);

      let color = new theColor({r: 255, g: 0, b: 0, a: 1});
      this.geoDataFeatures = this.theGeoData.features;

      let geojsonLayer = new GeoJSONLayer({
        url: this.apiBaseUrl + '/getgeojsondata',
        copyright: "COCT"
      });
      
      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap,
        // layers: [geojsonLayer ]
        // layers: [suburbLayer ]
      };

      const map: esri.Map = new EsriMap(mapProperties);
      
      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();

      this.sliderBig = this.theData.data[0].Count;
      this.finalFilteredData = this.theData.data;
      console.log(this.theData.data);

      this.drawCircles(this.finalFilteredData);
      


      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
      return this._view;
    }
  }


  public  getGeometryByhex(hexToFind: string) {
    return this.geoDataFeatures.filter((d: { properties: { index: string; }; })=> d.properties.index === hexToFind).map((res: { properties: any; }) => res.properties)
  }

  public formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + 'k';
    }
  
    return value + '';
  }

  public sliderChange() {
  if (this.theData.data != undefined) {
  this.finalFilteredData = this.theData.data.filter((d: { Count: number; }) => d.Count >= this.sliderSmall && d.Count <= this.sliderBig);
  
  
  this.drawCircles(this.finalFilteredData);
  }
  }

public async drawCircles(filteredData:any) {
  
  this._view.graphics.removeAll();
  
  const [ theCircle, theGraphic] = await loadModules([
    "esri/geometry/Circle",
    "esri/Graphic"
  ]);


  filteredData.forEach((element: any) => {
    let theFeature = this.getGeometryByhex(element.h3_level8_index)  
    
    var labelingInfo = [
      {
          labelExpression: "Test",
          labelPlacement: "center-center",
          symbol: {
              type: "text",
              color: "white",
              font: {
                  family: "Arial",
                  size: 12,
                  weight: "bold",
                  decoration: "none"
              }
          }
      }
  ];


    const circleGeometry = new theCircle({
      center: [ theFeature[0].centroid_lon, theFeature[0].centroid_lat ],
      geodesic: true,
      numberOfPoints: element.Count,
      radius: element.Count / 1,
      radiusUnit: "meters",
      
      labelingInfo: labelingInfo
    });

   

    
    this._view.graphics.add(new theGraphic({
    geometry: circleGeometry,
    symbol: {
      type: "simple-fill",
      color: [255, 0, 0, 0.2],

      outline: {
        width: 1,
        color: {r: 255, g: 0, b: 0, a: 1}
      }    }
    
  }));
  });


  
}

  public getDirectorateData() {

    this.dataManager.getDirectoratedata().subscribe(response => {
      console.log(response);
      this.theDirectorateData =  response;
      console.log(this.theDirectorateData.data);
      this.directoratesReady = true;
      this.getDepartmentData(this.theDirectorateData.data[0][0])
    

     
  },
  error => {
    console.log(error);
  });
  }

  public getDepartmentData(directorate:string) {
    
    this.dataManager.getDepartmentdata(directorate).subscribe(response => {
      this.theDepartmentData =  response;
      console.log(this.theDepartmentData);
      this.departmentsReady = true;
      this.dataReady = true;
    },
    error => {
      console.log(error);
    });

  }

  ngOnInit() {

    this.getDirectorateData();
    
    


    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      //this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
       this._view.destroy();
    }
  }
}