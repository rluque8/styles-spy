const getMostUsedElems = () => {
  const DISCARDED_COLORS = ["rgb(0, 0, 0)", "rgba(0, 0, 0, 0)", "rgb(255, 255, 255)", "rgba(255, 255, 255, 0)"];
  const NUM_OF_RESPONSES = 3;

  const allElements = [...document.body.getElementsByTagName("*")];
  const allStyles = allElements.map(el => {
    const elem = window.getComputedStyle(el);
    return {
      fontColor: elem.color,
      fontFamily: elem.fontFamily,
      bgColor: elem.backgroundColor
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
