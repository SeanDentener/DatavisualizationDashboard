import { Component } from '@angular/core';
import { DataManager } from '../providers/datamanager';
import * as d3 from 'd3';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})


export class BarComponent {

  public data: any;
  public chartData: ChartDataType[] | undefined;
  public finalChartData: ChartDataType[] | undefined;
  
  public dataReady: boolean = false;

  private svg: any;
  private margin = 50;
  private marginbottom = 125;
  public width = 1000 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  public sliderSmall:number = 0;
  public sliderBig:number = 100;


  constructor(private dataManager: DataManager) {
  }

  ngOnInit(): void {

    this.dataManager.getsuburbData().subscribe(response => {
      this.data =  response;
      this.dataReady = true;
     
      // console.log(this.data['data']);
    
        this.chartData = this.data['data'] as ChartDataType[];

        this.chartData.sort((a, b) => {
          if (a.Count > b.Count)
              return -1;
          if (a.Count < b.Count)
              return 1;
          return 0;
      });

      console.log(this.chartData);



      this.sliderBig = this.chartData[0].Count;
      this.finalChartData = this.chartData;

      this.width = this.finalChartData.length * 20;
      this.createSvg();

        this.drawBars(this.finalChartData);

   

    });


  }

  public formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + 'k';
    }
  
    return value + '';
  }

public sliderChange() {
  if (this.chartData != undefined) {
  this.finalChartData = this.chartData.filter((d) => d.Count >= this.sliderSmall && d.Count <= this.sliderBig);
  this.width = this.finalChartData.length * 20;
  this.drawBars(this.finalChartData);
  }
}



  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.marginbottom * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.marginbottom + ")");
}


private drawBars(data: any[]): void {
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
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.official_suburb))
  .attr("y", (d: any) => y(d.Count))
  .attr("width", x.bandwidth())
  .attr("height", (d: any) => this.height - y(d.Count))
  .attr("fill", "#d04a35");
}



}



type ChartDataType = {
  indexed: number,
  official_suburb: string,
  Count: number
}