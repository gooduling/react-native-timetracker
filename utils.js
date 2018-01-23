export const createFalseArray = (length) => new Array(length).fill(false);
export const formatTime = (total) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total - (h * 3600))/ 60);
  const s = total - h * 3600 - m * 60;
  return `${h ? ('0' + h).slice(-2) + ' : ' : ''}${('0' + m).slice(-2)} : ${('0' + s).slice(-2)}`
};
export const getRandomKey = function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
export const colorPalette = [
  '#F44336','#2196F3', '#4CAF50', '#FFEB3B',
  "#6e6cb5", "#3c6e71", "#edd9c0", "#7fa36b",
];

export const getColor = (i) => {
  const l = colorPalette.length;
  return colorPalette[i % l];
};