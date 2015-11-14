var BaseChart = require('./basechart');
// BASE MULTI LINE CHART
module.exports = d3.chart('BaseChart').extend('MultiLineChart', {
  updateXScale: function(data) {
    var chart = this;
    data = data || chart.data;

    var allData = data.reduce(function(previousValue, currentValue) {
      return previousValue.concat(chart.getSeriesData(currentValue));
    }, []);

    chart.xDomain(d3.extent(allData, function(d) { return d[chart.attributes.xKey ]; }));

    chart.xScale()
      .range([0, (chart.dimensions.width)])
      .domain(chart.xDomain());
  },

  getSeriesData: function(d) {
    return d;
  },

  getLineSlug: function(d, i) {
    return 'line' + i;
  },

  defineLine: function() {
    var chart = this;

    chart.line = d3.svg.line()
      .x(function(d){ return chart.xScale()(d[chart.attributes.xKey]); })
      .y(function(d){ return chart.yScale()(d[chart.attributes.yKey]); });
  },

  initializeChart: function() {
    var chart = this;

    chart.layers.lines = chart.innerChart.append('g')
      .classed('lines', true);

    chart.layer('lines', chart.layers.lines, {
      dataBind: function(data) {
        chart.defineLine();

        return this.selectAll('.line')
          .data(data);
      },

      insert: function() {
        var selection = this.append('g')
          .attr('class', chart.getLineSlug);

        var path = selection.append('path')
          .attr('class', 'line')
          .attr('d', chart.line);

        path.each(function(points) {
          selection.selectAll('circle')
            .data(points)
            .enter()
            .call(function(selection) {

              chart.addPoint(selection);
            });
        });
        return selection;
      }
    });
  },

  addPoint: function(selection) {
    var chart = this;
    selection.append('circle')
      .attr('cy', function(d) {
        return chart.yScale()(d[chart.attributes.yKey]);
      })
      .attr('cx', function(d) {
        return chart.xScale()(d[chart.attributes.xKey]);
      })
      .attr('r', 6)
      .on('mouseover', function(d) {
        var el = d3.select(this);
        el.classed('active', true);

        this.parentNode.appendChild(this);

        chart.mouseOverPoint(d, el);
      })
      .on('mousemove', function(d) {
        var el = d3.select(this);

        chart.mouseMovePoint(d, el);
      })
      .on('mouseout', function(d) {
        var el = d3.select(this);
        el.classed('active', false);

        chart.mouseOutPoint(d, el);
      });
  },

  mouseOverPoint: function(d, el) {
    // mouse over a circle point code goes here
  },

  mouseOutPoint: function(d, el) {
    // mouse out a circle point code goes here
  },

  mouseMovePoint: function(d, el) {
    // mouse move a circle point code goes here
  }
});