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
    goMain({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    goOpts({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    // to Go Song List
    goSongs({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    goFamous({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    goFavorite({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    goAll({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
    goEdit({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(0, startStackY, 0), 0.1);
        moveObj(this.stackToGoFamousSongs, new THREE.Vector3(-this.stackOptGap, optionStackY, 2 * this.stackOptGap), 0.1);
        moveObj(this.stackToGoFavoriteSongs, new THREE.Vector3(0, optionStackY, this.stackOptGap), 0.1);
        moveObj(this.stackToGoAllSongs, new THREE.Vector3(this.stackOptGap, optionStackY, 0), 0.1);
        moveObj(this.stackToGoEditor, new THREE.Vector3(2 * this.stackOptGap, optionStackY, -this.stackOptGap), 0.1);
    }
}