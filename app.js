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

const handleKeyPress = (letter) => {
    let keyValue = letter.key
    if (keyValue === 'Enter'){
        checkAnswer()
        return
    }
    if (keyValue === 'DELETE' || keyValue === 'Backspace'){
        deleteLetter()
        return
    }
    if (keyValue.ctrlKey || keyValue.metaKey || keyValue.altKey) {
        return
      }
    addLetter(keyValue.toUpperCase())
}


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

keys.forEach(key => {
    const btnKeyboard = document.createElement('button');
    btnKeyboard.textContent = key;
    btnKeyboard.setAttribute('id', key);
    btnKeyboard.setAttribute('data-key', key)
    btnKeyboard.addEventListener('click', () => handleMouseClick(key));
    document.addEventListener('keydown', handleKeyPress)
    keyboard.append(btnKeyboard)
});

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

//prevent submitting answer if it's not in the word list.
const guessAnswer = guessRows[currentRow].join('')
let dict =[]

async function getDict(){
    const res = await fetch(`http://localhost:8000/check/?word=${guessAnswer}`)
    const dict = await res.json()
    addData(dict)
}

const addData = (object) => {
    dict.push(object)
}

const checkAnswer = () => {
    const guess = guessRows[currentRow].join('')
    if (currentLetter > 4 ) {
        getDict()
        if (dict == 'Entry word not found') {
            showMessage('word not in list')
            shakeTiles()
            return
        } else {
            addColour()
            if (wordle == guess) {
                showMessage('Magnificent!')
                danceTiles()
                isGameOver = true
                return
            } else {
                if (currentRow >= 5) {
                    isGameOver = true
                    showMessage('Game Over')
                    return
                }
                if (currentRow < 5) {
                    currentRow++
                    currentLetter = 0
                }
            }
        }
    }
}

//check answer - press enter - colour for: correct position, correct letter not correct position, wrong
const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => {
        messageDisplay.removeChild(messageElement)
    }, 2000);
}

const addColourToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

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




const shakeTiles = () =>  {
    const shakeRow = document.querySelector('#guessRow-' + currentRow).childNodes
    shakeRow.forEach(selected => {
        selected.classList.add('shake')
        selected.addEventListener(
            'animationend',
            () => {
                selected.classList.remove('shake')
            },
            { once: true }
          )
    })
}

const danceTiles = () =>  {
    const danceRow = document.querySelector('#guessRow-' + currentRow).childNodes
    danceRow.forEach(selected => {
        selected.classList.add('dance')
        selected.addEventListener(
            'animationend',
            () => {
                selected.classList.remove('dance')
            },
            { once: true }
          )
    })
}
