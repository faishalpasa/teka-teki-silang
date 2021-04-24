import React from 'react'

import useOutsideClick from '../../hooks/useOutsideClick'
import CellView from './CellView'

function CellContainer({
  cellOrientation,
  col,
  data,
  hasInput,
  hasNumber,
  number,
  onChange,
  onClick,
  onClickOutside,
  row,
  ...otherProps
}) {
  let classNamePosition = ''
  if (data.position?.secondPosition) {
    classNamePosition = `cell-position-${data.position.firstPosition} cell-position-${data.position.secondPosition}`
  } else if (data.position?.firstPosition) {
    classNamePosition = `cell-position-${data.position.firstPosition}`
  }
  
  const cellRef = React.useRef(null)
  const className = `${classNamePosition} cell-row-${row} cell-col-${col}`
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
    onChange(e)
  }

  const props = {
    hasInput,
    hasNumber,
    cellRef,
    className,
    coord: data.coord,
    firstPosition: data.position?.firstPosition,
    secondPosition: data.position?.secondPosition,
    col,
    row,
    number,
    onKeyUp,
    onClick,
    ...otherProps,
  }

  return(
    <CellView {...props} />
  )
}

export default CellContainer
