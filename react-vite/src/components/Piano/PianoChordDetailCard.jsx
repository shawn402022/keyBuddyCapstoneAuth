import './PianoChordDetailCard.css'

const PianoChordDetailCard = ({ name, image, notes, id }) => {
    return (
        <div className='card-container'>
            <div className='card-chord-sec1'>
                <div className='card-chord-chord-name'>{name}</div>
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
