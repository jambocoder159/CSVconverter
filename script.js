function convertToJSON() {
    const csvInput = document.getElementById('csvInput').value;
    const tokenType = document.getElementById('tokenTypeSelect').value;
    const lines = csvInput.split('\n');
    const jsonResult = [];
    const addressCount = {};
    let validLines = 0;
    let invalidLines = [];
    const tokenIdSet = new Set(); // 用于存储已经遇到的tokenId，确保ERC721的tokenId唯一性
  
    lines.forEach((line, index) => {
      const parts = line.split('\t');
      if (parts.length === 2 && /^0x[a-fA-F0-9]{40}$/.test(parts[0])) {
        if (tokenType === 'ERC20') {
          const amountInWei = convertToWei(parts[1]);
          if (amountInWei !== null) {
            jsonResult.push({ recipient: parts[0], amount: amountInWei });
            addressCount[parts[0]] = (addressCount[parts[0]] || 0) + 1;
            validLines++;
          } else {
            invalidLines.push(`Line ${index + 1}: ${line} (Invalid amount)`);
          }
        } else if (tokenType === 'ERC721') {
          const tokenId = parseInt(parts[1], 10);
          if (!isNaN(tokenId) && tokenId.toString() === parts[1]) {
            // 检查tokenId是否唯一
            if (tokenIdSet.has(tokenId)) {
              invalidLines.push(`Line ${index + 1}: ${line} (Duplicate tokenId)`);
            } else {
              tokenIdSet.add(tokenId);
              jsonResult.push({ recipient: parts[0], tokenId: tokenId });
              addressCount[parts[0]] = (addressCount[parts[0]] || 0) + 1;
              validLines++;
            }
          } else {
            invalidLines.push(`Line ${index + 1}: ${line} (Invalid token ID)`);
          }
        }
      } else {
        invalidLines.push(`Line ${index + 1}: ${line} (Invalid format)`);
      }
    });
  
    if (invalidLines.length > 0) {
      alert(`The following lines do not match the expected format or contain invalid amounts/token IDs:\n${invalidLines.join('\n')}`);
      return;
    }
  
    document.getElementById('output').innerText = JSON.stringify(jsonResult, null, 2);
    displayStatistics(validLines, addressCount);
  }
  
  
  function convertToWei(amount) {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        return null;
      }
      const amountInWei = BigInt(Math.floor(parsedAmount * 1e18));
      return amountInWei.toString();
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  }
  
  function displayStatistics(validLines, addressCount) {
    const uniqueAddresses = Object.keys(addressCount).length;
    let statsText = `Total valid lines processed: ${validLines}\n`;
    statsText += `Unique addresses: ${uniqueAddresses}\nAddresses and their token counts/token IDs:\n`;
    for (const address in addressCount) {
      statsText += `${address}: ${addressCount[address]}\n`;
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
  