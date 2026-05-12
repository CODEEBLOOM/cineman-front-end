export const getSeatRowLabel = (rowIndex) => String.fromCharCode(64 + rowIndex);

export const buildSeatLabel = (rowIndex, columnIndex) =>
  `${getSeatRowLabel(rowIndex)}${columnIndex}`;

export const toApiSeatPosition = ({ rowIndex, columnIndex }) => ({
  rowIndex,
  columnIndex,
});
