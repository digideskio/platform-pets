/*
*	Value Noise
*
*	Author: Abdullah Yousufi
*
*	Major thanks to http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
*	Copyright (c) 2015
*/
var PerlinNoise = function(freq, amp, octaves, seed){
	this.freq = freq;
	this.amp = amp;
	this.octaves = octaves;
	this.seed = seed;
}

PerlinNoise.prototype.cosineInterpolate = function(a, b, x){
	var ft = x * Math.PI;
	var f = (1.0 - Math.cos(ft)) * 0.5;
	return a * (1.0 - f) + b * f;
}

PerlinNoise.prototype.noise2D = function(x, y){	
	var n = 113 * x + 29 * this.seed + y * 57;
	n = Math.sin(n) * 10000;
	n = n - Math.floor(n);
	return n * 2.0 - 1.0;
}

PerlinNoise.prototype.smoothNoise2D = function(x, y){
	var corners = (this.noise2D(x - 1.0, y - 1.0) + this.noise2D(x + 1.0, y - 1.0) + this.noise2D(x - 1.0, y + 1.0) + this.noise2D(x + 1.0, y + 1.0)) / 16.0;
    var sides = (this.noise2D(x - 1.0, y) + this.noise2D(x + 1.0, y) + this.noise2D(x, y - 1.0) + this.noise2D(x, y + 1.0)) / 8.0;
    var center = this.noise2D(x, y) / 4.0;
    return corners + sides + center;
}

PerlinNoise.prototype.interpolatedNoise2D = function(x, y){
	var intX = Math.floor(x);
	var fractionalX = x - intX;
	var intY = Math.floor(y);
	var fractionalY = y - intY;

	var v1 = this.smoothNoise2D(intX, intY);
	var v2 = this.smoothNoise2D(intX + 1, intY);
	var v3 = this.smoothNoise2D(intX, intY + 1);
	var v4 = this.smoothNoise2D(intX + 1, intY + 1);

	var i1 = this.cosineInterpolate(v1, v2, fractionalX);
	var i2 = this.cosineInterpolate(v3, v4, fractionalX);

	return this.cosineInterpolate(i1, i2, fractionalY);
}

PerlinNoise.prototype.perlinNoise2D = function(x, y){
	var total = 0;
	var freq_curr = this.freq;
	var amp_curr = this.amp;
	for(var i = 0; i < this.octaves; i++){
        total += this.interpolatedNoise2D((Math.abs(x)) * freq_curr, (Math.abs(y)) * freq_curr) * amp_curr;
        freq_curr = freq_curr * 2.0;
        amp_curr = amp_curr / 2.0;
	}
	return (total + this.amp) / (2.0 * this.amp);
	
}