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

function downloadNote (id) {
  const n = myNotes.find(x => x.id === id)
  const blob = new Blob([n.text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `note_${id}.txt`
  link.click()
}

function updateText (id, val) {
  myNotes = myNotes.map(n => (n.id === id ? { ...n, text: val } : n))
  save()
}

function changeColor (id, col) {
  myNotes = myNotes.map(n => (n.id === id ? { ...n, color: col } : n))
  save()
  refresh()
}

function removeNote (id) {
  if (confirm('Permanently delete this?')) {
    myNotes = myNotes.filter(n => n.id !== id)
    save()
    refresh()
  }
}

function addBlank () {
  const n = {
    id: Date.now(),
    text: '',
    color: 'yellow',
    date: new Date().toLocaleDateString()
  }
  myNotes.push(n)
  save()
  refresh()
}

function refresh () {
  board.innerHTML = ''
  const filtered = myNotes.filter(n => n.text.toLowerCase().includes(searchVal))

  if (filtered.length === 0 && searchVal !== '') {
    board.innerHTML = `<p class="no-match-msg">No match found...</p>`
  } else {
    filtered.forEach(n => createNote(n.id, n.text, n.color, n.date))
  }
}

clearBtn.onclick = () => {
  if (confirm('Delete every single note?')) {
    myNotes = []
    save()
    refresh()
  }
}

addBtn.onclick = addBlank

document.addEventListener('DOMContentLoaded', () => {
  createSearch()
  if (myNotes.length === 0) {
    addBlank()
  } else {
    refresh()
  }
})
