import React from 'react'

import { puzzleData } from '../constants/puzzleData'
import TTSView from './TTSView'

function calcCoords(list) {
  const entries = list.reduce((index, data) => {
    const words = data.answer.split('')
    const coords = []
    for (let j = 0; j < words.length; j += 1) {
      coords.push(j)
      const coord = data.orientation === 'across'
        ? `${(data.startCol += 1) - 1},${data.startRow}`
        : `${data.startCol},${(data.startRow += 1) - 1}`
      coords[j] = {
        coord,
        length: words.length,
        word: words[j],
        position: data.position,
        orientation: data.orientation
      }
    }
    index[`${data.position}-${data.orientation}`] = coords
    return index
  }, {})

  const cols = Object.keys(entries).map((idx) => entries[idx].map(entry => entry.coord.split(',')[0])).flat(2)
  const rows = Object.keys(entries).map((idx) => entries[idx].map(entry => entry.coord.split(',')[1])).flat(2)

  const totalCols = Math.max.apply(Math, cols)
  const totalRows = Math.max.apply(Math, rows)

  return {
    entries,
    totalRows,
    totalCols
  }
}

function handleFilteredClass(className, orientation) {
  const oppositeOrientation = orientation === 'across' ? 'down' : 'across'
  const oppositeOrientationDirection = oppositeOrientation === 'across' ? 'row' : 'col'
  const filtered = className.split(' ')
    .filter(split => !split.includes(oppositeOrientation))
    .filter(split => !split.includes(oppositeOrientationDirection))
    .filter(split => !split.includes('active'))
    .join(' ')

  return filtered
}

function TTSContainer() {
  const [totalRows, setTotalRows] = React.useState(0)
  const [totalCols, setTotalCols] = React.useState(0)
  const [entries, setEntries] = React.useState({})
  const [cellOrientation, setCellOrientation] = React.useState('')
  const [answerAttempt, setAnswerAttempt] = React.useState({
    position: '',
    words: [],
  })
  const [activeCellClass, setActiveCellClass] = React.useState('')

  React.useEffect(() => {
    const data = calcCoords(puzzleData)
    setTotalRows(data.totalRows)
    setTotalCols(data.totalCols)
    setEntries(data.entries)
  }, [])

  const firstValues = Object.keys(entries).map(entry => {
    return {
      position: entry.split('-')[0],
      orientation: entry.split('-')[1],
      coord: entries[entry][0].coord,
      word: entries[entry][0].word,
    }
  })

  const convertedEntries = Object.keys(entries).map(entry => entries[entry]).flat(2)

  function onClickCell(e) {
    if (e.target.dataset.answered !== 'true') {
      setAnswerAttempt({
        position: e.target.dataset.firstPosition,
        words: [answerAttempt.words?.[0]]
      })
      const orientation = e.target.dataset.firstPosition.split('-')[1]
      const { className } = e.target
      e.target.select()
      setCellOrientation(orientation)
      const filteredClass = handleFilteredClass(className, orientation)
      setActiveCellClass(filteredClass)

      const activeCells = document.getElementsByClassName(filteredClass)
      for(let i = 0; i < activeCells.length; i += 1) {
        activeCells[i].classList.add('active')
      }
    }
  }

  function onClickClue(e) {
    const { targetClass } = e.target.dataset
    const activeCells = document.getElementsByClassName(targetClass)
    for(let i = 0; i < activeCells.length; i += 1) {
      activeCells[i].classList.add('active')
    }
    activeCells[0].select()
    setCellOrientation(e.target.dataset.orientation)
  }

  function onClickOutsideCell(className) {
    const activeCells = document.getElementsByClassName(className)
    for(let i = 0; i < activeCells.length; i += 1) {
      activeCells[i].classList.remove('active')
    }
  }

  function onChangeCell(e) {
    const { col, row } = e.target.dataset
    const index = answerAttempt.position.split('-')[1] === 'across' ? (+col - 1) : (+row - 1) 
    const newAttemptWords = answerAttempt.words.slice()
    newAttemptWords.splice(index, 1, e.target.value)
    setAnswerAttempt({
      ...answerAttempt,
      words: newAttemptWords
    })
  }

  React.useEffect(() => {
    if(answerAttempt) {
      const attempt = answerAttempt.words.join('')
      const answer = entries[answerAttempt.position]?.map(entry => entry.word).join('')
      if (attempt === answer) {
        const answeredCells = document.getElementsByClassName(activeCellClass)
        for(let i = 0; i < answeredCells.length; i += 1) {
          answeredCells[i].classList.remove('active')
          answeredCells[i].classList.add('answered')
          answeredCells[i].setAttribute('disabled', true)
          answeredCells[i].setAttribute('data-answered', 'true')
        }
      }
    }
  }, [answerAttempt, entries, activeCellClass])

  const props = {
    cellOrientation,
    convertedEntries,
    firstValues,
    onClickCell,
    onClickClue,
    onClickOutsideCell,
    onChangeCell,
    totalCols,
    totalRows
  }
  return (
    <TTSView {...props} />
  )
}

export default TTSContainer
