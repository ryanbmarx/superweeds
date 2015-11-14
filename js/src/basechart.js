// TODO: Document flow; i.e. which methods are called and in what order

d3.chart('BaseChart', {

  initialize: function() {
    var chart = this;

    this.formats = {};
    this.dimensions = {};
    this.attributes = {};
    this.layers = {};

    this.formats.formatNumber = d3.format('.lf');

    this.on('change:width', chart.initializeDimensions );
    this.on('change:height', chart.initializeDimensions );
    this.on('change:margins', chart.initializeDimensions );

    this.on('change:dimensions', function() {
      this.initializeInnerChart();
      this.addXAxis();
      this.addYAxis();
      this.initializeChart();
    });
  },

  // Gets called when a width, heigh or margins are set
  initializeDimensions: function() {
    var chart = this;

    // Bail out if no dimensions
    // TODO: Make required properties a class property and loop through them instead of listing them specifically
    if(!(chart.dimensions.wrapperHeight && chart.dimensions.wrapperWidth && chart.dimensions.margins)) {
      return;
    }

    chart.dimensions.width = chart.dimensions.wrapperWidth - chart.dimensions.margins.left - chart.dimensions.margins.right;
    chart.dimensions.height = chart.dimensions.wrapperHeight - chart.dimensions.margins.bottom - chart.dimensions.margins.top;

    this.trigger('change:dimensions');

  },

  initializeInnerChart: function() {
    var chart = this;

    if(this.innerChart) {
      this.innerChart.remove();
    }

    this.innerChart = chart.base.append('g')
      .attr('transform', "translate(" + chart.dimensions.margins.left + "," + chart.dimensions.margins.top + ")");
  },

  initializeChart: function() {
    //Visualization specific code goes here
  },

  xScale: function(val) {
    if(val) {
      this._xScale = val;
      return this;
    }

    if(typeof this._xScale === 'undefined') {
      this.xScale(d3.scale.linear());
    }

    return this._xScale;
  },

  yScale: function(val) {
    if(val) {
      this._yScale = val;
      return this;
    }

    
    if(typeof this._yScale === 'undefined') {
      this.yScale(d3.scale.linear());
    }

    return this._yScale;
  },

  updateXScale: function(data) {
    var chart = this;

    if(!chart.xDomain()) {
      chart.xDomain(d3.extent(data, function(d) { return d[chart.attributes.xKey ]; }));
    }

    chart.xScale()
      .range([0, (chart.dimensions.width)])
      .domain(chart.xDomain());
  },

  updateYScale: function(data) {
    var chart = this;

    if(!chart.yDomain()) {
      chart.yDomain(d3.extent(data, function(d) { return d[chart.attributes.yKey ]; }));
    }

    chart.yScale()
      .range([chart.dimensions.height, 0])
      .domain(chart.yDomain());
  },

  xAxis: function(val) {
    var chart = this;

    if(val) {
      chart._xAxis = val;
      return chart;
    }

    if(typeof chart._xAxis == 'undefined') {
      chart._xAxis = chart.initializeXAxis();
    }

    return chart._xAxis;

  },

  initializeXAxis: function() {
    var chart = this;

    return d3.svg.axis()
      .scale(chart.xScale())
      .orient('bottom')
      .ticks(10);
  },

  addXAxis: function() {
    var chart = this;

    chart.layers.xAxis = chart.innerChart.append('g')
      .attr('class', 'x axis')
      .attr('transform', "translate(0," + chart.dimensions.height + ")");

    chart.layer('xAxis', chart.layers.xAxis, {
      dataBind: function(data) {
        chart.updateXScale(data);

        this.call(chart.xAxis());

        return this.data(data);
      },

      insert: function() { return this; }
    });
  },

  yAxis: function(val) {
    var chart = this;

    if(val) {
      chart._yAxis = val;
      return chart;
    }

    if(typeof chart._yAxis == 'undefined') {
      chart._yAxis = chart.initializeYAxis();
    }

    return chart._yAxis;
  },

  initializeYAxis: function() {
    var chart = this; 

    return d3.svg.axis()
      .scale(chart.yScale())
      .orient('right')
      .ticks(10)
      .tickSize(chart.dimensions.wrapperWidth);
  },

  addYAxis: function() {
    var chart = this;

    var leftOffset = chart.dimensions.margins.right - (chart.dimensions.wrapperWidth - chart.dimensions.width);

    chart.layers.yAxis = chart.innerChart.append('g')
      .attr('class', 'y axis')
      .attr('transform', "translate(" + leftOffset + ",0)");

    chart.layer('yAxis', chart.layers.yAxis, {
      dataBind: function(data) {
        chart.updateYScale(data);

        var yAxis = chart.yAxis().tickSize(chart.dimensions.wrapperWidth);

        this.call(chart.yAxis())
          .call(function(g) {
            g.selectAll('text')
              .attr('x', 2)
              .attr('dy', -4);

          })
          .selectAll('g').filter(function(d) { return d !== 0; })
            .classed('minor', true);

        return this.data(data);
      },

      insert: function() { return this; }

    });

  },

  width: function(newWidth) {
    if(!arguments.length) {
      return this.dimensions.wrapperWidth;
    }

    this.dimensions.wrapperWidth = newWidth;
    this.base.attr('width', this.dimensions.wrapperWidth);

    this.trigger('change:width');

    return this;
  },

  height: function(newHeight) {
    if(!arguments.length) {
      return this.dimensions.wrapperHeight;
    }

    this.dimensions.wrapperHeight = newHeight;
    this.base.attr('height', this.dimensions.wrapperHeight);
    this.trigger('change:height');

    return this;
  },

  // Expects an object; { top: , right: , bottom: , left: }
  margins: function(newMargins) {
    if(!arguments.length) {
      return this.dimensions.margins;
    }

    this.dimensions.margins = newMargins;
    this.trigger('change:margins');

    return this;
  },

  xAttribute: function(xKey) {
    if(!arguments.length) {
      return this.this.attributes.xKey;
    }

    this.attributes.xKey = xKey;
    this.trigger('change:xKey');

    return this;
  },

  yAttribute: function(yKey) {
    if(!arguments.length) {
      return this.attributes.yKey;
    }

    this.attributes.yKey = yKey;
    this.trigger('change:yKey');

    return this;
  },

  uniqueID: function(ID) {
    if(!arguments.length) {
      return this.attributes.ID;
    }

    this.attributes.ID = ID;
    this.trigger('change:ID');

    return this;
  },

  xDomain: function(xDomain) {
    var chart = this;

    if(arguments.length) {
      this.attributes.xDomain = xDomain;
      return this;
    }

    return this.attributes.xDomain;
  },

  yDomain: function(yDomain) {
    var chart = this; 

    if(arguments.length) {
      this.attributes.yDomain = yDomain;
      return this;
    }

    return this.attributes.yDomain;
  },

  tooltipEl: function(elId) {
    this.tooltip = d3.select(elId);

    return this;
  },

  redraw: function() {
    var chart = this;

    chart.draw(chart.data);

    return this;
  },

  annotations: function(val) {
    return this;
  }

});