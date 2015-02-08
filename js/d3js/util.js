function position(d){
	var v = dragging[d];
	return v == null ? x(d) : v;
}

function transition(g){
	return g.transition().duration(500);
}

//Devuelve el path para un punto dado
function path(d){
	return line(dimensions.map(function(p){return [position(p), y[p](d[p])];}));
}

function brushstart(){
	d3.event.sourceEvent.stopPropagation();
}

//Maneja un brush event, aosiciando el display a las líneas foreground
function brush(){
	var actives = dimensions.filter(function(p){return !y[p].brush.empty();}),
		extents = actives.map(function(d){return y[p].brush.extent();});
	foreground.style("display", function(d){
		return actives.every(function(d){
			return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) ? null : "none";
	});
}