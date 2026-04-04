const addBtn = document.getElementById('new-note-btn')
const board = document.getElementById('board')
const clearBtn = document.getElementById('clear-all')
const topBar = document.querySelector('.top-bar')

let myNotes = JSON.parse(localStorage.getItem('sticky_data_v3')) || []
let searchVal = ''

function createSearch () {
  const search = document.createElement('input')
  search.type = 'text'
  search.placeholder = 'Search notes...'
  search.className = 'search-input'

  search.oninput = e => {
    searchVal = e.target.value.toLowerCase()
    refresh()
  }

  topBar.insertBefore(search, topBar.lastElementChild)
}

function save () {
  localStorage.setItem('sticky_data_v3', JSON.stringify(myNotes))
}

function createNote (id, content, color, date) {
  const card = document.createElement('div')
  card.className = `note-card ${color}`

  card.innerHTML = `
        <textarea class="text-area" placeholder="Write here...">${content}</textarea>
        <div class="note-info">
            Characters: <span class="char-count">${content.length}</span>
        </div>
        <div class="note-footer">
            <div class="color-dots">
                <div class="dot yellow" onclick="changeColor(${id}, 'yellow')"></div>
                <div class="dot pink" onclick="changeColor(${id}, 'pink')"></div>
                <div class="dot blue" onclick="changeColor(${id}, 'blue')"></div>
            </div>
            <div class="note-actions">
                <button title="Download" class="btn-download" onclick="downloadNote(${id})">💾</button>
                <button class="btn-del" onclick="removeNote(${id})">🗑</button>
            </div>
        </div>
    `

  const area = card.querySelector('textarea')
  const countSpan = card.querySelector('.char-count')

  area.oninput = e => {
    const val = e.target.value
    countSpan.innerText = val.length
    updateText(id, val)
  }

  board.appendChild(card)
}
