var d3 = require('d3')

class SvgHandler {
    constructor(id) {
        this.containerID = id;
    }

    renderGraph(parsedData, ctrl, header1, header2) {

        let top_10_pairs = parsedData.topPairs;
        let source_orgs = parsedData.srcOrgs;
        let dest_orgs = parsedData.destOrgs;
        let alpha = parsedData.alpha;
        let color_palette = parsedData.color_palette;

        let min_value = top_10_pairs[top_10_pairs.length - 1][2]
        let max_value = top_10_pairs[0][2]

        console.log("rendering Graph...");

        let panelWidth = document.getElementById(this.containerID).offsetWidth;
        let panelHeight = document.getElementById(this.containerID).offsetHeight;

        console.log(this.containerID, top_10_pairs);
        // set the dimensions and margins of the graph
        var margin = { top: 50, right: 400, bottom: 25, left: 400 },
            width = panelWidth - margin.left - margin.right,
            height = ctrl.height - margin.top - margin.bottom;



        // append the svg object to the body of the page
        var svg = d3.select("#" + this.containerID)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // function to wrap text!
        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

        // Add X scale
        var x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width])


        // y scales
        var yl = d3.scaleLinear()
            .domain([0, source_orgs.length - 1])
            .range([0, height])

        var yr = d3.scaleLinear()
            .domain([0, dest_orgs.length - 1])
            .range([0, height])


        // Add Y axes
        var leftAxis = d3.axisLeft(yl)
            .tickSize(5)
            .ticks(source_orgs.length)
            .tickFormat((d) => {
                return source_orgs[d]
            })

        var rightAxis = d3.axisRight(yr)
            .tickSize(5)
            .ticks(dest_orgs.length)
            .tickFormat((d) => {
                return dest_orgs[d]
            })

        svg.append("g").call(leftAxis)
            .attr("class", "axis")
            .attr("margin", 10)
            .selectAll(".tick text")
            .call(wrap, margin.left - 50)
            .attr("transform", "translate(" + -10 + ",0)")

        svg.append("g")
            .attr("transform", "translate(" + width + ",0)")
            .call(rightAxis)
            .attr("class", "axis")
            .selectAll(".tick text")
            .call(wrap, margin.right - 50)
            .attr("transform", "translate(" + 10 + ",0)")



        // scale for width of lines
        var w = d3.scaleLinear()
            .domain([top_10_pairs[top_10_pairs.length - 1][2], top_10_pairs[0][2]])
            .range([3, 15])

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        // Add the lines
        for (i in top_10_pairs) {
            var value = top_10_pairs[i][2];

            svg.append("path")
                .datum(top_10_pairs[i].coords)
                .attr("fill", "none")
                .attr("stroke", function (d) { return d[0].color })
                //() => {
                //     var alpha = 0.7; // w(top_10_pairs[i][2]) / 5;
                //     var color = "rgba(51, 102, 255," + alpha + ")";
                //     return color;
                // })
                .attr("stroke-width", w(top_10_pairs[i][2]))
                .attr("d", d3.line()
                    .x(function (d) { return x(d.x) })
                    .y(function (d) {
                        if (d.x == 0) {
                            return yl(d.y)
                        } else {
                            return yr(d.y)
                        }
                    }))
                .on("mouseover", function (d) {
                    d3.select(this).attr("stroke", "darkblue")
                        .attr("class", "path-hover");
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(() => {                    // takes in value in BYTES and converts to appropriate MB,GB, etc
                        var value = d[0].value;
                        value = value / 1000
                        if (value < 1000) {
                            return (Math.round(value * 10) / 10) + "KB";
                        } else {
                            value = value / 1000;
                            if (value < 1000) {
                                return (Math.round(value * 10) / 10) + "MB"
                            } else {
                                value = value / 1000;
                                if (value < 1000) {
                                    return (Math.round(value * 10) / 10) + "GB"
                                } else {
                                    value = value / 1000;
                                    return (Math.round(value * 10) / 10) + "TB"
                                }
                            }
                        }
                    })
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    d3.select(this).attr("stroke", () => {
                        return d[0].color;
                    })
                })
        }

        // Add axis labels
        svg.append("text")
            .attr("class", "header-text")
            .attr("transform", "translate(" + -(margin.left / 2) + "," + -(margin.top / 2) + ")")  // above left axis
            .attr("text-anchor", "center")
            .text(header1);

        svg.append("text")
            .attr("class", "header-text")
            .attr("transform", "translate(" + (width + margin.right / 5) + "," + -(margin.top / 2) + ")")  // above right axis
            .attr("text-anchor", "center")
            .text(header2);

        // add legend

        // var colorScale = d3.scaleQuantize()
        //     .domain([min_value,max_value])
        //     .range(color_palette);

        // var colorLegend = d3.legendColor()
        //     .labelFormat(d3.format(".0f"))
        //     .scale(colorScale)
        //     .shapePadding(3)
        //     .shapeWidth(50)
        //     .shapeHeight(20)
        //     .labelOffset(12);

        // svg.append("g")
        //     .attr("transform", "translate(" + (width + margin.right / 2) + ", 60)")
        //     .call(colorLegend);
    }

}

module.exports = SvgHandler;