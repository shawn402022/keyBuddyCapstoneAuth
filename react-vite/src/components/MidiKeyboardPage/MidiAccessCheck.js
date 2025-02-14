

export function MidiAccessCheck() {

  console.log('midiAccess Check working')
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success,failure);
  }

  function success(midiAccess) {
      midiAccess.addEventListener('statechange', updateDevices);

      const inputs = midiAccess.inputs;

      inputs.forEach((input) => {
        console.log(input);
        oninput.onmidimessage = handleInput;
      })
  }

  function handleInput(event) {
      console.log('Received MIDI Message:', event.data);
  }

  function updateDevices(e) {
      console.log(e);
  }

  function failure(err) {
      console.log('Unable to access your MIDI devices:', err);
  }

}
