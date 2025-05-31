import './PianoChordDetailCard.css'
import { usePianoContext } from '../../context/PianoContext'
import RunMidiUtil from '../../utils/runMidiUtil'

const PianoChordDetailCard = ({ name, image, notes, id }) => {


    const handleListenClick = (notes) => {
        // Split the notes string into an array
        let noteArr = notes.split(',')

        // Clean up any whitespace from the notes
        noteArr = noteArr.map(note => note.trim())

        // Play each note with a staggered delay
        noteArr.forEach((note, index) => {
            if(note === "E#") note = 'F'
            if(note === "Fb") note = 'E'
            if(note === "B#") note = 'C'
            if(note === "Cb") note = 'B'


            // Calculate delay: first note plays immediately, each subsequent note waits longer
            const delayTime = index * 50; // 300ms between each note start

            setTimeout(() => {
                console.log(`Playing note ${index + 1}: ${note}`)

                // Play the note
                RunMidiUtil.handleNotePlay(`${note}4`)

                // Stop the note after 500ms (note duration)
                setTimeout(() => {
                    RunMidiUtil.handleNoteOff(`${note}4`)
                }, 500)

            }, delayTime)
        })

    }
    return (
        <div className='card-container'>
            <div className='card-chord-sec1'>
                <button className="chord-listen" onClick={() => handleListenClick(notes)}>listen</button>
                <div className='card-chord-chord-name'>Play: {name}</div>
                <div className='card-chord-visual-piano'>{image}</div>

            </div>
            <div className='card-chord-sec2'>


                <div className='card-chord-notes'>{notes}</div>
                <div className='card-chord-chord-id'>Id: {id}</div>

            </div>

        </div>
    )
}

export default PianoChordDetailCard
