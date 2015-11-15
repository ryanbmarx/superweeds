var MultiLineChart = require('./multilinechart');

d3.chart('MultiLineChart').extend('ht-planted-chart',{

  updateXScale: function(data) {
    var chart = this;
    data = data || chart.data;

    // Make a hook to set xDomain
    var allData = data.reduce(function(previousValue, currentValue) {
      return previousValue.concat(chart.getSeriesData(currentValue.history));
    }, []);

    chart.xDomain(d3.extent(allData, function(d) { return d[chart.attributes.xKey ]; }));

    chart.xScale()
      .range([0, (chart.dimensions.width)])
      .domain(chart.xDomain());
  },

  updateYScale: function(data) {
    var chart = this;

    data = data || chart.data;

    // This is being overwritten by the user specified yDomain
    var allData = data.reduce(function(previousValue, currentValue) {
      return previousValue.concat(chart.getSeriesData(currentValue.history));
    }, []);

    if(!chart.yDomain()) {
      chart.yDomain(d3.extent(allData, function(d) { return d[chart.attributes.yKey]; }));
    }

    chart.yScale()
      .range([chart.dimensions.height, 0])
      .domain(chart.yDomain());
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
          .attr('class', 'line')
          .attr('id', function(d) {
            return d.team_name;
          });

        var path = selection.append('path')
          .attr('class', 'line')
          .attr('d', function(d) {
            return chart.line(d.history);
          });

        path.each(function(data) {
          selection.filter(function(d) {
            return d.team_name == data.team_name;
          })
          .selectAll('circle')
            .data(data.history)
            .enter()
            .call(function(selection) {
              chart.addPoint(selection);
            });
        });
        return selection;
      }
    });

    chart.xAxis().tickFormat(function(d,i) {
      if(i == 0) {
        return "Game " + d
      }
      return d;
    });
  },

  addPoint: function(selection) {
    var chart = this;

    selection.append('circle')
      .attr('cy', function(d, i) {
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
  }
});


$(document).ready(function(){
	//HT_PLANTED
	var containerWidth = $("#ht-planted-chart div.chart").width();
	var htPlantedChart = d3.select("#ht-planted-chart div.chart")
		.append('svg')
		.classed('multilinechart', true)
		.chart("ht-planted-chart")
		.height(450)
		.width(containerWidth)
		.margins({top:15, right:0, bottom:15, left:0})
		.xAttribute('year')
	    .yDomain([0,100000000])
	    .tooltipEl('#tooltip');

		var drawChart = function() {
			var containerWidth = $("#ht-planted-chart div.chart").width();
			htPlantedChart.width(containerWidth)
			.draw(HT_PLANTED);
		}
		$(window).on('resize', _.throttle(drawChart, 250));


});