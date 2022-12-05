import { moveObj } from './utils.js';
import * as THREE from '/build/three.module.js';

export class GoScreen {
    constructor(
        stackForStart,
        stackToGoFamousSongs,
        stackToGoFavoriteSongs,
        stackToGoAllSongs,
        stackToGoEditor,
        stackOptGap
    ) {
        this.stackForStart = stackForStart;
        this.stackToGoFamousSongs = stackToGoFamousSongs;
        this.stackToGoFavoriteSongs = stackToGoFavoriteSongs;
        this.stackToGoAllSongs = stackToGoAllSongs;
        this.stackToGoEditor = stackToGoEditor;
        this.stackOptGap = stackOptGap;
    }
    goMain() {
        moveObj(this.stackForStart, new THREE.Vector3(0, -10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, -14, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, -14, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, -14, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, -14, -this.stackOptGap), 0.1);
    }
    goOpts() {
        moveObj(this.stackForStart, new THREE.Vector3(0, -5, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, -this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, -this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, -this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, -this.stackOptGap, -this.stackOptGap), 0.1);
    }
    // to Go Song List
    goSongs() {
        moveObj(this.stackForStart, new THREE.Vector3(0, 10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, this.stackOptGap, -this.stackOptGap), 0.1);
    }
    goFamous() {
        moveObj(this.stackForStart, new THREE.Vector3(0, 10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, this.stackOptGap, -this.stackOptGap), 0.1);
    }
    goFavorite() {
        moveObj(this.stackForStart, new THREE.Vector3(0, 10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, this.stackOptGap, -this.stackOptGap), 0.1);
    }
    goAll() {
        moveObj(this.stackForStart, new THREE.Vector3(0, 10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, this.stackOptGap, -this.stackOptGap), 0.1);
    }
    goEdit() {
        moveObj(this.stackForStart, new THREE.Vector3(0, 10, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, this.stackOptGap, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, this.stackOptGap, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, this.stackOptGap, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, this.stackOptGap, -this.stackOptGap), 0.1);
    }
}