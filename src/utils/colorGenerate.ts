export const generateHexColors = (numColors: number): string[] => {
  return Array.from({ length: numColors }, () => generateRandomHexColor());
}

function generateRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}