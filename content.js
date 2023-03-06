const rgbaToHex = (rgba) => {
  // Check if the input is a valid RGBA color code
  const regex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(\.\d+)?)\)$/;
  const match = rgba.match(regex);

  if (!match) {
    throw new Error('Invalid RGBA color code');
  }

  // Extract the color values from the match
  const red = parseInt(match[1]);
  const green = parseInt(match[2]);
  const blue = parseInt(match[3]);
  const alpha = parseFloat(match[4]);

  // Convert RGBA values to hexadecimal
  const redHex = Math.round((red * alpha) + (255 * (1 - alpha))).toString(16).padStart(2, '0');
  const greenHex = Math.round((green * alpha) + (255 * (1 - alpha))).toString(16).padStart(2, '0');
  const blueHex = Math.round((blue * alpha) + (255 * (1 - alpha))).toString(16).padStart(2, '0');

  // Return the hexadecimal value
  return `#${redHex}${greenHex}${blueHex}`;
}

const getHexColorCodeFromRGB = (inputCode) => {
  let colorCode = inputCode;

  // Do not do anything if it is neither a rgb nor a rgba color code
  if (!colorCode.startsWith('rgb(') && !colorCode.startsWith('rgba(')) {
    return colorCode;
  }

  // Convert RGB color to RGBA color code
  if (colorCode.startsWith('rgb(')) {
    colorCode = colorCode.replace('rgb', 'rgba').replace(')', ',1)');
  }

  return rgbaToHex(colorCode);
}

const getMostUsedElems = () => {
  const DISCARDED_COLORS = ["#ffffff", "#000000"];
  const NUM_OF_RESPONSES = 3;

  const allElements = [...document.body.getElementsByTagName("*")];
  const allStyles = allElements.map(el => {
    const elem = window.getComputedStyle(el);
    return {
      fontColor: getHexColorCodeFromRGB(elem.color),
      fontFamily: elem.fontFamily,
      bgColor: getHexColorCodeFromRGB(elem.backgroundColor)
    }
  });

  const fontColorCounts = {};
  const fontFamilyCounts = {};
  const bgColorCounts = {};

  allStyles.forEach(({
    fontColor,
    fontFamily,
    bgColor
  }) => {
    if (!DISCARDED_COLORS.includes(fontColor)) {
      fontColorCounts[fontColor] = (fontColorCounts[fontColor] || 0) + 1;
    }
    if (!DISCARDED_COLORS.includes(bgColor)) {
      bgColorCounts[bgColor] = (bgColorCounts[bgColor] || 0) + 1;
    }
    fontFamilyCounts[fontFamily] = (fontFamilyCounts[fontFamily] || 0) + 1;
  });

  const sortedFontColors = Object.keys(fontColorCounts)
    .sort((a, b) => fontColorCounts[b] - fontColorCounts[a])
    .slice(0, NUM_OF_RESPONSES);

  const sortedBgColors = Object.keys(bgColorCounts)
    .sort((a, b) => bgColorCounts[b] - bgColorCounts[a])
    .slice(0, NUM_OF_RESPONSES);

  const sortedFontFamilies = Object.keys(fontFamilyCounts)
    .sort((a, b) => fontFamilyCounts[b] - fontFamilyCounts[a])
    .slice(0, NUM_OF_RESPONSES);

  // Directly respond to the sender (popup), 
  // through the specified callback.
  return {
    sortedFontColors,
    sortedBgColors,
    sortedFontFamilies
  };
}

getMostUsedElems();
