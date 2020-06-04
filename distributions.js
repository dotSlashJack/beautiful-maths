function generateGaussianSamples(nSamples, mu, sigma){
    var gaussianSampler = d3.randomNormal(mu, sigma);
    i = 0;
    samples = [];
    while(i<nSamples){
        samples.push(gaussianSampler());
        i = i+1;
    }
    return samples;
}

function gaussianFunc(mu, variance, amplitudeConst) {
    var sigma = Math.sqrt(variance);
    var a = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return (function(val) {
        return a * Math.pow(Math.E, - 0.5 * Math.pow(((val - mu) / variance), 2 )) * amplitudeConst;
      });
}

function getTallestBar(bins){ //get the max height to use to amplify the normal PDF
    var maxLength = 0;
    for(i = 0; i<bins.length; i++){
        if (bins[i].length > maxLength) {
            maxLength = bins[i].length;
        }
    }
    return maxLength;
}

var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//function generateHistogram(nSamples){
nSamples = 2;
var xmin = -4, xmax = 4;

// append the svg object to the body of the page
var svg = d3.select("#histogram_svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// convert the values to the specified svg size (range)
var x = d3.scaleLinear()
    .domain([xmin, xmax]) //the true domain(to be shown on the x axis)
    //.domain([0 ,d3.max(data, function(d) { return d })])
    .range([0, width]); //fill the width of the svg with the domain values
svg.append("g")
    .attr("transform", "translate(0," + height + ")") //move the x axis to the bottom (offset by height var)
    .call(d3.axisBottom(x));

var histogram = d3.histogram()
    .value(function(d) { return d; })
    .domain(x.domain())
    .thresholds(x.ticks(35)); //number of bins goes inside .ticks()

//function generateHistogram(nSamples){
//const nSamples = 1000;
data = generateGaussianSamples(nSamples,0,1);

// And apply this function to data to get the bins
var bins = histogram(data);

var maxBarHeight = getTallestBar(bins);
var amplitudeConst =  maxBarHeight / 0.4; //because 0.4*ampCosnt = max height

var ymin = 0, ymax = 1.05 * maxBarHeight;

var y = d3.scaleLinear()
    .range([height,0]);
    y.domain([ymin, ymax]); 
svg.append("g")
    .attr("class","y_axis")
    .call(d3.axisLeft(y));

var histRects = svg.selectAll("rect")
    //.attr("class","hist")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("class", "rects")
    //.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length / nSamples) + ")"; })
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
    //.attr("height", function(d) { console.log(y(d.length)); return height - y((d.length / nSamples)) ; }) //d.length is the "height" of the bar (num of vals in that bin)
    .attr("height", function(d) { return height - y(d.length); })
    .style("fill", "#69b3a2");

var normCurve = gaussianFunc(0, 1, amplitudeConst);

svg.append("g")
    .attr("class","curve")
    .attr("transform", "translate(0," + (-2*(margin.top+margin.botttom)) + ")")
    //.call(d3.axisBottom(x))
    .classed("series",true)
    .append("path")
        .attr("d", function(d) { return d3.line()(
            x.ticks(1000).map(function(val){
                return [ x(val), y(normCurve(val))]
            })
        )})
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

function update(nSamples){

    var svg = d3.select("#histogram_svg").transition();

    var xmin = -4, xmax = 4;

    var x = d3.scaleLinear()
        .domain([xmin, xmax]) //the true domain(to be shown on the x axis)
        .range([0, width]); //fill the width of the svg with the domain values

    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(x.domain())
        .thresholds(x.ticks(35)); //number of bins goes inside .ticks()

    var data = generateGaussianSamples(nSamples,0,1);

    // And apply this function to data to get the bins
    var bins = histogram(data);

    maxBarHeight = getTallestBar(bins);
    amplitudeConst =  maxBarHeight / 0.4; //because 0.4*ampCosnt = max height

    var ymin = 0, ymax = 1.05 * maxBarHeight;

    var y = d3.scaleLinear()
        .range([height,0]);
        y.domain([ymin, ymax]); 

    svg.select(".y_axis")
        .call(d3.axisLeft(y));

    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(x.domain())
        .thresholds(x.ticks(35)); //number of bins goes inside .ticks()
    
    histRects = histRects
        .remove()
        .exit()
        //.enter()
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2");
}
