import { moveObj } from './utils.js';
import * as THREE from '/build/three.module.js';

export class GoScreen {
    constructor(
        stackForStart,
        stackToGoFamousSongs,
        stackToGoFavoriteSongs,
        stackToGoAllSongs,
        stackToGoEditor
    ) {
        this.stackForStart = stackForStart;
        this.stackToGoFamousSongs = stackToGoFamousSongs;
        this.stackToGoFavoriteSongs = stackToGoFavoriteSongs;
        this.stackToGoAllSongs = stackToGoAllSongs;
        this.stackToGoEditor = stackToGoEditor;
    }
    goMain() {
        moveObj(this.stackForStart, [0, -7, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -12, 3], 0.1);
    }
    goOpts() {
        moveObj(this.stackForStart, [0, -3, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -7, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -7, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -7, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -7, 3], 0.1);
    }
    // to Go Song List
    goFamous() {
        moveObj(this.stackForStart, [0, -3, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -12, 3], 0.1);
    }
    goFavorite() {
        moveObj(this.stackForStart, [0, -3, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -12, 3], 0.1);
    }
    goAll() {
        moveObj(this.stackForStart, [0, -3, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -12, 3], 0.1);
    }
    goEdit() {
        moveObj(this.stackForStart, [0, -3, 0], 0.1);
        moveObj(this.stackToGoFamousSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoFavoriteSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoAllSongs, [-3, -12, 3], 0.1);
        moveObj(this.stackToGoEditor, [-3, -12, 3], 0.1);
    }
}