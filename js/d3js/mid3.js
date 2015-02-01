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


	console.log(cars);
})