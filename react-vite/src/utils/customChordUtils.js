import {Key, Scale, ChordType, Chord, Voicing} from 'tonal';

//##EXPORTS
export const chordTech = ChordType.symbols();
export const soloKey = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'
]
export const soloKeyDetails = [
    '5', 'M7#5sus4', '7#5sus4', 'sus4', 'M7sus4', '7sus4', '7no5', 'aug', 'M7b6', 'maj7#5', '7#5', '7b13', 'M', 'maj7', '7', '6', '7add6', '7b6', 'Mb5', 'M7b5', '7b5', 'maj#4', '7#11', 'M6#11', '7#11b13', 'm#5', 'mb6M7', 'm7#5', 'm', 'm/ma7', 'm7', 'm6', 'mMaj7b6', 'dim', 'oM7', 'm7b5', 'dim7', 'o7M7', '4', 'madd4', 'm7add11', '+add#9', '7#5#9', '7#9', '13#9', '7#9b13', 'maj7#9#11', '7#9#11', '13#9#11', '7#9#11b13', 'sus2', 'M9#5sus4', 'sus24', 'M9sus4', '11', '9sus4', '13sus4', '9no5', '13no5', 'M#5add9', 'maj9#5', '9#5', '9b13', 'Madd9', 'maj9', '9', '6add9', 'maj13', 'M7add13', '13', 'M9b5', '9b5', '13b5', '9#5#11', 'maj9#11', '9#11', '69#11', 'M13#11', '13#11', '9#11b13', 'm9#5', 'madd9', 'mM9', 'm9', 'm69', 'm13', 'mMaj9b6', 'm9b5', 'm11A', 'm11', 'b9sus', '11b9', '7sus4b9b13', 'alt7', '7#5b9', 'Maddb9', 'M7b9', '7b9', '13b9', '7b9b13', "7#5b9#11", "7b9#11", "13b9#11", "7b9b13#11", "mb6b9", "7b9#9"
]
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

    static tonic = keys.map((key) => {
        let tonic = key.key.tonic;
        return tonic
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
        try{
            item.forEach((number) => {
                //console.log(number.slice(0,1))
                this.newArr.push(number.slice(0,1))
                this.newNum = number.slice(0,1)
            })
            //return this.newArr[0]
            return this.newArr

        } catch(e) {
            console.log(e)
            return 'Error'
        }
    })

    static voiceSearch = () => {
        let allChordData
        for (let i = 0; i < soloKey.length; i++) {
            let chordData = []
            for(let j = 0; j < soloKeyDetails.length; j++) {
                let keyInfo = `${soloKey[i]}${soloKeyDetails[j]}`

                let myChord = Chord.get(keyInfo)
                let {name, quality, aliases, symbol, tonic, type, root, bass, notes} = myChord
                myChord = {tonic, quality, symbol, name, aliases, type, root, bass, notes}
                chordData.push(myChord)
            }
            allChordData = chordData
        }
        return allChordData // RETURNS AN ARRAY OF OBJECTS WITH  - name,quality,aliases, symbol, tonic, type, root, bass, notes for all chords
    }
}

console.log(ChordsInfo.voiceSearch())
