import React from 'react'

function CellView({
  hasInput,
  hasNumber,
  cellRef,
  className,
  cellHeight,
  coord,
  firstPosition,
  secondPosition,
  col,
  row,
  number,
  onKeyUp,
  onClick,
}) {
  return(
    <td>
      <div style={{ height: cellHeight }}>
        {hasInput && (
          <input
            autoComplete="off"
            ref={cellRef}
            className={className}
            id={coord}
            maxLength={1}
            onKeyUp={onKeyUp}
            onClick={onClick}
            data-first-position={firstPosition}
            data-second-position={secondPosition}
            data-col={col}
            data-row={row}
          />
        )}
        {hasNumber && (
          <span>{number}</span>
        )}
      </div>
    </td>
  )
}

export default CellView
