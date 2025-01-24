import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect } from 'react';
import * as Tonal from 'tonal'
import {WebMidi} from "webmidi";
import './MidiKeyboardPage.css'

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
                      "x": whiteKeyWidth * i,
                      "style": "cursor: pointer"
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
// For white keys
piano.querySelectorAll('.white-key').forEach(key => {
    const keyImage = key.querySelector('img')
    const noteId = keyImage.getAttribute('data-id')
    const elements = [key, keyImage]

    elements.forEach(element => {
        element.addEventListener('mousedown', () => {
            let showPressed = document.getElementById(`${noteId}-pressed`)
            showPressed.style.visibility = 'visible'

            let noteLabel = document.getElementById(`note-label-${noteId}`)
            if (!noteLabel) {
                noteLabel = document.createElement('div')
                noteLabel.id = `note-label-${noteId}`
                noteLabel.style.position = 'fixed'
                noteLabel.style.textAlign = 'center'
                noteLabel.style.width = '25px'
                noteLabel.style.height = '25px'
                noteLabel.style.color = 'white'
                noteLabel.style.fontSize = '14px'
                noteLabel.style.backgroundColor = 'black'
                noteLabel.style.padding = '0'
                noteLabel.style.margin = '0'
                noteLabel.style.lineHeight = '25px'
                noteLabel.style.borderRadius = '3px'

                const keyElement = document.getElementById(`${noteId}-pressed`)
                const rect = keyElement.getBoundingClientRect()
                noteLabel.style.left = `${rect.left + (rect.width/2) - 12.5}px`
                noteLabel.style.top = `${rect.bottom + 2}px`

                document.body.appendChild(noteLabel)
            }

            const letter = noteId[0]
            const number = noteId[noteId.length - 1]
            noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">${number}</span>`
        })

        element.addEventListener('mouseup', () => {
            let showHidden = document.getElementById(`${noteId}-pressed`)
            showHidden.style.visibility = 'hidden'

            let noteLabel = document.getElementById(`note-label-${noteId}`)
            if (noteLabel) {
                noteLabel.remove()
            }
        })

        element.addEventListener('mouseleave', () => {
            let showHidden = document.getElementById(`${noteId}-pressed`)
            showHidden.style.visibility = 'hidden'

            let noteLabel = document.getElementById(`note-label-${noteId}`)
            if (noteLabel) {
                noteLabel.remove()
            }
        })
    })
})

// Similar updates for black keys
piano.querySelectorAll('.black-key').forEach(key => {
    const pressedKey = key.nextElementSibling
    const noteId = pressedKey.getAttribute('id').replace('-pressed-black', '')

    key.addEventListener('mousedown', () => {
        pressedKey.style.visibility = 'visible'

        let noteLabel = document.getElementById(`note-label-${noteId}`)
        if (!noteLabel) {
            noteLabel = document.createElement('div')
            noteLabel.id = `note-label-${noteId}`
            noteLabel.style.position = 'fixed'
            noteLabel.style.textAlign = 'center'
            noteLabel.style.width = '25px'
            noteLabel.style.height = '25px'
            noteLabel.style.color = 'white'
            noteLabel.style.fontSize = '14px'
            noteLabel.style.backgroundColor = 'black'
            noteLabel.style.padding = '0'
            noteLabel.style.margin = '0'
            noteLabel.style.lineHeight = '25px'
            noteLabel.style.borderRadius = '3px'

            const rect = pressedKey.getBoundingClientRect()
            noteLabel.style.left = `${rect.left + (rect.width/2) - 12.5}px`
            noteLabel.style.top = `${rect.bottom + 2}px`

            document.body.appendChild(noteLabel)
        }

        const letter = noteId[0]
        const number = noteId[noteId.length - 1]
        if (noteId.includes('#')) {
            noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">#</span><span style="font-size: 10px">${number}</span>`
        }
    })

    key.addEventListener('mouseup', () => {
        pressedKey.style.visibility = 'hidden'
        let noteLabel = document.getElementById(`note-label-${noteId}`)
        if (noteLabel) {
            noteLabel.remove()
        }
    })

    // Add mouse leave handler for better UX
    key.addEventListener('mouseleave', () => {
        pressedKey.style.visibility = 'hidden'
        let noteLabel = document.getElementById(`note-label-${noteId}`)
        if (noteLabel) {
            noteLabel.remove()
        }
    })
})
            //setUp the WEBMIDI
            WebMidi.enable({sysex: true})
                .then(onEnabled)
                .catch(err => alert(err))
            console.log('webMidi enabled')
            function onEnabled() {

                const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
                myInput.addListener("noteon", (e) => {
                    console.log(`${e.note.identifier} is on `)
                    let showPressed = document.getElementById(`${e.note.identifier}-pressed`)
                    showPressed.style.visibility = 'visible'

                    // Create or update note label
                    let noteLabel = document.getElementById(`note-label-${e.note.identifier}`)
                    if (!noteLabel) {
                        noteLabel = document.createElement('div')
                        noteLabel.id = `note-label-${e.note.identifier}`
                        noteLabel.style.position = 'fixed'
                        noteLabel.style.textAlign = 'center'
                        noteLabel.style.width = '25px'
                        noteLabel.style.height = '25px'
                        noteLabel.style.color = 'white'
                        noteLabel.style.fontSize = '14px'
                        noteLabel.style.backgroundColor = 'black'
                        noteLabel.style.padding = '0'
                        noteLabel.style.margin = '0'
                        noteLabel.style.lineHeight = '25px'
                        noteLabel.style.borderRadius = '3px'

                        const keyElement = document.getElementById(`${e.note.identifier}-pressed`)
                        const rect = keyElement.getBoundingClientRect()
                        noteLabel.style.left = `${rect.left + (rect.width/2) - 12.5}px`
                        noteLabel.style.top = `${rect.bottom + 2}px`

                        document.body.appendChild(noteLabel)
                    }

                    // Format the note text with colored letter, scaled sharp symbol and number
                    const noteText = e.note.identifier
                    const letter = noteText[0]
                    const number = noteText[noteText.length - 1]
                    if (noteText.includes('#')) {
                        noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">#</span><span style="font-size: 10px">${number}</span>`
                    } else {
                        noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">${number}</span>`
                    }
                })

                myInput.addListener("noteoff", (e) => {
                    console.log(`${e.note.identifier} is off `)
                    let showHidden = document.getElementById(`${e.note.identifier}-pressed`)
                    showHidden.style.visibility = 'hidden'

                    // Remove note label
                    let noteLabel = document.getElementById(`note-label-${e.note.identifier}`)
                    if (noteLabel) {
                        noteLabel.remove()
                    }
                })
                console.log('setup midi working')
            }
        },

    }

        app.setUpPiano();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div id="piano-container">
            {/* The piano will be rendered here by the JavaScript code */}
            <img className="scales"
            src="/dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>

    );
}

export default MidiKeyboardPage
