var LOCATIONS = "http://donnees.ville.montreal.qc.ca/dataset/f170fecc-18db-44bc-b4fe-5b0b6d2c7297/resource/c7d0546a-a218-479e-bc9f-ce8f13ca972c/download/localisationcompteursvelo2015.csv";
var Y2018 = "http://donnees.ville.montreal.qc.ca/dataset/f170fecc-18db-44bc-b4fe-5b0b6d2c7297/resource/eea2434f-32b3-4dc5-9035-f1642509f0e7/download/comptage_velo_2018.csv";
var WIDTH = 420, BARHEIGHT = 20, BARWIDTH = 20;

var data;
var bars;
var header;

function update( index ) {
	var x = d3.scaleLinear().domain([ 0, d3.max( data[index].data ) ]).range([ 0, WIDTH ]);		
	bars.data( data[index].data );

	bars.select("rect.bar-block").transition().attr("width", d => Math.max(BARWIDTH, x(d)) ).attr("height", BARHEIGHT - 1);
	bars.select("text.bar-value").transition().attr("x", d => Math.max(x(d), BARWIDTH) - 3 ).attr("y", BARHEIGHT / 2).attr("dy", "0.35em").text( d => d );
	bars.select("text.bar-name").transition().attr("x", d => Math.max(x(d), BARWIDTH) + 3 ).attr("y", BARHEIGHT / 2).attr("dy", "0.35em").text( ( d, i ) => header[i] );
}
	
$( document ).ready( e => {
	$.get(Y2018, raw => {
		var raw = raw.split('\n').map( row => row.split(',') );
		header = raw.shift().slice(2);
		header = header.map( (key, index) => key.length > 0 ? key : "column_" + index );

		data = raw.map( (row) => {
			return { date: row.shift(), data: row.slice(1).map( i => parseInt(i) || 0 ) }
		});

		var dates = d3.select(".dates").selectAll("option").data( data.map( d => d.date ) ).enter().append("option").attr("value", (d, i) => i).text( d => d);

		d3.select('.dates')
		  .on('change', function() {
		    var index = parseInt(d3.select(this).property('value')) || 0;
		    update( index );
		});

		var x = d3.scaleLinear().domain([ 0, d3.max( data[0].data ) ]).range([ 0, WIDTH ]);		

		bars = d3.select(".chart").attr( "width", WIDTH + 240 ).attr( "height", BARHEIGHT * data[0].data.length )
			.selectAll("g")
			.data( data[0].data )
			.enter().append("g").attr( "transform", ( d, i ) => "translate(0, " + i * BARHEIGHT + ")" );

		bars.append("rect").attr("class", "bar-block");//.attr("width", d => Math.max(BARWIDTH, x(d)) ).attr("height", BARHEIGHT - 1);
		bars.append("text").attr("class", "bar-value");//.attr("x", d => x(d) - 3 ).attr("y", BARHEIGHT / 2).attr("dy", "0.35em").text( d => d );
		bars.append("text").attr("class", "bar-name");

		update( 0 );

		// console.log( 'processed', data );
	});
});