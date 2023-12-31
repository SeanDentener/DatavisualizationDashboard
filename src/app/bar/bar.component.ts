import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataManager } from '../providers/datamanager';
import * as d3 from 'd3';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})


export class BarComponent {

  @Input() public theData: any
  public data: any
  public chartData: ChartDataType[] | undefined;
  public finalChartData: ChartDataType[] | undefined;
  
  @Output() barLoadedEvent = new EventEmitter<boolean>();
public dataReady: boolean = false;

  public searchSuburb:string = '';
  private svg: any;
  private margin = 50;
  private marginbottom = 125;
  public width = 800 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  public sliderSmall:number = 0;
  public sliderBig:number = 4000;

  

  constructor(private dataManager: DataManager) {
  }

  ngOnInit(): void {
      this.data = this.theData;
   
      this.chartData = this.data['data'] as ChartDataType[];

      this.chartData.sort((a, b) => {
          if (a.Count > b.Count)
              return -1;
          if (a.Count < b.Count)
              return 1;
          return 0;
      });

      this.sliderBig = this.chartData[0].Count;
    
      this.finalChartData = this.chartData;

      this.width = this.finalChartData.length * 15;
      if (this.width < 1000){
        this.width = 1000;
      }
      this.createSvg();

        this.drawBars(this.finalChartData);

        this.dataReady = true;
        this.barLoadedEvent.emit(true);

  }

  public formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + 'k';
    }
  
    return value + '';
  }

public sliderChange() {
  this.searchSuburb = '';

  if (this.chartData != undefined) {
  this.finalChartData = this.chartData.filter((d) => d.Count >= this.sliderSmall && d.Count <= this.sliderBig);
  this.width = this.finalChartData.length  * 15;
  if (this.width < 1000){
    this.width = 1000;
  }
  this.drawBars(this.finalChartData);
  }
}



  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.marginbottom * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.marginbottom  + ")");
}


public drawBars(data: any[]): void {


  let largestCount = this.finalChartData != null? this.finalChartData[0].Count  : 1000

  // Create the X-axis band scale
  d3.selectAll("g > *").remove()

  const x = d3.scaleBand()
  .range([0, this.width])
  //.domain(data.map(d => d))
  .domain(data.map((d: { official_suburb: any; }) => d.official_suburb))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, this.sliderBig])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  

  this.svg.selectAll("bars")
  .data(data)
  // .data(data.filter(function(d){return d.official_suburb = searchSuburb }))
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.official_suburb))
  .attr("y", (d: any) => y(d.Count))
  .attr("width", x.bandwidth())
  .attr("height", (d: any) => this.height - y(d.Count))
  .attr("fill", "#d04a35")
  .style("fill-opacity", function(d: any) {
    return d.Count /  largestCount;
  });
}

public searchForParticularSuburb(event:any) {
  console.log(event);
  if (event.keyCode === 13) {
    this.searchSuburb = this.searchSuburb.toUpperCase();
    
    this.chartData = this.data['data'] as ChartDataType[];
    this.finalChartData = this.chartData;
    this.finalChartData = this.finalChartData?.filter(d => d.official_suburb.indexOf(this.searchSuburb) > -1);
    this.sliderBig = this.finalChartData[0].Count;
    this.width = this.finalChartData.length  * 15;
    if (this.width < 1000){
      this.width = 1000;
    }

  this.drawBars(this.finalChartData);
  }

}

public searchForParticularSuburbButtonClick() {

    this.searchSuburb = this.searchSuburb.toUpperCase();
    
    this.chartData = this.data['data'] as ChartDataType[];
    this.finalChartData = this.chartData;
    this.finalChartData = this.finalChartData?.filter(d => d.official_suburb.indexOf(this.searchSuburb) > -1);
    this.sliderBig = this.finalChartData[0].Count;
    this.width = this.finalChartData.length  * 15;
    if (this.width < 1000){
      this.width = 1000;
    }

  this.drawBars(this.finalChartData);


}


public ClearSearch() {
  this.searchSuburb = '';
  this.chartData = this.data['data'] as ChartDataType[];
  this.finalChartData = this.chartData;
  this.sliderBig = this.chartData[0].Count;
  this.width = this.finalChartData.length  * 15;
    if (this.width < 1000){
      this.width = 1000;
    }
  this.drawBars(this.finalChartData);
}

}



type ChartDataType = {
  indexed: number,
  official_suburb: string,
  Count: number
}