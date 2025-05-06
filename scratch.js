const arr = ['', 'Bbm7', 'Cm7', 'Dbm7b5', 'Ebm7b5', 'Fm7', '']
/*
const na = (oldArr) => {
    //create a new array
    const newArr = [];

    //loop through oldArr
    for (let i = 0; i < oldArr.length; i++) {
        const element = oldArr[i];
        // if theres an item that is an empty string change the empty string to NA
        //if(element === " ") newArr.push(addNa(element))
        newArr.push(element)
    }


    console.log(newArr)
    //return newArr
    return newArr
}
*/

const na = (oldArr) => {
    console.log(oldArr.map(item => item === '' ? 'NA' : item))
    return oldArr.map(item => item === '' ? 'NA' : item);
}

console.log(na(arr))
