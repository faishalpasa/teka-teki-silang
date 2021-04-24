import React from 'react'

import { puzzleData } from '../constants/puzzleData'
import Cell from './Cell'
import './TTS.css'

function getDataFromEntry(entries, coordinate) {
  const data = {}
  const collections = entries.filter(entry => entry.coord === coordinate)
  if (collections.length > 0) {
    data.coord = collections[0].coord
    data.word = collections[0].word
    data.position = {
      ...collections[0].position && { firstPosition: `${collections[0].position}-${`${collections[0].orientation}`}` },
      ...collections[1]?.position && { secondPosition: `${collections[1].position}-${`${collections[1].orientation}`}` },
    }
    data.length = {
      ...collections[0].length && { firstLegth: collections[0].length },
      ...collections[1]?.length && { secondLength: collections[1].length },
    }
  }
  return data
}

function TTSView({
  activePosition,
  cellOrientation,
  cellHeight,
  convertedEntries,
  firstValues,
  onChangeCell,
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
              data-target-class={`cell-position-${data.position}-${data.orientation}`}
              data-orientation={data.orientation}
              data-position={`${data.position}-${data.orientation}`}
              className={activePosition === `${data.position}-${data.orientation}` ? 'active' : ''}
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
              data-target-class={`cell-position-${data.position}-${data.orientation}`}
              data-orientation={data.orientation}
              data-position={`${data.position}-${data.orientation}`}
              className={activePosition === `${data.position}-${data.orientation}` ? 'active' : ''}
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
                    <Cell
                      cellOrientation={cellOrientation}
                      cellHeight={cellHeight}
                      col={col+1}
                      data={data}
                      hasInput={hasInput}
                      hasNumber={hasNumber}
                      key={coord}
                      number={number}
                      onClick={onClickCell}
                      onClickOutside={onClickOutsideCell}
                      onChange={onChangeCell}
                      row={row+1}
                      totalRows={totalRows}
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
