import React from 'react'

import { puzzleData } from '../constants/puzzleData'
import useOutsideClick from '../hooks/useOutsideClick'
import './TTS.css'

function getDataFromEntry(entries, coordinate) {
  const data = {}
  const collections = entries.filter(entry => entry.coord === coordinate)
  if (collections.length > 0) {
    data.coord = collections[0].coord
    data.word = collections[0].word
    data.position = {
      ...collections[0].position && { firstPosition: collections[0].position },
      ...collections[1]?.position && { secondPosition: collections[1].position },
    }
    data.length = {
      ...collections[0].length && { firstLegth: collections[0].length },
      ...collections[1]?.length && { secondLength: collections[1].length },
    }
    data.orientation = {
      ...collections[0].orientation && { firstOrientation: collections[0].orientation },
      ...collections[1]?.orientation && { secondOrientation: collections[1].orientation },
    }
  }
  return data
} 

function TD({
  cellOrientation,
  col,
  data,
  hasInput,
  hasNumber,
  number,
  onClick,
  onClickOutside,
  row
}) {
  let classNameOrientation = ''
  if (data.orientation?.secondOrientation) {
    classNameOrientation = `cell-orientation-${data.orientation.firstOrientation} cell-orientation-${data.orientation.secondOrientation}`
  } else if (data.orientation?.firstOrientation) {
    classNameOrientation = `cell-orientation-${data.orientation.firstOrientation}`
  }

  let classNamePosition = ''
  if (data.position?.secondPosition) {
    classNamePosition = `cell-position-${data.position.firstPosition}-${data.orientation.firstOrientation} cell-position-${data.position.secondPosition}-${data.orientation.secondOrientation}`
  } else if (data.position?.firstPosition) {
    classNamePosition = `cell-position-${data.position.firstPosition}-${data.orientation.firstOrientation}`
  }
  
  const cellRef = React.useRef(null)
  const className = `${classNameOrientation} ${classNamePosition} cell-row-${row} cell-col-${col}`
  useOutsideClick(cellRef, () => onClickOutside(className))

  function onKeyUp(e) {
    const { dataset } = e.target
    if (e.key === "Delete" || e.key === "Backspace") {
      const prevId = cellOrientation === 'across'
      ? `${+dataset.col - 1},${dataset.row}`
      : `${dataset.col},${+dataset.row - 1}`
      document.getElementById(prevId)?.select()
    } else if (e.key !== '') {
      const nextId = cellOrientation === 'across'
      ? `${+dataset.col + 1},${dataset.row}`
      : `${dataset.col},${+dataset.row + 1}`
      document.getElementById(nextId)?.select()
    }
  }

  return(
    <td>
      {hasInput && (
        <input
          autoComplete="off"
          ref={cellRef}
          className={className}
          id={data.coord}
          maxLength={1}
          onKeyUp={onKeyUp}
          onClick={onClick}
          data-first-orientation={data.orientation.firstOrientation}
          data-second-orientation={data.orientation.secondOrientation}
          data-col={col}
          data-row={row}
        />
      )}
      {hasNumber && (
        <span>{number}</span>
      )}
    </td>
  )
}

function TTSView({
  cellOrientation,
  convertedEntries,
  firstValues,
  onClickCell,
  onClickOutsideCell,
  onClickClue,
  totalCols,
  totalRows
}) {
  return (
    <div className="tts-container">
      <div className="tts-questions">
        <div className="across">
          <h2>Mendatar</h2>
          {puzzleData.filter(data => data.orientation === 'across').map(data => (
            <p
              key={data.position}
              onClick={onClickClue}
              data-target-class={`cell-orientation-${data.orientation} cell-position-${data.position}`}
              data-orientation={data.orientation}
            >
              {`${data.position}. ${data.clue}`}
            </p>
          ))}
        </div>
        <div className="down">
          <h2>Menurun</h2>
          {puzzleData.filter(data => data.orientation === 'down').map(data => (
            <p
              key={data.position}
              onClick={onClickClue}
              data-target-class={`cell-orientation-${data.orientation} cell-position-${data.position}`}
              data-orientation={data.orientation}
            >
              {`${data.position}. ${data.clue}`}
            </p>
          ))}
        </div>
      </div>
      
      <div className="tts-table">
        <table>
          <tbody>
            {Array.from(Array(totalRows).keys()).map(row => (
              <tr key={row}>
                {Array.from(Array(totalCols).keys()).map(col => {
                  const coord = `${col+1},${row+1}`
                  const data = getDataFromEntry(convertedEntries, coord)
                  const hasInput = convertedEntries.some(convertedEntry => convertedEntry.coord === coord)
                  const hasNumber = firstValues.some(firstValue => firstValue.coord === coord)
                  const number = firstValues.find(firstValue => firstValue.coord === coord)?.position

                  return (
                    <TD
                      cellOrientation={cellOrientation}
                      col={col+1}
                      data={data}
                      hasInput={hasInput}
                      hasNumber={hasNumber}
                      key={coord}
                      number={number}
                      onClick={onClickCell}
                      onClickOutside={onClickOutsideCell}
                      row={row+1}
                    />
                  )}
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TTSView
