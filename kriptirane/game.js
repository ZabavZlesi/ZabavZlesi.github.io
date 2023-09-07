elementType = "p";
color = "none";

let arr = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ'
let arrSmall = 'абвгдежзийклмнопрстуфхцчшщъьюя'

let key = 3

elementType = "input";
let inputKey = iredrawable(centerX-25,centerY + 10,60,20)
inputKey.type = 'number'
inputKey.value = 0

let wordInput = iredrawable(centerX - 150,10,300,20)

elementType = "p";

let word = ''

let newWord = ''

let field = iredrawable(centerX-150,40,300,20)

function loopAZ(num) {
  let n = num
  while (n > arr.length-1) {
    n-=arr.length
  }
  while (n < 0) {
    n+=arr.length
  }
  return n
}

elementType = "button";

let upButton = iredrawable(centerX - 60,centerY - 30,60,20)
upButton.innerHTML = '<---'
upButton.onclick = () => {
  key = parseInt(key)+ 1
  inputKey.value = key
}

let downButton = iredrawable(centerX + 20,centerY - 30,60,20)
downButton.innerHTML = '--->'
downButton.onclick = () => {
  key = parseInt(key)- 1
  inputKey.value = key
}

elementType = "p";

// for (let i = 0; i < 100; i++){
//   for (let j = 0; j < 100; j++){
//     sOImage("kot", i,j, 100, 100)
//   }
// }

function update() {
  key = inputKey.value
  if (key === '') {
    key = 0
  }
  word = wordInput.value
  newWord = ''
  for (let i = 0; i < word.length; i++){
    let tempLetter = word[i]
    if (word[i] === ' ') {
      tempLetter = ''
    } else {
      if (arr.indexOf(word[i]) < 0) {
        if (arrSmall.indexOf(word[i]) > -1) {
          let index = arrSmall.indexOf(word[i])
          tempLetter = arr[index]
        } else {
          tempLetter = ''
        }
      }
    }
    newWord+=tempLetter
  }
  wordInput.value = newWord
  let tempWord = ''
  let tempKey = parseInt(key) 
  for (let i = 0; i < newWord.length; i++){
    let letter = newWord[i]
    if (letter !== ' ') {
      let index = arr.indexOf(letter)
      let newLetter = 0;
      if (index === -1) {
        newLetter = arrSmall[arrSmall.indexOf(letter) + loopAZ(tempKey)]
      } else {
        if (index + loopAZ(tempKey) > arr.length-1) {
          newLetter = arr[index + loopAZ(tempKey) - arr.length]
        } else {
          newLetter = arr[index + loopAZ(tempKey)]
        }
      }
      tempWord+=newLetter
    } else {
      tempWord+= ' '
    }
  }
  field.innerHTML = tempWord
}

function draw() {
  let i = 0
  for (let a = 0; a < Math.PI*2; a+=Math.PI*2/arr.length){
    let letter = arr[i]
    let place = fillRect(
      centerX + Math.cos(a-Math.PI/2) * 200,
      centerY + Math.sin(a-Math.PI/2) * 200,
      10,10)
    place.innerHTML = letter

    let number = fillRect(
      centerX + Math.cos(a-Math.PI/2) * 180,
      centerY + Math.sin(a-Math.PI/2) * 180,
      10,10)
    number.innerHTML = i + 1

    elementType = 'div'
    color = "red";

    fillRect(
      centerX + Math.cos(-Math.PI/2) * 190,
      centerY + Math.sin(-Math.PI/2) * 190,
      10,10)

    elementType = 'p'
    color = "none";
    
      //inner circle

    let letter2 = arr[i]
    let place2 = fillRect(
      centerX + Math.cos(a-Math.PI/2 - Math.PI*2/arr.length*key) * 135,
      centerY + Math.sin(a-Math.PI/2 - Math.PI*2/arr.length*key) * 135,
      10,10)
    place2.innerHTML = letter2

    let number2 = fillRect(
      centerX + Math.cos(a-Math.PI/2 - Math.PI*2/arr.length*key) * 115,
      centerY + Math.sin(a-Math.PI/2 - Math.PI*2/arr.length*key) * 115,
      10,10)
    number2.innerHTML = i + 1

    elementType = 'div'
    color = "red";

    fillRect(
      centerX + Math.cos(-Math.PI/2 - Math.PI*2/arr.length*key) * 150,
      centerY + Math.sin(-Math.PI/2 - Math.PI*2/arr.length*key) * 150+20,
      10,10)

    elementType = 'p'
    color = "none";

    i++
  }
}