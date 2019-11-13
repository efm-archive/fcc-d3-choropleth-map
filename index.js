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

Promise.all([
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ),
  d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  )
]).then(([countyData, eduData]) => {
  console.log("countyData :", countyData);
  console.log("eduData :", eduData);

  const colorScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range(["yellowgreen", "orangered"]);

  const counties = bodySvg.append("g").attr("class", "counties");

  counties
    .selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => {
      const fipsObj = eduData.filter(item => item.fips == d.id);
      const { bachelorsOrHigher } = fipsObj[0];
      if (bachelorsOrHigher) {
        return bachelorsOrHigher;
      }
    })
    .attr("fill", d => {
      const fipsObj = eduData.filter(item => item.fips == d.id);
      const { bachelorsOrHigher } = fipsObj[0];
      return colorScale(bachelorsOrHigher);
    })
    .on("mouseover", d => {
      const fipsObj = eduData.filter(item => item.fips == d.id);
      const { bachelorsOrHigher, area_name, state } = fipsObj[0];
      tooltipDiv
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 10 + "px")
        .attr("data-fips", d.id);

      tooltipDivFlex
        .style("font-size", "14px")
        .style("font-family", "sans-serif")
        .html(() => {
          return bachelorsOrHigher + "% " + area_name + ", " + state;
        });

      tooltipDiv
        .transition()
        .duration(50)
        .style("opacity", 0.8);
    })
    .on("mouseout", d => {
      tooltipDiv
        .transition()
        .duration(600)
        .style("opacity", 0);
    });
});
