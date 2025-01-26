import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect, useRef } from 'react';
import * as Tonal from 'tonal'
import { WebMidi } from "webmidi";
import './MidiKeyboardPage.css';
import { useSelector } from 'react-redux';

const chromaticNotes = Tonal.Range.chromatic(['C2', 'B7'], { sharps: true }).filter((note) => note.length === 2)
const sharpNotes = Tonal.Range.chromatic(['C2', 'B7'], { sharps: true }).filter((note) => note.length > 2)

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//Load all the piano notes, sharp Notes and flatNotes
const loadPianoSounds = async () => {
    const soundsCache = {};
    // Load natural notes
    for (const note of chromaticNotes) {
        console.log('Loading natural note:', note);
        const response = await fetch(`/piano-sounds-with-sharps/${note}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundsCache[note] = audioBuffer;
    }
    // Load sharp notes
    for (const note of sharpNotes) {
        console.log('Loading sharp note:', note);
        const noteForPath = note.replace('#', 'sharp');
        console.log('Requesting file:', `/piano-sounds-with-sharps/${noteForPath}.mp3`);
        const response = await fetch(`/piano-sounds-with-sharps/${noteForPath}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundsCache[note] = audioBuffer;
    }
    return soundsCache;
};

const MidiKeyboardPage = () => {
    const message = useSelector(state => state.keyChallenge.message);
    const isMouseDown = useRef(false);
    
    const soundsCacheRef = useRef(null);

    useEffect(() => {





        const keyImages = new KeyImages();
        const utils = new Utilities();

        document.addEventListener('mousedown', () => isMouseDown.current = true);
        document.addEventListener('mouseup', () => isMouseDown.current = false);








        const activateKey = (noteId) => {
            const showPressed = document.getElementById(`${noteId}-pressed`);
            showPressed.style.visibility = 'visible';
            playNote(noteId);
            let noteLabel = document.getElementById(`note-label-${noteId}`);

            if (!noteLabel) {
                noteLabel = document.createElement('div');
                noteLabel.id = `note-label-${noteId}`;
                noteLabel.style.position = 'fixed';
                noteLabel.style.textAlign = 'center';
                noteLabel.style.width = '25px';
                noteLabel.style.height = '25px';
                noteLabel.style.color = 'white';
                noteLabel.style.fontSize = '14px';
                noteLabel.style.backgroundColor = 'black';
                noteLabel.style.padding = '0';
                noteLabel.style.margin = '0';
                noteLabel.style.lineHeight = '25px';
                noteLabel.style.borderRadius = '3px';

                const keyElement = document.getElementById(`${noteId}-pressed`);
                const rect = keyElement.getBoundingClientRect();
                noteLabel.style.left = `${rect.left + (rect.width / 2) - 12.5}px`;
                noteLabel.style.top = `${rect.bottom + 2}px`;
                document.body.appendChild(noteLabel);
            }

            const letter = noteId[0];
            const number = noteId[noteId.length - 1];
            if (noteId.includes('#')) {
                noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">#</span><span style="font-size: 10px">${number}</span>`;
            } else {
                noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">${number}</span>`;
            }
        };

        const app = {
            setUpPiano() {
                if (document.getElementById('piano')) return;

                console.log('setup piano working')
                const whiteKeyWidth = 80;
                let blackKeyPositionX = 60;
                const pianoHeight = 400;
                const naturalNotes = utils.getNaturalNotes(chromaticNotes)
                const pianoWidth = naturalNotes.length * whiteKeyWidth
                const div = utils.createElement("div")
                const piano = utils.createMainSVG(pianoWidth, pianoHeight, "piano")

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
                        "class": "white-key",
                        "width": whiteKeyWidth,
                        "height": pianoHeight,
                        "x": whiteKeyWidth * i,
                        "style": "cursor: pointer"
                    })
                    utils.setAttributes(whiteKeyObjectPressed, {
                        "class": "white-key-pressed",
                        "width": whiteKeyWidth,
                        "height": pianoHeight,
                        "x": whiteKeyWidth * i,
                        "data-id": imgNoteText,
                        "id": `${imgNoteText}-pressed-white`
                    })
                    utils.setAttributes(whiteKeyImage, {
                        "data-id": imgNoteText,
                        "id": `${imgNoteText}-released`
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

                    utils.setAttributes(blackKeyObject, {
                        "class": "black-key",
                        "width": whiteKeyWidth / 2,
                        "height": pianoHeight / 1.6,
                        "x": blackKeyPositionX
                    })

                    utils.setAttributes(blackKeyObjectPressed, {
                        "class": "black-key-pressed",
                        "width": whiteKeyWidth / 2,
                        "height": pianoHeight / 1.6,
                        "x": blackKeyPositionX,
                        "id": `${imgNoteTextBlack}-pressed-black`

                    })

                    utils.setAttributes(blackKeyImage, {
                        "data-id": imgNoteTextBlack,
                        "id": `${imgNoteTextBlack}-released`,
                        "draggable": false
                    })

                    utils.setAttributes(blackKeyImagePressed, {
                        "data-id": imgNoteTextBlack,
                        "id": `${imgNoteTextBlack}-pressed`,
                        "draggable": false
                    })
                    if (imgNoteTextBlack[0] === "D" ||
                        imgNoteTextBlack[0] === "A") {
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
                            isMouseDown.current = true;
                            activateKey(noteId);
                        });

                        element.addEventListener('mouseenter', () => {
                            if (isMouseDown.current) {
                                activateKey(noteId);
                            }
                        });

                        element.addEventListener('mouseup', () => {
                            const showHidden = document.getElementById(`${noteId}-pressed`)
                            showHidden.style.visibility = 'hidden'
                            let noteLabel = document.getElementById(`note-label-${noteId}`)
                            if (noteLabel) noteLabel.remove()
                        })

                        element.addEventListener('mouseleave', () => {
                            const showHidden = document.getElementById(`${noteId}-pressed`)
                            showHidden.style.visibility = 'hidden'
                            let noteLabel = document.getElementById(`note-label-${noteId}`)
                            if (noteLabel) noteLabel.remove()
                        })
                    })
                })

                // Similar updates for black keys
                piano.querySelectorAll('.black-key').forEach(key => {
                    const keyImage = key.querySelector('img')
                    const noteId = keyImage.getAttribute('data-id')
                    const elements = [key, keyImage]

                    elements.forEach(element => {
                        element.addEventListener('mousedown', () => {
                            isMouseDown.current = true;
                            activateKey(noteId);
                        });

                        element.addEventListener('mouseenter', () => {
                            if (isMouseDown.current) {
                                activateKey(noteId);
                            }
                        });

                        element.addEventListener('mouseup', () => {
                            const showHidden = document.getElementById(`${noteId}-pressed`)
                            showHidden.style.visibility = 'hidden'
                            let noteLabel = document.getElementById(`note-label-${noteId}`)
                            if (noteLabel) noteLabel.remove()
                        })

                        element.addEventListener('mouseleave', () => {
                            const showHidden = document.getElementById(`${noteId}-pressed`)
                            showHidden.style.visibility = 'hidden'
                            let noteLabel = document.getElementById(`note-label-${noteId}`)
                            if (noteLabel) noteLabel.remove()
                        })
                    })
                })

                WebMidi.enable({ sysex: true })


                    .then(async () => {
                        let soundsCache = await loadPianoSounds();

                        const playNote = (note) => {
                            const source = audioContext.createBufferSource();
                            source.buffer = soundsCache[note];
                            source.connect(audioContext.destination);
                            source.start(0);
                        };



                        // Add this message effect inside onEnabled
                        if (message) {
                            const noteMatch = message.match(/play the ([A-G]#?\d)/i);
                            if (noteMatch) {
                                const noteToPlay = noteMatch[1];
                                playNote(noteToPlay);
                            }
                        }






                        const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
















                        myInput.addListener("noteon", (e) => {
                            console.log(`${e.note.identifier} is on `);
                            let showPressed = document.getElementById(`${e.note.identifier}-pressed`);
                            showPressed.style.visibility = 'visible';
                            playNote(e.note.identifier);





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
                                noteLabel.style.left = `${rect.left + (rect.width / 2) - 12.5}px`
                                noteLabel.style.top = `${rect.bottom + 2}px`










                                document.body.appendChild(noteLabel)
                            }





                            const noteText = e.note.identifier
                            const letter = noteText[0]
                            const number = noteText[noteText.length - 1]
                            if (noteText.includes('#')) {
                                noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">#</span><span style="font-size: 10px">${number}</span>`
                            } else {
                                noteLabel.innerHTML = `<span style="color: #00ff00">${letter}</span><span style="font-size: 10px">${number}</span>`
                            }
                        });





                        myInput.addListener("noteoff", (e) => {
                            console.log(`${e.note.identifier} is off `)
                            let showHidden = document.getElementById(`${e.note.identifier}-pressed`)
                            showHidden.style.visibility = 'hidden'

                            let noteLabel = document.getElementById(`note-label-${e.note.identifier}`)
                            if (noteLabel) {
                                noteLabel.remove()
                            }
                        })
                    })

                    .catch(err => alert(err));
            },
        }

        app.setUpPiano();

    }, [message]);


    const feedback = useSelector(state => state.keyChallenge.feedback);

    return (
        <>
            <div id="piano-container">
            <img className="scales"
                src="/images/background-scales-lighter.png"
                alt="KBuddy logo" />
            </div>
            <div className='training-container'>
                <div className='question'>
                    {message && <div className="key-message">{message}</div>}
                </div>

                <div className='answer'>
                    {feedback && <div className="key-feedback">{feedback}</div>}
                </div>
            </div>
        </>
    );
}
export default MidiKeyboardPage
