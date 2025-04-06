import { Instrument } from "piano-chart";
import { createElement } from "react";


export default class PianoUtils  {

    createElement(el){
        const element = document.createElement(el)
        element.setAttribute('id','PianoContainer' )
        return element
    }

    piano = new Instrument(document.getElementById('PianoContainer'), {
        startOctave: 3,
        endOctave: 5,
    })
}


