document.addEventListener("DOMContentLoaded", async function () {
  const apiData = await fetch(
    "https://api.flagship.fyi/prices/vault/0xBB1AA0491FB6f3694f201b68e6dCb9495c4829CD/historical?chainId=137&interval=DAY"
  ).then((response) => response.json())

  getSvgFromHistorical(apiData)

  function getSvgFromHistorical(data) {
    const svgContainer = d3.select("svg")
    const definitions = svgContainer.append("defs")

    const gradientDefinition = definitions
      .append("linearGradient")
      .attr("id", "svgGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%")

    gradientDefinition
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#baf039") // светло-зеленый
      .attr("stop-opacity", 0.6)

    gradientDefinition
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1e0a46") // темно-фиолетовый
      .attr("stop-opacity", 0.3)

    const margins = { top: 20, right: 20, bottom: 30, left: 50 }
    const graphWidth =
      +svgContainer.attr("width") - margins.left - margins.right
    const graphHeight =
      +svgContainer.attr("height") - margins.top - margins.bottom
    const graphGroup = svgContainer
      .append("g")
      .attr("transform", `translate(${margins.left},${margins.top})`)

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.reportedAt))
      .range([0, graphWidth])

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.price) * 0.95,
        d3.max(data, (d) => d.price),
      ])
      .range([0, graphHeight])

    const lineGenerator = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.reportedAt))
      .y((d) => yScale(d.price))

    const areaGenerator = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.reportedAt))
      .y0(graphHeight)
      .y1((d) => yScale(d.price))

    graphGroup
      .append("path")
      .datum(data)
      .attr("fill", "url(#svgGradient)")
      .attr("d", areaGenerator)

    graphGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#baf039")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator)
  }
})
