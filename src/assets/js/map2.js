// function runMap2() {


var svg = d3.select("svg");

width = 960;
height = 500;
var dataArray  = [];
var mydataArray= []; 
var projection = d3.geoMercator();
var baseProjection = d3.geoMercator();

var path = d3.geoPath().projection(projection);
var gBackground = svg.append("g"); // appended first
var  gProvince = svg.append("g");  
var gDataPoints = svg.append("g"); // appended second
var ttooltip = d3.select("body").append("div")
      .attr("class", "ttooltip");
var csvPath="https://dl.dropbox.com/s/rb9trt4zy87ezi3/lonlat.csv?dl=0";

d3.csv(csvPath, function(error, data) {

  if (error) throw error;

  d3.json("https://gist.githubusercontent.com/rveciana/5919944/raw/2fef6be25d39ebeb3bead3933b2c9380497ddff4/nuts0.json", function(error, nuts0) {

  if (error) throw error;

  d3.json("https://gist.githubusercontent.com/rveciana/5919944/raw/2fef6be25d39ebeb3bead3933b2c9380497ddff4/nuts2.json", function(error, nuts2) {
    if (error) throw error;

  // convert topojson back to geojson
  var countries = topojson.feature(nuts0, nuts0.objects.nuts0);
  var regions = topojson.feature(nuts2, nuts2.objects.nuts2);
  baseProjection.fitSize([width,height],regions);
  projection.fitSize([width,height],regions);
  var color = d3.scaleLinear().range(["steelblue","darkblue"]).domain([0,countries.features.length]);
  var regionColor = d3.scaleLinear().range(["orange","red"]);

  baseProjection.fitSize([width,height],countries);
  projection.fitSize([width,height],countries);
  var featureCollectionCountries = { "type":"FeatureCollection", "features": countries.features };
  gBackground
    .attr("class", "country")
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("fill",function(d,i) { return color(i); })
    .attr("opacity",0.7)
    .attr("d", path)
    .style("stroke","black")
    .style("stroke-width",0)
    .on("mouseover", function() {
        d3.select(this)
          .style("stroke-width",1)
          .raise();
    })
    .on("mouseout", function(d,i) {
        d3.select(this)
          .style("stroke-width", 0 );
    })
    ///// now zoom in when clicked and show subdivisions:
    .on("click", function(d) {
        // remove all other subdivisions:
        d3.selectAll(".region")
          .remove();

        // add new features:


        var features = regions.features.filter(function(feature) { return feature.properties.nuts_id.substring(0,2) == d.properties.nuts_id; });



        regionColor.domain([0,features.length])

        gProvince.selectAll(null)
          .data(features)
          .enter()
          .append("path")
          .attr("class","region")
          .attr("fill", function(d,i) { return regionColor(i) })
          .attr("d", path)
          .style("stroke","black")
          .style("stroke-width",0)
          .on("click", function() {
            zoom(projection,baseProjection);
            d3.selectAll(".subdivision")
              .remove();          
          })
          .on("mouseover", function() {
                d3.select(this)
                  .style("stroke-width",1)
                  .raise();
          })
          .on("mouseout", function(d,i) {
                d3.select(this)
                  .style("stroke-width", 0 );
          })
          .raise()

        // zoom to selected features:
        var featureCollection = { "type":"FeatureCollection", "features": features }

        manipulate(data,features);
        redraw(featureCollection);

        var endProjection = d3.geoMercator();

        zoom(projection,endProjection.fitExtent([[50,50],[width-50,height-50]],featureCollection));

    }); 

    dataArray  = data;
    redraw(featureCollectionCountries);
  });
});
});

function zoom(startProjection,endProjection,middleProjection) {

  if(!middleProjection) {
      d3.selectAll("path")
        .transition()
        .attrTween("d", function(d) {
          var s = d3.interpolate(startProjection.scale(), endProjection.scale());
          var x = d3.interpolate(startProjection.translate()[0], endProjection.translate()[0]);
          var y = d3.interpolate(startProjection.translate()[1], endProjection.translate()[1]);
            return function(t) {
              projection
                .scale(s(t))
                .translate([x(t),y(t)])

              path.projection(projection);
              return path(d);
            }
         })
        .duration(1000);
    }
    else {
      d3.selectAll("path")
        .transition()
        .attrTween("d", function(d) {

          var s1 = d3.interpolate(startProjection.scale(),middleProjection.scale());
          var s2 = d3.interpolate(middleProjection.scale(),endProjection.scale()); 
          var x = d3.interpolate(startProjection.translate()[0], endProjection.translate()[0]);
          var y = d3.interpolate(startProjection.translate()[1], endProjection.translate()[1]);

          function s(t) {
            if (t < 0.5) return s1; return s2; 
          }

           return function(t) {                 
               projection
                .translate([x(t),y(t)])
                .scale(s(t)(t))

              path.projection(projection);
              return path(d);
            }
         })
        .duration(1500);    
    }

}


function redraw(featureCollection,type) {
        var mapG = d3.select('svg g.country');

        d3.selectAll('circle')
          .remove();

        let grp = gDataPoints
                  .attr("class", "circle")
                  .selectAll("circle")
                  .data(dataArray,function(d) { return d.NOM; })
        let grpEnter = grp.enter()
        let group = grpEnter
        group.append("circle")
             .attr('fill', 'rgba(135, 5, 151, 125)')
             .attr('stroke', 'black')
             .each(function(d) {
                                 if (d.lon === null ) return;
                                 if (isNaN(d.lon ))return;
                                 if (d.lat === null) return;
                                 if (isNaN(d.lat ))return;
                                 var pos = projection([parseFloat(d.lon), parseFloat(d.lat)]);
                                 d.cx = pos[0];
                                 d.cy = pos[1];
             })
             .attr("cx", function(d) {
                        return d.cx;
             })
            .attr("cy", function(d) {
                    return d.cy;
            })
            .attr("r",0.5)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)          
            .on('mousemove', function(d) {
                                var xPos = d3.mouse(this)[0] - 15;
                                var yPos = d3.mouse(this)[1] - 55;
                                ttooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
                                ttooltip.style('opacity', 1);
                                var html = "<span>" + d.lon+ "</span>, <span>" + d.lat + "</span>";
                                 ttooltip.html(html);

            });
            // Setup each circle with a transition, each transition working on transform attribute,
            // and using the translateFn
            group
                .transition()
                .duration(2000)
                .attrTween("transform",function(d) {
                             return  mapG._groups[0][0] != null ? recenter(featureCollection): null;
                 });
            group.exit().remove() // exit > remove >  g

    }



    function recenter(featureCollection) {
        console.log('recentering');     

    };


function manipulate(data,features){      

                    dataArray= [];
                    mydataArray =[];        

                    data.forEach(function(ddd) 
                    {
                        features.forEach(function(feature) 
                        {
                            var polygoneOriginal =feature;

                            var points = [parseFloat(ddd.lon), parseFloat(ddd.lat)];

                            var isIn = d3.geoContains(polygoneOriginal, points);
                            if(isIn)
                            {

                               var element = ddd;
                                mydataArray.pushIfNotExist(element, function(e) { 
                                    return e.lat === element.lat && e.lon === element.lon   ; 
                                });

                            }

                        });


                    });

                    if(mydataArray.length>0)
                    {

                       var columnsArray= ["lon","lat"];
                       dataArray=mydataArray;
                       dataArray.columns = columnsArray;


                    }      
}


    function showTooltip(d) {
      var html = "<span>" + d.lon+ "</span>, <span>" + d.lat + "</span>";
      ttooltip.html(html);
      ttooltip
        .style("left", window.pageXOffset + d3.event.x + 12 + "px")
        .style("top", window.pageYOffset + d3.event.y + 12 + "px")
        .transition()
        .style("opacity", 1);

        return d3.select(this).attr('fill', 'rgba(103, 65, 114, 0.8)');

    }

function hideTooltip() {
      ttooltip
        .transition()
        .style("opacity", 0);
         return d3.select(this).attr('fill', 'rgba(103, 65, 114, 0.5)');
}

// }