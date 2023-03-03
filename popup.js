const NUM_OF_RESPONSES = 3;

const getCurrentTab = async () => {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const injectContentScript = async (tab) => {
  try {
    const { id } = tab;
    const scriptResult = await chrome.scripting.executeScript(
      {
        target: { tabId: id },
        files: ['content.js']
      }
    );
    return scriptResult[0].result;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}

// Update the relevant fields with the new data.
const setDOMInfo = (result) => {
  for (let i = 1; i <= NUM_OF_RESPONSES; i++) {
    // Background Colors
    document.getElementById(`row-1-col-${i}-square`).style.backgroundColor = result.sortedBgColors[i - 1] || '-';
    document.getElementById(`row-1-col-${i}-text`).textContent = result.sortedBgColors[i - 1] || '-';
    // Font Colors
    document.getElementById(`row-2-col-${i}-square`).style.backgroundColor = result.sortedFontColors[i - 1] || '-';
    document.getElementById(`row-2-col-${i}-text`).textContent = result.sortedFontColors[i - 1] || '-';
    // Font Families
    document.getElementById(`row-3-col-${i}-text`).textContent = result.sortedFontFamilies[i - 1] || '-';
  }
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // Query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, async (tabs) => {
    const scriptResult = await injectContentScript(tabs[0]);
    if (scriptResult) {
      setDOMInfo(scriptResult);
    }
  });
});

