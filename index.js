// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 150, left: 80 };

const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const bodySvg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bodySvg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", -36)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("font-family", "sans-serif")
  .text(
    "FCC D3 Data Visualization Projects - Visualize Data with a Chloropleth Map"
  );

const tooltipDiv = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const tooltipDivFlex = d3
  .select("#tooltip")
  .append("div")
  .attr("id", "tooltipFlex");

const path = d3.geoPath();

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
)
  .then(json => {
    console.log("json :", json);
    const counties = bodySvg
      .append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(json, json.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path);
  })
  .catch(err => {
    console.error(err);
  });
