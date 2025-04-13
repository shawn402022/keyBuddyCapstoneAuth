import {  Chord } from "tonal"


class NoteUtil {

    // Method to get Every single possible chord combination
    getEveryChord = () => {

        //let chordTypes = ChordType.symbols();   used to get the information in diffChords array  ( IF U WANT TO SEE THE DATA  import {ChordTypes} from 'Tonal')

        let everyChordObj = {}

        console.log('BEFORE', everyChordObj)
        let diffNotes = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G',
            'A#', 'C#', 'D#', 'F#', 'G#',
            'Ab', 'Bb', 'Db', 'Eb', 'Gb',
        ]

        // the information in the diffChords array is from tonal.js (ChordType.symbols()).  I just hard coded the console log in case the api every goes down
        let diffChords = [
            '5', 'M7#5sus4', '7#5sus4', 'sus4', 'M7sus4', '7sus4', '7no5', 'aug', 'M7b6', 'maj7#5', '7#5', '7b13', 'M', 'maj7', '7', '6', '7add6', '7b6', 'Mb5', 'M7b5', '7b5', 'maj#4', '7#11', 'M6#11', '7#11b13', 'm#5', 'mb6M7', 'm7#5', 'm', 'm/ma7', 'm7', 'm6', 'mMaj7b6', 'dim', 'oM7', 'm7b5', 'dim7', 'o7M7', '4', 'madd4', 'm7add11', '+add#9', '7#5#9', '7#9', '13#9', '7#9b13', 'maj7#9#11', '7#9#11', '13#9#11', '7#9#11b13', 'sus2', 'M9#5sus4', 'sus24', 'M9sus4', '11', '9sus4', '13sus4', '9no5', '13no5', 'M#5add9', 'maj9#5', '9#5', '9b13', 'Madd9', 'maj9', '9', '6add9', 'maj13', 'M7add13', '13', 'M9b5', '9b5', '13b5', '9#5#11', 'maj9#11', '9#11', '69#11', 'M13#11', '13#11', '9#11b13', 'm9#5', 'madd9', 'mM9', 'm9', 'm69', 'm13', 'mMaj9b6', 'm9b5', 'm11A', 'm11', 'b9sus', '11b9', '7sus4b9b13', 'alt7', '7#5b9', 'Maddb9', 'M7b9', '7b9', '13b9', '7b9b13',
        ]

        //Iterate through all combinations of root and chord types
        diffNotes.forEach(diffNote => {
            diffChords.forEach(diffChord => {
                try{
                    // create the Full Chord Name
                    let chordName = `${diffNote}${diffChord}`

                    //Get the notes that make up this chord using Tonal.js
                    let chordNotes = Chord.notes(diffChord, diffNote);

                    //Skip if we couldnt get notes for this chord
                    if(!chordNotes|| chordNotes.length === 0) {
                        console.log(`Skipping ${chordName} - no notes returned`);
                        return; //Skip to next iteration
                    }

                    //Create key by joining the notes with commas( just in case);
                    let notesKey = chordNotes.join(',');

                    //Store in our object with notes as key and chord name as value
                    everyChordObj[notesKey] = chordName;

                    //Log for debugging
                    //console.log(`Added: ${notesKey} => ${chordName}`);


                } catch(error) {
                    console.log(`Error processing ${diffNote}${diffChord}: ${error.message}`)
                }
            });
        });
        console.log(`Chord definitions object created with`, Object.keys(everyChordObj).length, 'entries');
        //console.log(everyChordObj)
        return everyChordObj;
    }

    //Method to identify a chord from a set of notes
    identifyChord = (notes) => {
        //Get the chord definitions we just made
        const chordDefinitions = this.getEveryChord();

        //sort and join the input notes to create a key
        const notesKey = [...notes].sort().join(',');

        //Look up the chord name
        return chordDefinitions[notesKey] || null;
    }

    //Method to create a visual representation fo the chords
    rasterizeChord = (notes) =>{

    }

}

export default new NoteUtil()
