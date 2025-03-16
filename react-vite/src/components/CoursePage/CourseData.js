import {Key, Scale, ChordType} from 'tonal';
import { KeySignature } from 'vexflow';

export const builtInTypes = ChordType.all();
console.log('BUILT FINALLY', builtInTypes)

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
        return `NAME ${name}`
    })



}

console.log(ChordsInfo.name)

export default class ChordTechnicals {
    stat
}


export const keys1 = [
    { name: 'C Major', scale: Scale.get('C Major').notes  },
    { name: 'C# Major', scale: Scale.get('C# Major').notes },
    { name: 'D Major', scale: Scale.get('D Major').notes },
    { name: 'D# Major', scale: Scale.get('D# Major').notes },
    { name: 'E Major', scale: Scale.get('E Major').notes },
    { name: 'F Major', scale: Scale.get('F Major').notes },
    { name: 'F# Major', scale: Scale.get('F# Major').notes },
    { name: 'G Major', scale: Scale.get('G Major').notes },
    { name: 'G# Major', scale: Scale.get('G# Major').notes },
    { name: 'A Major', scale: Scale.get('A Major').notes },
    { name: 'A# Major', scale: Scale.get('A# Major').notes },
    { name: 'B Major', scale: Scale.get('B Major').notes },
    { name: 'Cb Major', scale: Scale.get('Cb Major').notes },
    { name: 'Db Major', scale: Scale.get('Db Major').notes },
    { name: 'Eb Major', scale: Scale.get('Eb Major').notes },
    { name: 'Fb Major', scale: Scale.get('Fb Major').notes },
    { name: 'Gb Major', scale: Scale.get('Gb Major').notes },
    { name: 'Ab Major', scale: Scale.get('Ab Major').notes },
    { name: 'Bb Major', scale: Scale.get('Bb Major').notes },
    { name: 'C Minor', scale: Scale.get('C Minor').notes },
    { name: 'C# Minor', scale: Scale.get('C# Minor').notes },
    { name: 'D Minor', scale: Scale.get('D Minor').notes },
    { name: 'D# Minor', scale: Scale.get('D# Minor').notes },
    { name: 'E Minor', scale: Scale.get('E Minor').notes },
    { name: 'F Minor', scale: Scale.get('F Minor').notes },
    { name: 'F# Minor', scale: Scale.get('F# Minor').notes },
    { name: 'G Minor', scale: Scale.get('G Minor').notes },
    { name: 'G# Minor', scale: Scale.get('G# Minor').notes },
    { name: 'A Minor', scale: Scale.get('A Minor').notes },
    { name: 'A# Minor', scale: Scale.get('A# Minor').notes },
    { name: 'B Minor', scale: Scale.get('B Minor').notes },
    { name: 'C# Minor', scale: Scale.get('Cb Minor').notes },
    { name: 'Db Minor', scale: Scale.get('Db Minor').notes },
    { name: 'Eb Minor', scale: Scale.get('Eb Minor').notes },
    { name: 'Fb Minor', scale: Scale.get('Fb Minor').notes },
    { name: 'Gb Minor', scale: Scale.get('Gb Minor').notes },
    { name: 'Ab Minor', scale: Scale.get('Ab Minor').notes },
    { name: 'Bb Minor', scale: Scale.get('Bb Minor').notes },
]




//console.log('KEYS2',keys2);







export const  chordMap = [



    // Triads
    {type:'triad',detail:'Major', abbreviation:'maj', numbers: [0, 4, 7], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Minor', abbreviation:'min', numbers: [0, 3, 7], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Diminished', abbreviation:'dim', numbers: [0, 3, 6], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Augmented', abbreviation:'aug', numbers: [0, 4, 8], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 2nd', abbreviation:'sus2', numbers: [0, 2, 7], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 4th', abbreviation:'sus4', numbers: [0, 5, 7], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 2nd Flat 5th', abbreviation:'sus2b5', numbers: [0, 2, 6], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 2nd Sharp 5th', abbreviation:'sus2#5', numbers: [0, 2, 8], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 4th Flat 5th', abbreviation:'sus4b5', numbers: [0, 5, 6], intervalType:'primary', equivalentScale:'third'},
    {type:'triad',detail:'Suspended 4th Sharp 5th', abbreviation:'sus4#5', numbers: [0, 5, 8], intervalType:'primary', equivalentScale:'third'},

    // fourth Chords
    {type:'4th', detail:'Major 4th', abbreviation:'maj4', numbers: [0, 3, 7, 11], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Minor 4th', abbreviation:'min4', numbers: [0, 3, 6, 11], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Augmented 4th', abbreviation:'aug4', numbers: [0, 3, 8, 11], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Diminished 4th', abbreviation:'dim4', numbers: [0, 3, 6, 9], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Minor 9th', abbreviation:'min9', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Minor 11th', abbreviation:'min11', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Augmented 11th', abbreviation:'aug11', numbers: [0, 4, 8, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Diminished 11th', abbreviation:'dim11', numbers: [0, 3, 6, 9], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Minor 13th', abbreviation:'min13', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'4th', detail:'Diminished 13th', abbreviation:'dim13', numbers: [0, 3, 6, 9], intervalType:'substitution', equivalentScale:'root'},


    // add 4
    {type:'add4', detail:'Major Add 4', abbreviation:'majadd4', numbers: [0, 4, 7, 10], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Minor Add 4', abbreviation:'minadd4', numbers: [0, 3, 7, 10], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Augmented Add 4', abbreviation:'augadd4', numbers: [0, 4, 8, 10], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Diminished Add 4', abbreviation:'dimadd4', numbers: [0, 3, 6, 9], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Augmented Add 4', abbreviation:'augadd4', numbers: [0, 4, 8, 10], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Diminished 9th Add 4', abbreviation:'dim9add4', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Minor 9th Add 4', abbreviation:'min9add4', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Minor 11th Add 4', abbreviation:'min11add4', numbers: [0, 3, 6, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Augmented 11th Add 4', abbreviation:'aug11add4', numbers: [0, 4, 8, 12], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Augmented 13th Add 4', abbreviation:'aug13add4', numbers: [0, 4, 8, 13], intervalType:'substitution', equivalentScale:'root'},
    {type:'add4', detail:'Minor 13th Add 4', abbreviation:'min13add4', numbers: [0, 3, 6, 13], intervalType:'substitution', equivalentScale:'root'},

    // fifth chords
    {type:'5th', detail:'Major 5th', abbreviation:'maj5', numbers: [0, 4, 7, 11], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 5th', abbreviation:'min5', numbers: [0, 3, 7, 11], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Augmented 5th', abbreviation:'aug5', numbers: [0, 4, 8, 11], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Diminished 5th', abbreviation:'dim5', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 9th', abbreviation:'min9', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 11th', abbreviation:'min11', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Augmented 11th', abbreviation:'aug11', numbers: [0, 4, 8, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Diminished 11th', abbreviation:'dim11', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th', abbreviation:'min13', numbers: [0, 3, 6, 13], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Diminished 13th', abbreviation:'dim13', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th Add 4', abbreviation:'min13add4', numbers: [0, 3, 6, 13], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th Diminished 5th', abbreviation:'min13dim5', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th Diminished 9th', abbreviation:'min13dim9', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th Diminished 11th', abbreviation:'min13dim11', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'5th', detail:'Minor 13th Diminished 13th', abbreviation:'min13dim13', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},

    //add5
    {type:'add5', detail:'Major Add 5', abbreviation:'majadd5', numbers: [0, 4, 7, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Minor Add 5', abbreviation:'minadd5', numbers: [0, 3, 7, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Augmented Add 5', abbreviation:'augadd5', numbers: [0, 4, 8, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Diminished Add 5', abbreviation:'dimadd5', numbers: [0, 3, 6, 9], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Augmented Add 5', abbreviation:'augadd5', numbers: [0, 4, 8, 10], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Minor 9th Add 5', abbreviation:'min9add5', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Minor 11th Add 5', abbreviation:'min11add5', numbers: [0, 3, 6, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Augmented 11th Add 5', abbreviation:'aug11add5', numbers: [0, 4, 8, 12], intervalType:'primary', equivalentScale:'fifth'},
    {type:'add5', detail:'Diminished 11th Add 5', abbreviation:'dim11add5', numbers: [0, 3, 6, 10], intervalType:'primary', equivalentScale:'fifth'},


    // sixth Chords
    {type:'6th', detail:'Major 6th', Abbreviation:'maj6', numbers: [0, 4, 7, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Minor 6th', Abbreviation:'min6', numbers: [0, 3, 7, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Dominant 6th', Abbreviation:'6', numbers: [0, 4, 7, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Diminished 6th', Abbreviation:'dim6', numbers: [0, 3, 6, 8], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Minor 6th add 9th', Abbreviation:'m6', numbers: [0, 3, 7, 8], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Half Diminished 6th', Abbreviation:'m6b5', numbers: [0, 3, 6, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 2nd', Abbreviation:'6sus2', numbers: [0, 2, 7, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 4th', Abbreviation:'6sus4', numbers: [0, 5, 7, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 2nd Flat 5th',  Abbreviation:'6sus2b5', numbers: [0, 2, 6, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 2nd Sharp 5th', Abbreviation:'6sus2#5', numbers: [0, 2, 8, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 4th Flat 5th', chordAbbreviation:'6sus4b5', numbers: [0, 5, 6, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 4th Sharp 5th',chordAbbreviation:'6sus4#5', numbers: [0, 5, 8, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 4th Double Flat 5th', chordAbbreviation:'6sus4bb5', numbers: [0, 5, 6, 8, 9], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'6th Suspended 4th Double Sharp 5th', chordAbbreviation:'6sus4#5', numbers: [0, 5, 8, 9, 10], intervalType:'extension', equivalentScale:'sixth'},
    {type:'6th', detail:'Minor 7th add 11th', chordAbbreviation:'6m7', numbers: [0, 3, 7, 9, 10], intervalType:'extension', equivalentScale:'sixth'},

    //add6
    {type:'add6', detail:'Add 6th',abbreviation:'add6', numbers: [0, 4, 7, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Flat 5th',abbreviation:'add6b5', numbers: [0, 3, 6, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Sharp 5th',abbreviation:'add6#5', numbers: [0, 3, 8, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 2nd',abbreviation:'add6sus2', numbers: [0, 2, 7, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 4th',abbreviation:'add6sus4', numbers: [0, 5, 7, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 2nd Flat 5th',abbreviation:'add6sus2b5', numbers: [0, 2, 6, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 2nd Sharp 5th',abbreviation:'add6sus2#5', numbers: [0, 2, 8, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 4th Sharp 5th',abbreviation:'add6sus4#5', numbers: [0, 5, 8, 9, 11], intervalType:'extension', equivalentScale:'sixth'},
    {type:'add6', detail:'Add 6th Suspended 4th Flat 5th',abbreviation:'add6sus4b5', numbers: [0, 5, 6, 9, 11], intervalType:'extension', equivalentScale:'sixth'},

    // Seventh Chords
    {type:'7th',detail:'Major 7th' , abbreviation:'maj7', numbers: [0, 4, 7, 11], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Minor 7th' , abbreviation:'m7', numbers: [0, 3, 7, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Dominant 7th' , abbreviation:'7', numbers: [0, 4, 7, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Diminished 7th' , abbreviation:'dim7', numbers: [0, 3, 6, 9], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Half Diminished 7th' , abbreviation:'m7b5', numbers: [0, 3, 6, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Minor Major 7th' , abbreviation:'mM7', numbers: [0, 3, 7, 11], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Augmented 7th' , abbreviation:'aug7', numbers: [0, 4, 8, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 4th' , abbreviation:'7sus4', numbers: [0, 5, 7, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 2nd' , abbreviation:'7sus2', numbers: [0, 2, 7, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 2nd Flat 5th' , abbreviation:'7sus2b5', numbers: [0, 2, 6, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 2nd Sharp 5th' , abbreviation:'7sus2#5', numbers: [0, 2, 8, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 4th Flat 5th' , abbreviation:'7sus4b5', numbers: [0, 5, 6, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'7th Suspended 4th Sharp 5th' , abbreviation:'7sus4#5', numbers: [0, 5, 8, 10], intervalType:'extension', equivalentScale:'seventh'},
    {type:'7th',detail:'Minor 9th add 13th' , abbreviation:'7m9', numbers: [0, 3, 7, 10, 12], intervalType:'extension', equivalentScale:'seventh'},

    // add seventh
    {type:'add7', detail: 'Add 7th', abbreviation:'add7', numbers: [0, 4, 7, 11, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Flat 5th', abbreviation:'add7b5', numbers: [0, 3, 6, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Sharp 5th', abbreviation:'add7#5', numbers: [0, 3, 8, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 4th', abbreviation:'add7sus4', numbers: [0, 5, 7, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 2nd', abbreviation:'add7sus2', numbers: [0, 2, 7, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 2nd Flat 5th', abbreviation:'add7sus2b5', numbers: [0, 2, 6, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 2nd Sharp 5th', abbreviation:'add7sus2#5', numbers: [0, 2, 8, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 4th Flat 5th', abbreviation:'add7sus4b5', numbers: [0, 5, 6, 10, 13], intervalType:'extension', equivalentScale:'seventh'},
    {type:'add7', detail: 'Add 7th Suspended 4th Sharp 5th', abbreviation:'add7sus4#5', numbers: [0, 5, 8, 10, 13], intervalType:'extension', equivalentScale:'seventh'},

    // Eighth Chords
    {type:'8th', detail: 'Major 8th', abbreviation:'maj8', numbers:[0, 4, 7, 11, 13], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Dominant 8th', abbreviation:'8', numbers:[0, 4, 7, 10, 13], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Minor 8th', abbreviation:'m8', numbers:[0, 3, 7, 10, 13], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Diminished 8th', abbreviation:'dim8', numbers:[0, 3, 6, 9, 12], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Half Diminished 8th', abbreviation:'m8b5', numbers:[0, 3, 6, 9, 11], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Minor Major 8th', abbreviation:'mM8', numbers:[0, 3, 7, 11, 13], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'8th', detail: 'Augmented 8th', abbreviation:'aug8', numbers:[0, 4, 8, 10, 13], intervalType:'compound-1st', equivalentScale:'octave'},

    // add eighth
    {type:'add8', detail: 'Add 8th', abbreviation: 'add8',numbers: [0, 4, 7, 11, 15], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Flat 5th', abbreviation: 'aadd8b5',numbers: [0, 3, 6, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Sharp 5th', abbreviation: 'add8#5',numbers:  [0, 3, 8, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 4th', abbreviation: 'add8sus4',numbers: [0, 5, 7, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 2nd', abbreviation: 'add8sus2',numbers: [0, 2, 7, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 2nd Flat 5th', abbreviation: 'add8sus2b5',numbers: [0, 2, 6, 10, 15], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 2nd Sharp 5th', abbreviation: 'add8sus2#5',numbers: [0, 2, 8, 10, 15], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 4th Flat 5th', abbreviation: 'add8sus4b5',numbers: [0, 5, 6, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},
    {type:'add8', detail: 'Add 8th Suspended 4th Sharp 5th', abbreviation: 'add8sus4#5',numbers: [0, 5, 8, 10, 14], intervalType:'compound-1st', equivalentScale:'octave'},

    // Ninth Chords
    {type:'9th',detail: 'Major 9th', abbreviation:'maj9',numbers: [0, 4, 7, 11, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Dominant 9th', abbreviation:'9',numbers: [0, 4, 7, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Minor 9th', abbreviation:'m9',numbers: [0, 3, 7, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Diminished 9th', abbreviation:'dim9',numbers: [0, 3, 6, 9, 13], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Half Diminished 9th', abbreviation:'m9b5',numbers: [0, 3, 6, 9, 12], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Minor Major 9th', abbreviation:'mM9',numbers: [0, 3, 7, 11, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: 'Augmented 9th', abbreviation:'aug9',numbers: [0, 4, 8, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 4th', abbreviation:'9sus4',numbers: [0, 5, 7, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 2nd', abbreviation:'9sus2',numbers: [0, 2, 7, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 2nd Flat 5th', abbreviation:'9sus2b5',numbers: [0, 2, 6, 10, 13], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 2nd Sharp 5th', abbreviation:'9sus2#5',numbers: [0, 2, 8, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 4th Flat 5th', abbreviation:'9sus4b5',numbers: [0, 5, 6, 10, 13], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 4th Sharp 5th', abbreviation:'9sus4#5',numbers: [0, 5, 8, 10, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 11', abbreviation:'9sus11',numbers: [0, 4, 7, 10, 14, 17], intervalType:'extension', equivalentScale:'second'},
    {type:'9th',detail: '9th Suspended 13', abbreviation:'9sus13',numbers: [0, 4, 7, 10, 14, 18], intervalType:'extension', equivalentScale:'second'},

    // Add9 Chords
    {type:'add9', detail:'Add 9' ,abbreviation:'add9', numbers: [0, 4, 7, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Minor Add 9' ,abbreviation:'madd9', numbers: [0, 3, 7, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Flat 5' ,abbreviation:'add9b5', numbers: [0, 3, 6, 13], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Sharp 5' ,abbreviation:'add9#5', numbers: [0, 3, 8, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 4th' ,abbreviation:'add9sus4', numbers: [0, 5, 7, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 2nd' ,abbreviation:'add9sus2', numbers: [0, 2, 7, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 2nd Flat 5' ,abbreviation:'add9sus2b5', numbers: [0, 2, 6, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 2nd Sharp 5' ,abbreviation:'add9sus2#5', numbers: [0, 2, 8, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 4th Flat 5' ,abbreviation:'add9sus4b5', numbers: [0, 5, 6, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 4th Sharp 5' ,abbreviation:'add9sus4#5', numbers: [0, 5, 8, 14], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 11' ,abbreviation:'add9sus11', numbers: [0, 4, 7, 14, 17], intervalType:'extension', equivalentScale:'second'},
    {type:'add9', detail:'Add 9 Suspended 13' ,abbreviation:'add9sus13', numbers: [0, 4, 7, 14, 18], intervalType:'extension', equivalentScale:'second'},

    // 10th Chords
    {type:'10th', detail:'10th',  abbreviation:'10',  numbers: [0, 4, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Flat 5',  abbreviation:'10b5',  numbers: [0, 3, 6, 10, 14], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Sharp 5',  abbreviation:'10#5',  numbers: [0, 3, 8, 10, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 4th',  abbreviation:'10sus4',  numbers: [0, 5, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 2nd',  abbreviation:'10sus2',  numbers: [0, 2, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 2nd Flat 5',  abbreviation:'10sus2b5',  numbers: [0, 2, 6, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 2nd Sharp 5',  abbreviation:'10sus2#5',  numbers: [0, 2, 8, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 4th Flat 5',  abbreviation:'10sus4b5',  numbers: [0, 5, 6, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 4th Sharp 5',  abbreviation:'10sus4#5',  numbers: [0, 5, 8, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 11',  abbreviation:'10sus11',  numbers: [0, 4, 7, 11, 15, 18], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'10th', detail:'10th Suspended 13',  abbreviation:'10sus13',  numbers: [0, 4, 7, 11, 15, 19], intervalType:'compound-3rd', equivalentScale:'third'},

    // add 10th
    {type:'add10', detail:' Add 10',  abbreviation:'add10',  numbers: [0, 4, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'add10', detail:' Add 10 Flat 5',  abbreviation:'add10b5',  numbers: [0, 3, 6, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'add10', detail:' Add 10 Sharp 5',  abbreviation:'add10#5',  numbers: [0, 3, 8, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'add10', detail:' Add 10 Suspended 4th',  abbreviation:'add10sus4',  numbers: [0, 5, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},
    {type:'add10', detail:' Add 10 Suspended 2nd',  abbreviation:'add10sus2',  numbers: [0, 2, 7, 11, 15], intervalType:'compound-3rd', equivalentScale:'third'},

    // 11TH Chords
    {type:'11th', detail:'11th',  abbreviation:'11',  numbers: [0, 4, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Flat 5',  abbreviation:'11b5',  numbers: [0, 3, 6, 11, 15], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Sharp 5',  abbreviation:'11#5',  numbers: [0, 3, 8, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 4th',  abbreviation:'11sus4',  numbers: [0, 5, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 2nd',  abbreviation:'11sus2',  numbers: [0, 2, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 2nd Flat 5',  abbreviation:'11sus2b5',  numbers: [0, 2, 6, 11, 15], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 2nd Sharp 5',  abbreviation:'11sus2#5',  numbers: [0, 2, 8, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 4th Flat 5',  abbreviation:'11sus4b5',  numbers: [0, 5, 6, 11, 15], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 4th Sharp 5',  abbreviation:'11sus4#5',  numbers: [0, 5, 8, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 11',  abbreviation:'11sus11',  numbers: [0, 4, 7, 11, 16, 19], intervalType:'extension', equivalentScale:'fourth'},
    {type:'11th', detail:'11th Suspended 13',  abbreviation:'11sus13',  numbers: [0, 4, 7, 11, 16, 20], intervalType:'extension', equivalentScale:'fourth'},

    // add 11th
    {type:'add11', detail:' Add 11',  abbreviation:'add11',  numbers: [0, 4, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'add11', detail:' Add 11 Flat 5',  abbreviation:'add11b5',  numbers: [0, 3, 6, 11, 15], intervalType:'extension', equivalentScale:'fourth'},
    {type:'add11', detail:' Add 11 Sharp 5',  abbreviation:'add11#5',  numbers: [0, 3, 8, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'add11', detail:' Add 11 Suspended 4th',  abbreviation:'add11sus4',  numbers: [0, 5, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},
    {type:'add11', detail:' Add 11 Suspended 2nd',  abbreviation:'add11sus2',  numbers: [0, 2, 7, 11, 16], intervalType:'extension', equivalentScale:'fourth'},

    //12th Chords
    {type:'12th', detail:'12th',  abbreviation:'12',  numbers: [0, 4, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Flat 5',  abbreviation:'12b5',  numbers: [0, 3, 6, 11, 15], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Sharp 5',  abbreviation:'12#5',  numbers: [0, 3, 8, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 4th',  abbreviation:'12sus4',  numbers: [0, 5, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 2nd',  abbreviation:'12sus2',  numbers: [0, 2, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 2nd Flat 5',  abbreviation:'12sus2b5',  numbers: [0, 2, 6, 11, 15], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 2nd Sharp 5',  abbreviation:'12sus2#5',  numbers: [0, 2, 8, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 4th Flat 5',  abbreviation:'12sus4b5',  numbers: [0, 5, 6, 11, 15], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 4th Sharp 5',  abbreviation:'12sus4#5',  numbers: [0, 5, 8, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 11',  abbreviation:'12sus11',  numbers: [0, 4, 7, 11, 17, 19], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'12th Suspended 13',  abbreviation:'12sus13',  numbers: [0, 4, 7, 11, 17, 20], intervalType:'compound-5th', equivalentScale:'fifth'},
    //add 12th
    {type:'12th', detail:'Add 12',  abbreviation:'add12',  numbers: [0, 4, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'Add 12 Flat 5',  abbreviation:'add12b5',  numbers: [0, 3, 6, 11, 15], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'Add 12 Sharp 5',  abbreviation:'add12#5',  numbers: [0, 3, 8, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'Add 12 Suspended 4th',  abbreviation:'add12sus4',  numbers: [0, 5, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},
    {type:'12th', detail:'Add 12 Suspended 2nd',  abbreviation:'add12sus2',  numbers: [0, 2, 7, 11, 17], intervalType:'compound-5th', equivalentScale:'fifth'},

    // 13TH Chords
    {type:'13th', detail:'13th', abbreviation:'13',  numbers: [0, 4, 7, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 5', abbreviation:'13b5',  numbers: [0, 3, 6, 11, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 5', abbreviation:'13#5',  numbers: [0, 3, 8, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 4th', abbreviation:'13sus4',  numbers: [0, 5, 7, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 2nd', abbreviation:'13sus2',  numbers: [0, 2, 7, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 2nd Flat 5', abbreviation:'13sus2b5',  numbers: [0, 2, 6, 11, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 2nd Sharp 5', abbreviation:'13sus2#5',  numbers: [0, 2, 8, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 4th Flat 5', abbreviation:'13sus4b5',  numbers: [0, 5, 6, 11, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 4th Sharp 5', abbreviation:'13sus4#5',  numbers: [0, 5, 8, 11, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 11', abbreviation:'13sus11',  numbers: [0, 4, 7, 11, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Suspended 13', abbreviation:'13sus13',  numbers: [0, 4, 7, 11, 17, 20], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13', abbreviation:'13b13',  numbers: [0, 3, 6, 11, 15, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13', abbreviation:'13#13',  numbers: [0, 3, 8, 11, 15, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 11', abbreviation:'13b11',  numbers: [0, 3, 6, 11, 15, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 11', abbreviation:'13#11',  numbers: [0, 3, 8, 11, 15, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 11 Flat 5', abbreviation:'13b11b5',  numbers: [0, 3, 6, 10, 15, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 11 Sharp 5', abbreviation:'13#11#5',  numbers: [0, 3, 8, 10, 15, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Flat 5', abbreviation:'13b13b5',  numbers: [0, 3, 6, 10, 15, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 5', abbreviation:'13#13#5',  numbers: [0, 3, 8, 10, 15, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 11 Suspended 4th', abbreviation:'13b11sus4',  numbers: [0, 3, 6, 9, 15, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 11 Suspended 2nd', abbreviation:'13#11sus2',  numbers: [0, 3, 8, 9, 15, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 11 Suspended 2nd Flat 5', abbreviation:'13b11sus2b5',  numbers: [0, 3, 6, 9, 14, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 11 Suspended 2nd Sharp 5', abbreviation:'13#11sus2#5',  numbers: [0, 3, 8, 9, 14, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 4th', abbreviation:'13b13sus4',  numbers: [0, 3, 6, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 4th Flat 5', abbreviation:'13#13sus4b5',  numbers: [0, 3, 8, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 2nd', abbreviation:'13b13sus2',  numbers: [0, 3, 6, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd Flat 5', abbreviation:'13#13sus2b5',  numbers: [0, 3, 8, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 4th Sharp 5', abbreviation:'13b13sus4#5',  numbers: [0, 3, 8, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 2nd Sharp 5', abbreviation:'13b13sus2#5',  numbers: [0, 3, 8, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 4th Sharp 5', abbreviation:'13#13sus4#5',  numbers: [0, 3, 8, 9, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 11', abbreviation:'13b13sus11',  numbers: [0, 3, 7, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Suspended 13', abbreviation:'13b13sus13',  numbers: [0, 3, 7, 10, 14, 17, 20], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 5', abbreviation:'13#13b5',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11', abbreviation:'13#13b11',  numbers: [0, 3, 8, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11', abbreviation:'13#13#11',  numbers: [0, 3, 8, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Flat 5', abbreviation:'13#13b11b5',  numbers: [0, 3, 8, 10, 14, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11 Sharp 5', abbreviation:'13#13#11#5',  numbers: [0, 3, 8, 10, 14, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13', abbreviation:'13#13b13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 13', abbreviation:'13#13#13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Suspended 4th', abbreviation:'13#13b11sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd', abbreviation:'13#13sus2',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd Sharp 5', abbreviation:'13#13sus2#5',  numbers: [0, 3, 8, 10, 13, 13], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 4th', abbreviation:'13#13b13sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 11', abbreviation:'13#13b13sus11',  numbers: [0, 3, 8, 10, 13, 16, 18], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 13', abbreviation:'13#13b13sus13',  numbers: [0, 3, 8, 10, 13, 16, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Flat 5', abbreviation:'13#13b11sus4b5',  numbers: [0, 3, 8, 10, 12, 15], intervalType:'extension', equivalentScale:'sixth'},

    //add 13
    {type:'13th', detail:'13th Flat 13 Flat 11', abbreviation:'13b13b11',  numbers: [0, 3, 7, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11', abbreviation:'13#13#11',  numbers: [0, 3, 8, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Flat 5', abbreviation:'13#13b11sus4b5',  numbers: [0, 3, 8, 10, 12, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11 Sharp 5', abbreviation:'13#13#11#5',  numbers: [0, 3, 8, 10, 14, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13', abbreviation:'13#13b13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 13', abbreviation:'13#13#13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Suspended 4th', abbreviation:'13#13b11sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd', abbreviation:'13#13sus2',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd Sharp 5', abbreviation:'13#13sus2#5',  numbers: [0, 3, 8, 10, 13, 13], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 4th', abbreviation:'13#13b13sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 11', abbreviation:'13#13b13sus11',  numbers: [0, 3, 8, 10, 13, 16, 18], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 13', abbreviation:'13#13b13sus13',  numbers: [0, 3, 8, 10, 13, 16, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Flat 5', abbreviation:'13#13b11sus4b5',  numbers: [0, 3, 8, 10, 12, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Flat 13 Flat 11', abbreviation:'13b13b11',  numbers: [0, 3, 7, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11', abbreviation:'13#13#11',  numbers: [0, 3, 8, 10, 14, 17, 19], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Flat 5', abbreviation:'13#13b11sus4b5',  numbers: [0, 3, 8, 10, 12, 15], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 11 Sharp 5', abbreviation:'13#13#11#5',  numbers: [0, 3, 8, 10, 14, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13', abbreviation:'13#13b13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Sharp 13', abbreviation:'13#13#13',  numbers: [0, 3, 8, 10, 14, 17], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 11 Suspended 4th', abbreviation:'13#13b11sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd', abbreviation:'13#13sus2',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Suspended 2nd Sharp 5', abbreviation:'13#13sus2#5',  numbers: [0, 3, 8, 10, 13, 13], intervalType:'extension', equivalentScale:'sixth'},
    {type:'13th', detail:'13th Sharp 13 Flat 13 Suspended 4th', abbreviation:'13#13b13sus4',  numbers: [0, 3, 8, 10, 13, 16], intervalType:'extension', equivalentScale:'sixth'},



];
