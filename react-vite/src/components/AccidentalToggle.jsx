
import { useAccidentalContext } from '../context/AccidentalContext';

const AccidentalToggle = () => {
    const { useFlats, toggleAccidentals } = useAccidentalContext();

    return (
        <button
            onClick={toggleAccidentals}
            style={{
                padding: '4px 8px',
                margin: '0px',
                backgroundColor: '#F2E4D5',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: "bold"

            }}
            title={`Switch to ${useFlats ? 'Sharp' : 'Flat'} Notation`}

        >
             Currently Using Notation :  {useFlats ? ' ♭' : ' ♯'}
        </button>
    );
};

export default AccidentalToggle;
