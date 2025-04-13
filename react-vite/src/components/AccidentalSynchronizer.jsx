import { useEffect } from 'react';
import RunMidiUtil from '../utils/runMidiUtil';
import { useAccidentalContext } from '../context/AccidentalContext';

// This component doesn't render anything, it just synchronizes the context with RunMidiUtil
const AccidentalSynchronizer = () => {
    const { useFlats } = useAccidentalContext();

    useEffect(() => {
        // Update RunMidiUtil's accidental preference when context changes
        RunMidiUtil.setAccidentalPreference(useFlats);
    }, [useFlats]);

    return null; // This component doesn't render anything
};

export default AccidentalSynchronizer;
