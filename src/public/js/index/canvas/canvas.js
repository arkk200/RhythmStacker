import * as THREE from '/build/three.module.js';

export function getTextTexture(word, font, width, height) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 100, 100);
    ctx.font = font;
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, width / 2, height / 2);
    return new THREE.CanvasTexture(ctx.canvas);
}