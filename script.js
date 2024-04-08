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
  let invalidLines = []; // 用于存储不符合格式的行

  lines.forEach((line, index) => {
    const parts = line.split('\t');
    if (parts.length === 2 && /^0x[a-fA-F0-9]{40}$/.test(parts[0])) {
      const amount = BigInt(parts[1]) * BigInt(10**18); // 将数量乘以10^18
      jsonResult.push({ recipient: parts[0], amount: amount.toString() }); // 使用BigInt处理大数
      addressCount[parts[0]] = (addressCount[parts[0]] || 0) + 1;
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
function convertToJSON() {
    const csvInput = document.getElementById('csvInput').value;
    const lines = csvInput.split('\n');
    const jsonResult = [];
    const addressCount = {};
    let validLines = 0;
    let invalidLines = []; // 用于存储不符合格式的行
  
    lines.forEach((line, index) => {
      const parts = line.split('\t');
      if (parts.length === 2 && /^0x[a-fA-F0-9]{40}$/.test(parts[0])) {
        const amountInWei = convertToWei(parts[1]);
        if (amountInWei !== null) {
          jsonResult.push({ recipient: parts[0], amount: amountInWei });
          addressCount[parts[0]] = (addressCount[parts[0]] || 0) + 1;
          validLines++;
        } else {
          invalidLines.push(`Line ${index + 1}: ${line} (Invalid amount)`);
        }
      } else if (line.trim() !== '') {
        invalidLines.push(`Line ${index + 1}: ${line} (Invalid format)`);
      }
    });
  
    if (invalidLines.length > 0) {
      alert(`The following lines do not match the expected format or contain invalid amounts:\n${invalidLines.join('\n')}`);
      return;
    }
  
    document.getElementById('output').innerText = JSON.stringify(jsonResult, null, 2);
    displayStatistics(validLines, addressCount);
  }
  
  function convertToWei(amount) {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        return null; // 如果输入不是数字，返回null
      }
      const amountInWei = BigInt(Math.floor(parsedAmount * 1e18)); // 转换为BigInt
      return amountInWei.toString(); // 返回字符串表示的大整数
    } catch (error) {
      console.error("Conversion error:", error);
      return null; // 转换失败返回null
    }
  }
  
  function displayStatistics(validLines, addressCount) {
    const uniqueAddresses = Object.keys(addressCount).length;
    let statsText = `Total valid lines processed: ${validLines}\n`;
    statsText += `Unique addresses: ${uniqueAddresses}\nAddresses and their token counts:\n`;
    for (const address in addressCount) {
      statsText += `${address}: ${addressCount[address]}\n`;
    }
    document.getElementById('statistics').textContent = statsText;
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
