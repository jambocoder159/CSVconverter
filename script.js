let currentTokenType = 'ERC721';

function changeTokenType(tokenType) {
  currentTokenType = tokenType;
}

function convertToJSON() {
  const csvInput = document.getElementById('csvInput').value;
  const lines = csvInput.split('\n');
  const jsonResult = [];
  const addressCount = {};
  let validLines = 0;
  let invalidLines = [];

  lines.forEach((line, index) => {
    const parts = line.split('\t');
    if (currentTokenType === 'ERC721' && parts.length === 2 && /^0x[a-fA-F0-9]{40}$/.test(parts[0]) && !isNaN(parts[1])) {
      jsonResult.push({ recipient: parts[0], tokenId: parseInt(parts[1], 10) });
      addressCount[parts[0]] = (addressCount[parts[0]] || 0) + 1;
      validLines++;
    } else if (currentTokenType === 'ERC20' && parts.length === 2 && /^0x[a-fA-F0-9]{40}$/.test(parts[0]) && !isNaN(parts[1])) {
      jsonResult.push({ recipient: parts[0], amount: parts[1] });
      addressCount[parts[0]] = (addressCount[parts[0]] || 0) + parseFloat(parts[1]);
      validLines++;
    } else if (line.trim() !== '') {
      invalidLines.push(`Line ${index + 1}: ${line}`);
    }
  });

  if (invalidLines.length > 0) {
    alert(`The following lines do not match the expected format:\n${invalidLines.join('\n')}`);
    return;
  }

  document.getElementById('output').innerText = JSON.stringify(jsonResult, null, 2);
  displayStatistics(validLines, addressCount);
}

function displayStatistics(validLines, addressCount) {
  const uniqueAddresses = Object.keys(addressCount).length;
  let statsText = `Total lines: ${validLines}\n`;
  statsText += `Unique recipients: ${uniqueAddresses}\nRecipient Counts:\n`;
  for (const address in addressCount) {
    const countOrSum = currentTokenType === 'ERC721' ? addressCount[address] : addressCount[address].toFixed(2);
    statsText += `${address}: ${countOrSum}\n`;
  }
  document.getElementById('statistics').textContent = statsText;
}

function copyToClipboard() {
  const outputText = document.getElementById('output').textContent;
  navigator.clipboard.writeText(outputText).then(() => {
    alert('Copied to clipboard');
  }, (err) => {
    alert('Error in copying text: ', err);
  });
}

function openTab(evt, cityName) {
  var tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Default to open the first tab
document.addEventListener('DOMContentLoaded', function() {
    document.getElementsByClassName('tablinks')[0].click();
});
