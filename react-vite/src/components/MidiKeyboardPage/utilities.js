console.log("utilities is working")

export default class Utilities  {

    createRegularElement(el){
        const element = document.createElement(el)
        return element
    }

    createSVGElement(el) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", el)
        return element
    }

    createElement(el) {
        const element = document.createElement(el)
        return element
    }

    setAttributes(el, attr) {
        for(let key in attr){
            el.setAttribute(key, attr[key])
        }
    }

    addTextContent(el,content){
        el.textContent = content
    }

    createOctave(octaveNumber){
        const octave = this.createSVGElement('g');
        octave.classList.add("octave");
        octave.setAttribute("transform", `translate(${octaveNumber * 560},0)`)
        return octave
    }

    createKey({className,width,height}){
        const key = this.createSVGElement('foreignObject');
        key.classList.add(className, "key")

        this.setAttributes(key,{
            "width":width,
            "height":height
        })
        return key
    }

    createKeyImage(src){
        const keyImage = this.createRegularElement("img");
        keyImage.setAttribute('src', src)
        return keyImage
    }

    getNaturalNotes(arr){
        return arr
    }

    createMainSVG(pianoWidth, pianoHeight, id){
        const svg = this.createSVGElement("svg");

        this.setAttributes(svg, {
            "id": `${id}`,
            "width": "100%",
            "version": "1.1",
            "xmlns": "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "viewBox": `0 0 ${pianoWidth} ${pianoHeight}`

        })

        return svg
    }

    addNote(arr,note){
        arr.push(note)
        console.log(`${note} was added to ${arr}`)
    }

    removeNote(arr,note){
        let index = arr.indexOf(note);
        arr.splice(index,1)
    }
}
