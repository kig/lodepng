"use strict";

importScripts('lodepng.js');

var LodePNG = LodePNG();

onmessage = function(ev) {
	var requestId = ev.data.requestId;
	var pngData = ev.data.png;

	var imagePtr = LodePNG._malloc(12 + pngData.byteLength); // uint_8**
	var widthPtr = imagePtr + 4; // uint_32*
	var heightPtr = imagePtr + 8; // uint_32*
	var png = imagePtr + 12; // uint_8*
	new Uint8Array(LodePNG.buffer, png, pngData.byteLength).set(new Uint8Array(pngData));
	var pngsize = pngData.byteLength; // uint_32

	console.time('Decode PNG');
	LodePNG._lodepng_decode32(imagePtr, widthPtr, heightPtr, png, pngsize);
	console.timeEnd('Decode PNG');

	var width = LodePNG.HEAPU32[widthPtr/4]; // uint_32
	var height = LodePNG.HEAPU32[heightPtr/4]; // uint_32
	var image = LodePNG.HEAPU32[imagePtr/4]; // uint_8*

	var imageBuffer = LodePNG.buffer.slice(image, image + width * height * 4);

	LodePNG._free(image);
	LodePNG._free(imagePtr);

	postMessage({image: {width: width, height: height, data: new Uint8Array(imageBuffer)}, requestId: requestId, png: pngData}, [ imageBuffer, pngData ]);
};
