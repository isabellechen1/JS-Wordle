const keyboard = document.querySelector(".key-container")
const letterDisplay = document.querySelector(".letter-container")
const messageDisplay = document.querySelector('.message-container')

let wordle

const getWordle = () => {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            wordle = json.toUpperCase()
        })
        .catch(err => console.log(err))
}
getWordle()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DELETE',
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0
let currentLetter = 0
let isGameOver = false

keys.forEach(key => {
    const btnKeyboard = document.createElement('button');
    btnKeyboard.textContent = key;
    btnKeyboard.setAttribute('id', key);
    btnKeyboard.setAttribute('data-key', key)
    btnKeyboard.addEventListener('click', () => handleMouseClick(key));
    btnKeyboard.addEventListener('keydown', () => handleKeyPress(key))
    keyboard.append(btnKeyboard)
});

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const letterElement = document.createElement('div')
        letterElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-letter-' + guessIndex)
        letterElement.classList.add('letter')
        rowElement.append(letterElement)
    });
    letterDisplay.append(rowElement)
})

const handleMouseClick = (letter) => {
    if (letter === 'ENTER'){
        checkAnswer()
        return
    }
    if (letter === 'DELETE'){
        deleteLetter()
        return
    }
    addLetter(letter)
}


const handleKeyPress = (letter) => {
    if (letter === 'ENTER'){
        checkAnswer()
        return
    }
    if (letter === 'DELETE'){
        deleteLetter()
        return
    }
    addLetter(letter)
}

const addLetter = (letter) => {
    if (currentRow < 6 && currentLetter < 5){
        const letterAdded = document.getElementById('guessRow-' + currentRow + '-letter-' + currentLetter)
        letterAdded.textContent = letter
        guessRows[currentRow][currentLetter] = letter
        letterAdded.setAttribute('data', letter)
        currentLetter++
    }
}

const deleteLetter = () => {
    if (currentLetter > 0){
        currentLetter--
        const letterAdded = document.getElementById('guessRow-' + currentRow + '-letter-' + currentLetter)
        letterAdded.textContent = ""
        guessRows[currentRow][currentLetter] = ""
        letterAdded.setAttribute('data', "")
    }
}

const checkAnswer = () => {
    const guess = guessRows[currentRow].join('')
    if (currentLetter === 5){
        addColour()
       if (wordle == guess){
            showMessage("Impressive!")
            isGameOver = true
            return
       } else {
           if (currentRow >= 5){
               isGameOver = true
               showMessage("Game Over")
               return
           }
           if (currentRow < 5){
               currentRow++
               currentLetter = 0
           }

       }
    }
}

//prevent submitting answer if it's not in the word list.
//checkDic JSON not used yet

const guessAnswer = guessRows[currentRow].join('')

const checkDic = () => {
    fetch(`http://localhost:8000/check/?word=${guessAnswer}`)
        .then(response => response.json())
        .then(json => {
            if (json == 'Entry word not found') {
                showMessage('word not in list')
                return
            }
        })
}


const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => {
        messageDisplay.removeChild(messageElement)
    }, 2000);
}

//check answer - press enter - colour for: correct position, correct letter not correct position, wrong
const addColour = () => { 
    const flipRow = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    flipRow.forEach(selected => {
        guess.push({letter: selected.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]){
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    });

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)){
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    flipRow.forEach((selected, index)=> {
        setTimeout(() => {
            selected.classList.add('flip')
            selected.classList.add(guess[index].color)
            addColourToKey(guess[index].letter, guess[index].color)
        }, 400 * index);
    })
}

const addColourToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}




