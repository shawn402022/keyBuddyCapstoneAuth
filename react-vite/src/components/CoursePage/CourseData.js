import {Key, Scale, ChordType} from 'tonal';
import { KeySignature } from 'vexflow';

export const chordTech = ChordType.all();
console.log('BUILT FINALLY', chordTech)

/*
export const keys = {
    CMajor: Key.majorKey('C'),
    CsMajor: Key.majorKey('C#'),
    DMajor: Key.majorKey('D'),
    DsMajor: Key.majorKey('D#'),
    EMajor: Key.majorKey('E'),
    FMajor: Key.majorKey('F'),
    FsMajor: Key.majorKey('F#'),
    GMajor: Key.majorKey('G'),
    GsMajor: Key.majorKey('G#'),
    AMajor: Key.majorKey('A'),
    AsMajor: Key.majorKey('A#'),
    BMajor: Key.majorKey('B'),
    CbMajor: Key.majorKey('Cb'),
    DbMajor: Key.majorKey('Db'),
    EbMajor: Key.majorKey('Eb'),
    FbMajor: Key.majorKey('Fb'),
    GbMajor: Key.majorKey('Gb'),
    AbMajor: Key.majorKey('Ab'),
    BbMajor: Key.majorKey('Bb'),
    CMinor: Key.minorKey('C'),
    CsMinor: Key.minorKey('C#'),
    DMinor: Key.minorKey('D'),
    DsMinor: Key.minorKey('D#'),
    EMinor: Key.minorKey('E'),
    FMinor: Key.minorKey('F'),
    FsMinor: Key.minorKey('F#'),
    GMinor: Key.minorKey('G'),
    GsMinor: Key.minorKey('G#'),
    AMinor: Key.minorKey('A'),
    AsMinor: Key.minorKey('A#'),
    BMinor: Key.minorKey('B'),
    CbMinor: Key.minorKey('Cb'),
    DbMinor: Key.minorKey('Db'),
    EbMinor: Key.minorKey('Eb'),
    FbMinor: Key.minorKey('Fb'),
    GbMinor: Key.minorKey('Gb'),
    AbMinor: Key.minorKey('Ab'),
    BbMinor: Key.minorKey('Bb'),
}
*/

export const keys = [
    { name: 'CMajor', key: Key.majorKey('C') },
    { name: 'CsMajor', key: Key.majorKey('C#') },
    { name: 'DMajor', key: Key.majorKey('D') },
    { name: 'DsMajor', key: Key.majorKey('D#') },
    { name: 'EMajor', key: Key.majorKey('E') },
    { name: 'FMajor', key: Key.majorKey('F') },
    { name: 'FsMajor', key: Key.majorKey('F#') },
    { name: 'GMajor', key: Key.majorKey('G') },
    { name: 'GsMajor', key: Key.majorKey('G#') },
    { name: 'AMajor', key: Key.majorKey('A') },
    { name: 'AsMajor', key: Key.majorKey('A#') },
    { name: 'BMajor', key: Key.majorKey('B') },
    { name: 'CbMajor', key: Key.majorKey('Cb') },
    { name: 'DbMajor', key: Key.majorKey('Db') },
    { name: 'EbMajor', key: Key.majorKey('Eb') },
    { name: 'FbMajor', key: Key.majorKey('Fb') },
    { name: 'GbMajor', key: Key.majorKey('Gb') },
    { name: 'AbMajor', key: Key.majorKey('Ab') },
    { name: 'BbMajor', key: Key.majorKey('Bb') },
    { name: 'CMinor', key: Key.minorKey('C') },
    { name: 'CsMinor', key: Key.minorKey('C#') },
    { name: 'DMinor', key: Key.minorKey('D') },
    { name: 'DsMinor', key: Key.minorKey('D#') },
    { name: 'EMinor', key: Key.minorKey('E') },
    { name: 'FMinor', key: Key.minorKey('F') },
    { name: 'FsMinor', key: Key.minorKey('F#') },
    { name: 'GMinor', key: Key.minorKey('G') },
    { name: 'GsMinor', key: Key.minorKey('G#') },
    { name: 'AMinor', key: Key.minorKey('A') },
    { name: 'AsMinor', key: Key.minorKey('A#') },
    { name: 'BMinor', key: Key.minorKey('B') },
    { name: 'CbMinor', key: Key.minorKey('Cb') },
    { name: 'DbMinor', key: Key.minorKey('Db') },
    { name: 'EbMinor', key: Key.minorKey('Eb') },
    { name: 'FbMinor', key: Key.minorKey('Fb') },
    { name: 'GbMinor', key: Key.minorKey('Gb') },
    { name: 'AbMinor', key: Key.minorKey('Ab') },
    { name: 'BbMinor', key: Key.minorKey('Bb') }
]


export default class ChordsInfo {

    static scale = keys.map((key) => {
        let scale = key.key.scale;
        return `STATIC ${scale}`
    })

    static checkSig = keys.map((key) => {
        let keySig = key.key.keySignature;
        return `KEYSIG ${keySig}`
    })


    static name = keys.map((key) => {
        let name = `${key.key.tonic} ${key.key.type}`; // ex C Major
        return name
    })

    //chord technicals

    static interval = chordTech.map((tech,  ) => {
        let numbers = tech.intervals;
        return numbers
    })

    static alias = chordTech.map((tech, ) => {
        let alias = tech.aliases;
        return alias
    })
    static advancedName = chordTech.map((tech, ) => {
        let advancedName = tech.name;
        return advancedName
    })
    static quality = chordTech.map((tech, ) => {
        let quality = tech.quality;
        return quality
    })

    static getAll = this.interval.map((item) => {
        this.newArr = []


        item.forEach((number) => {
            //console.log(number.slice(0,1))
            this.newArr.push(number.slice(0,1))
            this.newNum = number.slice(0,1)
        })
        //return this.newArr[0]
        return this.newArr



    })


}

console.log('FINAL BOSS', ChordsInfo.getAll[0].map(Scale.degrees(ChordsInfo.name[0]))); // => ["C", "E", "G", "B"]
console.log(ChordsInfo.getAll[0], ChordsInfo.name)

console.log('SUPERTEST',[1, 3, 5, 7].map(Scale.degrees("C major"))); // => ["C", "E", "G", "B"]
