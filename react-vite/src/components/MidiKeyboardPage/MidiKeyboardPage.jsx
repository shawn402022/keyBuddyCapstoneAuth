import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect } from 'react';
import * as Tonal from 'tonal'
import {WebMidi} from "webmidi";

const chromaticNotes = Tonal.Range.chromatic(['C2', 'B7'], {sharps: true}).filter((note)=> note.length === 2)
const sharpNotes = Tonal.Range.chromatic(['C2', 'B7'], {sharps: true}).filter((note)=> note.length > 2)

const MidiKeyboardPage = () => {
    useEffect(() => {
        const keyImages = new KeyImages();
        const utils = new Utilities();

        // Move the app object and setup logic here
    const app ={

        setUpPiano(){

            if (document.getElementById('piano')) return; // Prevent multiple pianos
            
            console.log('setup piano working')
            const whiteKeyWidth = 80;
            //const blackKeyWidth =  40
            //let whiteKeyPositionX = 0
            let blackKeyPositionX = 60;
            const pianoHeight = 400;
            const naturalNotes = utils.getNaturalNotes(chromaticNotes)
            const pianoWidth = naturalNotes.length *whiteKeyWidth
            const div = utils.createElement("div")
            const piano = utils.createMainSVG(pianoWidth, pianoHeight, "piano")

            //document.body.appendChild(div)
            document.getElementById('piano-container').appendChild(div)
            div.appendChild(piano)


            // set up white keys
            chromaticNotes.forEach((note, i) => {
                const whiteKeyGroup = utils.createSVGElement('g')
                const whiteKeyObject = utils.createSVGElement("foreignObject")
                const whiteKeyObjectPressed = utils.createSVGElement('foreignObject')
                const whiteKeyImage = utils.createKeyImage(keyImages.releasedNatural[i])
                const whiteKeyImagePressed = utils.createKeyImage(keyImages.pressedNatural[i])
                const imgNoteText = chromaticNotes[i]


                utils.setAttributes(whiteKeyObject, {
                    "class":"white-key",
                    "width":whiteKeyWidth,
                    "height":pianoHeight,
                    "x": whiteKeyWidth * i
                })
                utils.setAttributes(whiteKeyObjectPressed, {
                    "class":"white-key-pressed",
                    "width":whiteKeyWidth,
                    "height":pianoHeight,
                    "x": whiteKeyWidth * i,
                    "data-id":imgNoteText,
                    "id":`${imgNoteText}-pressed-white`
                })
                utils.setAttributes(whiteKeyImage, {
                    "data-id":imgNoteText,
                    "id":`${imgNoteText}-released`
                })
                utils.setAttributes(whiteKeyImagePressed, {
                    "data-id": imgNoteText,
                    "id": `${imgNoteText}-pressed`
                })
                piano.appendChild(whiteKeyGroup)
                whiteKeyGroup.appendChild(whiteKeyObject)
                whiteKeyGroup.appendChild(whiteKeyObjectPressed)
                whiteKeyObject.appendChild(whiteKeyImage)
                whiteKeyObjectPressed.appendChild(whiteKeyImagePressed)

                whiteKeyImagePressed.style.visibility = 'hidden'
            });

            //set up black keys
            sharpNotes.forEach((note, i) => {
                const blackKeyGroup = utils.createSVGElement('g')
                const blackKeyObject = utils.createSVGElement("foreignObject")
                const blackKeyObjectPressed = utils.createSVGElement('foreignObject')

                const blackKeyImage = utils.createKeyImage(keyImages.releasedSharp[i])
                const blackKeyImagePressed = utils.createKeyImage(keyImages.pressedSharp[i])
                const imgNoteTextBlack = sharpNotes[i]
                //const imgNoteTextBlackPressed = sharpNotes[i]
                //console.log(blackKeyImage)



                utils.setAttributes(blackKeyObject, {
                    "class":"black-key",
                    "width":whiteKeyWidth /2,
                    "height":pianoHeight/ 1.6,
                    "x": blackKeyPositionX
                })

                utils.setAttributes(blackKeyObjectPressed, {
                    "class":"black-key-pressed",
                    "width":whiteKeyWidth /2,
                    "height":pianoHeight/ 1.6,
                    "x": blackKeyPositionX,
                    "id":`${imgNoteTextBlack}-pressed-black`

                })

                utils.setAttributes(blackKeyImage, {
                    "data-id":imgNoteTextBlack,
                    "id":`${imgNoteTextBlack}-released`
                })

                utils.setAttributes(blackKeyImagePressed, {
                    "data-id":imgNoteTextBlack,
                    "id":`${imgNoteTextBlack}-pressed`
                })


                if(imgNoteTextBlack[0] === "D" ||
                    imgNoteTextBlack[0] === "A"){
                        blackKeyPositionX += whiteKeyWidth * 2
                } else {
                    blackKeyPositionX += whiteKeyWidth
                }

                piano.appendChild(blackKeyGroup)
                blackKeyGroup.appendChild(blackKeyObject)
                blackKeyGroup.appendChild(blackKeyObjectPressed)
                blackKeyObject.appendChild(blackKeyImage)
                blackKeyObjectPressed.appendChild(blackKeyImagePressed)

                blackKeyImagePressed.style.visibility = 'hidden'

            });

            //setUp the WEBMIDI
            WebMidi
                .enable({sysex: true})
                .then(onEnabled)
                .catch(err => alert(err))
            console.log('webMidi enabled')
            function onEnabled() {

                const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");

                myInput.addListener("noteon", (e) =>{
                    console.log(`${e.note.identifier} is on `)
                    let showPressed = document.getElementById(`${e.note.identifier}-pressed`)
                    //let showBlackPressed = document.getElementById

                    showPressed.style.visibility = 'visible'


                })

                myInput.addListener("noteoff", (e) =>{
                    console.log(`${e.note.identifier} is off `)

                    let showHidden = document.getElementById(`${e.note.identifier}-pressed`)

                    showHidden.style.visibility = 'hidden'
                })
                //console.log(myInput)
                console.log('setup midi working')
            }
        },


    }

        app.setUpPiano();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div id="piano-container">
            {/* The piano will be rendered here by the JavaScript code */}
        </div>
    );
}

export default MidiKeyboardPage
