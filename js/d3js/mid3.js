var margin = {top:30, right:10, bottom:10, left:10},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
	.rangePoints([0, width], 1),
	y={},
	dragging = {};

var line = d3.svg.line(),
	axis = d3.svg.axis().orient("left"),
	background,
	foreground;

var svg = d3.select("body").append("svg")
	.attr({
		width: width+margin.left+margin.right,
		height: height + margin.top + margin.bottom
	})
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')');

d3.csv("./csv/cars.csv", function(error, cars){


	//console.log(cars);
	//Se extrae la lista de dimensiones y se crea una escala para cada una
	x.domain(dimensions=d3.keys(cars[0]).filter(function(d){
		return d!="name"&&(y[d] = d3.scale.linear()
			.domain(d3.extent(cars, function(p){ return +p[d];}))
			.range([height,0]));
	}));

	//Se añaden las lineas de fondo grises
	background = svg.append("g")
		.attr('class', 'background')
		.selectAll('path')
		.data(cars)
		.enter().append('path')
		.attr('d', path);

	// Se añaden las lineas azules en el foco
	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(cars)
		.enter().append('path')
		.attr('d', path);

	// Se añade un grupo de elementos por cada dimensión
	var g=svg.selectAll(".dimension")
		.data(dimensions)
		.enter().append('g')
		.attr('class', 'dimension')
		.attr('transform', function(d){return "translate("+x(d)+")";})
		.call(d3.behavior.drag()
			.origin(function(d){return {x: x(d)};})
			.on("dragstart",function(d){
				dragging[d]=x(d);
				brackground.attr("visibility","hidden");
			})
			.on("drag", function(d){
				dragging[d] = Math.min(width, Math.max(0,d3.event.x));
				foreground.attr('d', path);
				dimensions.sort(function(a,b){return position(a)-position(b);});
				x.domain(dimensions);
				g.attr('transform', function(d){return "translate("+position(d)+")";});
			})
			.on("dragend", function(d){
				delete dragging[d];
				transition(d3.select(this)).attr('transform', "translate("+x(d)+")"); //function(d){return "translate("+x(d)+")";}
				transition(foreground).attr('d', path);
				background
						.attr('d', path)
					.transition()
						.delay(500)
						.duration(0)
						.attr('visibility', null);
			}));


	// Se añaden ejes y títulos
	g.append("g")
			.attr('class', 'axis')
			.each(function(d){ d3.select(this).call(axis.scale(y[d]));})
		.append("text")
			.style("text-anchor", "middle")
			.attr('y', -9)
			.text(function(d){ return d;});

	// Se añade y almacena un pincel para cada eje
	g.append('g')
		.attr('class', 'brush')
		.each(function(d){
			d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart)
				.on("brush",brush));
		})
		.selectAll("rect")
			.attr('x', -8)
			.attr('width', 16);

});	
