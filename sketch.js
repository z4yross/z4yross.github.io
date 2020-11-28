const key = 'pk.eyJ1IjoiejR5cm9zcyIsImEiOiJjazV4NjBvYmwwMGUxM21zMWkyMm40MXNnIn0.EHFa83h5pTRfQPEDhccw6Q'
const mappa = new Mappa('MapboxGL', key);

var data_nq = n
var data_q = q
var ct_gep = city
var past_data = past_data

var clng = 0
var clat = 45

var cx
var cy

const incP = 1451692800000

const incN = 1577836800000
const fnlN = 1661990400000

const incQ = 1598918400000
const fnlQ = 1661990400000

const step = 86400000
var act = incP

var zoom
var mp

var Velocidad = 10

var r_s
var g_s
var b_s

var ox
var p10x
var p25x


const options = {
	style: 'mapbox://styles/mapbox/dark-v9',
	// style: 'mapbox://styles/z4yross/ckhzcotmb0xnq1apacs7z56xu',
	// center: [0, 0],
	// zoom: 1,
	lat: 0,
  	lng: 0,
	zoom: 1.5,
	dragRotate: false,
	touchZoomRotate: false,
	trackResize: true,
	touchPitch: false,
	dragPan: false
	// renderWorldCopies: false,
}

var cv;
var gui;

var Animacion = false
var sliderTime;
var frame = 0
var Tamano_puntos = 10
var Cuarentena = false
var Pais = "AR"
var Ciudad = "Buenos Aires"
var Seguimiento = false


function setup() {
	cv = createCanvas(windowWidth, windowHeight);	

	gui = createGui('Opciones').setPosition(50, 50);
	sliderRange(1, 61, 2);
	gui.addGlobals('Animacion', 'Velocidad', "Tamano_puntos", "Cuarentena", "Pais", "Ciudad", "Seguimiento");

	slider()
	// sliderTime.style('background-color', '#000000')

	myMap = mappa.tileMap(options);
	myMap.overlay(cv);

	zoom = myMap.options.zoom

	cx = mercX(myMap.options.lng)
	cy = mercY(myMap.options.lat)
	// sliderRange(0, 10, 1);

	l_sliders()
	act_slider()
}

function draw() {
	
	frame++
	if(frame > frameRate()) frame = 0

	clear();
	prd_ln()

	act = sliderTime.value()
	textSize(20);
	fill(160, 160, 160)
	noStroke()

	textAlign(CENTER, CENTER);

	date = new Date(act)
	text(date.toDateString(), width / 2, height - 90 )
	// text(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(), width / 2, height - 90);
	
	if(myMap.map != undefined){
		zoom = myMap.map.transform.zoom

		cx = mercX(myMap.map.transform.center.lng)
		cy = mercY(myMap.map.transform.center.lat)
	}

	legend()

	translate(windowWidth / 2, windowHeight / 2)

	allCt(act)
	
	
	var fnl 
	if(Cuarentena) fnl = fnlQ
	else fnl = fnlN

	if(Animacion)
		if(act < fnl && frame % Math.round(frameRate()/Velocidad) == 0) {
			act += step
			
		}

	sliderTime.value(act)
	if(Seguimiento) act_slider()

}

function act_slider(){
	r_s.value(ox)
	g_s.value(p10x)
	b_s.value(p25x)
}

function slider(){
	sliderTime = createSlider(incP, fnlQ, incP, step);
	sliderTime.position(50, windowHeight - 70);
  	sliderTime.style('width', width - 55 + 'px');
}

function prd_ln(){
	var x
	fill(150)
	textSize(20);
	if(Cuarentena){
		x = map(incQ, incP, fnlQ, 50, width - 55)
		textAlign(CENTER, CENTER);
		text("Prediccion", x,  height - 90 )
	}
	else{
		x = map(incN, incP, fnlQ, 50, width - 55)
		textAlign(CENTER, CENTER);
		text("Prediccion", x,  height - 90 )
	}
	stroke(150,150,150)
	y = windowHeight - 70
	strokeWeight(5);
	line(x, y - 5, x, y + 10)
}


function allCt(stm){
	var dt 

	if(Cuarentena) 
		if(stm < incQ)
			dt = past_data
		else
			dt = data_q
	else
		if(stm < incN)
			dt = past_data
		else
			dt = data_nq

	for (var c in dt){
		for (var ct in dt[c]){
			var x = mercX(ct_gep[ct + c].lng);
			var y = mercY(ct_gep[ct + c].lat);
			strokeWeight(10);
			stroke(255)
			noStroke()
			// var ll = dt[c][ct]["o3_median"]["" + stm] + dt[c][ct]["pm10_median"]["" + stm] + dt[c][ct]["pm25_median"]["" + stm]

			r = map(dt[c][ct]["o3_median"]["" + stm], 0, 30, 0, 255)
			g = map(dt[c][ct]["pm10_median"]["" + stm], 0, 50, 0, 255)
			b = map(dt[c][ct]["pm25_median"]["" + stm], 0, 80, 0, 255)

			var ll = r + g + b
			a = map(ll, 0, 255*3, 0, 255)
			var p10x
			var p25x
			
			if(c == Pais){
				if(ct == Ciudad){
					this.ox = map(dt[c][ct]["o3_median"]["" + stm], 0, 30, 0, 255)
					this.p10x = map(dt[c][ct]["pm10_median"]["" + stm], 0, 50, 0, 255)
					this.p25x = map(dt[c][ct]["pm25_median"]["" + stm], 0, 80, 0, 255)
				}
			}


			fill(r, g, b, a)

			if(dt[c][ct]["o3_median"]["" + stm] == undefined || dt[c][ct]["pm10_median"]["" + stm] == undefined || dt[c][ct]["pm25_median"]["" + stm] == undefined) 
				square(x - cx, y - cy, zoom / 1.5 * Tamano_puntos)
			else 
				ellipse(x - cx, y - cy, zoom / 1.5 * Tamano_puntos, zoom / 1.5 * Tamano_puntos)
		}
	}	
}

function l_sliders(){
	r_s = createSlider(0, 255, 255, 1)
	g_s = createSlider(0, 255, 255, 1)
	b_s = createSlider(0, 255, 255, 1)

	r_s.position(width - 255 - 100, 50 + 25/2);
  	r_s.style('width', 255 + 'px');

	g_s.position(width - 255 - 100, 100 + 25/2);
  	g_s.style('width', 255 + 'px');

	b_s.position(width - 255 - 100, 150 + 25/2);
  	b_s.style('width', 255 + 'px');
}

function legend(){
	fill(r_s.value(), 0, 0, 150)
	square(width - 70, 50, 50);
	fill(0, g_s.value(), 0, 150)
	square(width - 70, 100, 50);
	fill(0, 0, b_s.value(), 150)
	square(width - 70, 150, 50);
	
	var a = r_s.value() + g_s.value() + b_s.value()
	fill(r_s.value(), g_s.value(), b_s.value(), map(a, 0, 255 * 3, 0, 255))
	square(width - 70, 200, 50);

	var o3 = map(r_s.value(), 0, 255, 0, 30)
	var pm10 = map(g_s.value(), 0, 255, 0, 50)
	var pm25 = map(b_s.value(), 0, 255, 0, 80)

	textAlign(RIGHT, CENTER);
	fill(250)
	text(o3.toPrecision(3), width - 80, 75);
	text(pm10.toPrecision(3), width - 80, 125);
	text(pm25.toPrecision(3), width - 80, 175);
	text("COLOR", width - 80, 225);

	textAlign(RIGHT, CENTER);
	text("O3", width - 50 - 355, 75);
	text("PM10", width - 50 - 355, 125);
	text("PM2.5", width - 50 - 355, 175);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	if(myMap.map != undefined){
		myMap.map.transform.width = windowWidth
		myMap.map.transform.height = windowHeight

		zoom = myMap.map.transform.zoom

		cx = mercX(myMap.map.transform.center.lng)
		cy = mercY(myMap.map.transform.center.lat)
	}
}


function mercX(lng){
	lng = radians(lng)
	var a = (256 / PI) * pow(2, zoom);
	var b = lng + PI;
	return a * b;
}

function mercY(lat){
	lat = radians(lat)
	var a = (256 / PI) * pow(2, zoom);
	var b = tan(PI / 4 + lat / 2);
	var c = PI - log(b);
	return a * c;
}

