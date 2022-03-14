const tileContainer = document.querySelector(".tile-container") // Selecting the tiles container
const keyboardContainer = document.querySelector(".key-container") // Selecting the keyboard
const messageContainer = document.querySelector(".message-container") // Selecting the keyboard

let wordle;

const getWordle = () => {
    fetch("http://127.0.0.1:8000/word")
        .then(response => response.json())
        .then(json => {
            console.log("Here is the word of the day: ", json)
            wordle = json.toUpperCase()
        })
        .catch (err => console.log(err))
}

getWordle()

// Setting the keys for the keyboard
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
    'ENTER ✈️',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '🔙 DEL',
]
let currentRow = 0;
let currentCol = 0;
let isGameOver = false;


// Handling clicks
const clickedBtn = (key) => {
    if (!isGameOver){
        console.log(key)
        if (key == '🔙 DEL'){
            deleteLetter();
            return;
        }
    
        if (key == "ENTER ✈️"){
            checkRow();
            console.log("Check row!")
            return
        }
    
        addLetter(key)
    }
}

const addLetter = (letter) => {
    if (currentCol < 5 && currentRow < 6){
        const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentCol}`)
        tile.textContent = letter
        tile.setAttribute('data', letter)
        rowGuesses[currentRow][currentCol] = letter;
        currentCol++;
    }

}

// Delete letter in current tile 
const deleteLetter = () => {
    if (currentCol > 0){
        currentCol--
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentCol}`)
    tile.textContent = '';
    tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guess = rowGuesses[currentRow].join('') // Convert to string
    if (currentCol > 4) {

        fetch(`http://localhost:8000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json == 'Entry word not found'){
                    showMessage('Word does not seem to exist!')
                    return
                } else{

                    flipTiles()
                    if (wordle === guess)
                    {
                        isGameOver = true; 
                        showMessage(`Great job! You have guessed the word of the day! (${wordle}) 🎯`)
                        return
                    } else {
                        if (currentRow >= 5){
                            isGameOver = true;
                            showMessage(`Oh no! Game over!`)
                            return
                        }
            
                        if (currentRow < 5){
                            currentRow++
                            currentCol = 0
                        }
                    }
                }
            }).catch(err => console.log(err))


    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageContainer.append(messageElement)
    setTimeout(() => messageContainer.removeChild(messageElement), 2000)
}

// Tile animation 
const flipTiles = () => {
    const tiles = document.querySelector(`#guessRow-${currentRow}`).childNodes
    let checkWordle = wordle
    const guess = []

    tiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    } )

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]){
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)){
            guess.color = 'yellow-overlay'
            checkWordle.replace(guess.letter, '')
        }
    })

    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index.color])
        }, 500 * index)
    })
}



// Add keys to keyboard
keys.forEach(key => {
    const buttonKey = document.createElement("button")
    buttonKey.textContent = key;
    buttonKey.setAttribute('id', key)
    buttonKey.addEventListener('click', () => clickedBtn(key))
    keyboardContainer.append(buttonKey)
})

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)

    key.classList.add(color)
}

// End of keys section



// Setting tiles

const rowGuesses = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

// Iterate through each row
rowGuesses.forEach((guessRow, index) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', `guessRow-${index}` )

    // Iterate through each column
    guessRow.forEach((guess, guessIndex) =>{
        const tile = document.createElement('div')
        tile.setAttribute('id', `guessRow-${index}-tile-${guessIndex}`)
        tile.classList.add("tile")
        rowElement.append(tile)
    })

    tileContainer.append(rowElement)

})







