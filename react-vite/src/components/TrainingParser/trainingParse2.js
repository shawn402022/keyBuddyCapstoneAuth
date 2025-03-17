import {Scale } from 'tonal';
import ChordsInfo from "../CoursePage/CourseData";



export default class ChordSearch {

    static showIntervals() {
        console.log('FINAL BOSS', ChordsInfo.getAll[0].map(Scale.degrees(ChordsInfo.name[0]))); // => ["C", "E", "G", "B"]
    }

}

console.log(ChordSearch.showIntervals());
