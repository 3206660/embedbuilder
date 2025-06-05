/**
 * Embed generator functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const importBtn = document.getElementById('importBtn');
  const codeOutput = document.getElementById('codeOutput');
  const importModal = document.getElementById('importModal');
  const importCode = document.getElementById('importCode');
  const confirmImport = document.getElementById('confirmImport');
  const closeModal = document.querySelector('.close-modal');
  
  // Generate embed syntax
  generateBtn.addEventListener('click', () => {
    const embedCode = generateEmbedCode();
    codeOutput.textContent = embedCode;
  });
  
  // Copy embed syntax
  copyBtn.addEventListener('click', () => {
    const code = codeOutput.textContent;
    if (code) {
      copyToClipboard(code);
    } else {
      showNotification('Generate embed code first', 'error');
    }
  });
  
  // Open import modal
  importBtn.addEventListener('click', () => {
    importModal.style.display = 'block';
  });
  
  // Close modal
  closeModal.addEventListener('click', () => {
    importModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === importModal) {
      importModal.style.display = 'none';
    }
  });
  
  // Import embed code
  confirmImport.addEventListener('click', () => {
    const code = importCode.value;
    if (code) {
      importEmbedCode(code);
      importModal.style.display = 'none';
      importCode.value = '';
    } else {
      showNotification('Please enter embed code', 'error');
    }
  });
  
  // Generate embed code based on form values
  function generateEmbedCode() {
    let code = '{embed}';
    
    // Get form values
    const color = document.getElementById('color').value;
    const content = document.getElementById('content').value;
    const authorName = document.getElementById('authorName').value;
    const authorIcon = document.getElementById('authorIcon').value;
    const authorUrl = document.getElementById('authorUrl').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const description = document.getElementById('description').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const image = document.getElementById('image').value;
    const footerText = document.getElementById('footerText').value;
    const footerIcon = document.getElementById('footerIcon').value;
    
    const timestampEnabled = document.getElementById('timestampEnabled').checked;
    
    // Get fields and buttons
    const fields = window.fieldManager ? window.fieldManager.getFields() : [];
    const buttons = window.buttonManager ? window.buttonManager.getButtons() : [];
    
    // Add content
    if (content) {
      code += `$v{content: ${content}}`;
    }
    
    // Add color
    if (color) {
      code += `$v{color: ${color}}`;
    }
    
    // Add title
    if (title) {
      code += `$v{title: ${title}}`;
    }
    
    // Add URL
    if (url) {
      code += `$v{url: ${url}}`;
    }
    
    // Add description
    if (description) {
      code += `$v{description: ${description}}`;
    }
    
    // Add author
    if (authorName) {
      let authorCode = '{author: ';
      
      authorCode += `name: ${authorName}`;
      
      if (authorIcon) {
        authorCode += ` && icon: ${authorIcon}`;
      }
      
      if (authorUrl) {
        authorCode += ` && url: ${authorUrl}`;
      }
      
      authorCode += '}';
      code += `$v${authorCode}`;
    }
    
    // Add thumbnail
    if (thumbnail) {
      code += `$v{thumbnail: ${thumbnail}}`;
    }
    
    // Add image
    if (image) {
      code += `$v{image: ${image}}`;
    }
    
    // Add fields
    fields.forEach(field => {
      if (field.name || field.value) {
        let fieldCode = '{field: ';
        
        if (field.name) {
          fieldCode += `name: ${field.name}`;
        }
        
        if (field.value) {
          fieldCode += field.name ? ` && value: ${field.value}` : `value: ${field.value}`;
        }
        
        if (field.inline) {
          fieldCode += ' && inline';
        }
        
        fieldCode += '}';
        code += `$v${fieldCode}`;
      }
    });
    
    // Add footer
    if (footerText) {
      let footerCode = '{footer: ';
      
      footerCode += `text: ${footerText}`;
      
      if (footerIcon) {
        footerCode += ` && icon: ${footerIcon}`;
      }
      
      footerCode += '}';
      code += `$v${footerCode}`;
    }
    
    // Add timestamp
    if (timestampEnabled) {
      code += `$v{timestamp}`;
    }
    
    // Add buttons
    buttons.forEach(button => {
      if (button.label) {
        let buttonCode = '{button: ';
        
        buttonCode += button.type || 'link';
        buttonCode += ` && ${button.label}`;
        
        if (button.value) {
          buttonCode += ` && ${button.value}`;
        }
        
        buttonCode += '}';
        code += `$v${buttonCode}`;
      }
    });
    
    return code;
  }
  
  // Import embed code
  function importEmbedCode(code) {
    try {
      // Reset form
      resetForm();
      
      // Parse embed code
      const parts = code.split('$v');
      
      // Check if valid embed code
      if (!parts[0].includes('{embed}')) {
        throw new Error('Invalid embed code');
      }
      
      // Process each part
      parts.forEach(part => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const cleanPart = part.substring(1, part.length - 1);
          const colonIndex = cleanPart.indexOf(':');
          
          if (colonIndex > 0) {
            const key = cleanPart.substring(0, colonIndex).trim();
            const value = cleanPart.substring(colonIndex + 1).trim();
            
            processEmbedPart(key, value);
          }
        }
      });
      
      // Update preview
      updatePreview();
      
      // Generate code
      generateBtn.click();
      
      showNotification('Embed code imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Invalid embed code format', 'error');
    }
  }
  
  // Process embed part
  function processEmbedPart(key, value) {
    switch (key) {
      case 'embed':
        // No need to do anything for the embed marker
        break;
      
      case 'content':
        document.getElementById('content').value = value;
        break;
      
      case 'color':
        document.getElementById('color').value = value;
        break;
      
      case 'title':
        document.getElementById('title').value = value;
        break;
      
      case 'url':
        document.getElementById('url').value = value;
        break;
      
      case 'description':
        document.getElementById('description').value = value;
        break;
      
      case 'thumbnail':
        document.getElementById('thumbnail').value = value;
        break;
      
      case 'image':
        document.getElementById('image').value = value;
        break;
      
      case 'author':
        processComplexField('author', value);
        break;
      
      case 'field':
        processComplexField('field', value);
        break;
      
      case 'footer':
        processComplexField('footer', value);
        break;
      
      case 'button':
        processComplexField('button', value);
        break;
      
      case 'timestamp':
        const timestampEnabled = document.getElementById('timestampEnabled');
        timestampEnabled.checked = true;
        break;
    }
  }
  
  // Process complex fields (author, field, footer, button)
  function processComplexField(type, value) {
    const parts = value.split('&&').map(part => part.trim());
    
    switch (type) {
      case 'author':
        let authorName = '';
        let authorIcon = '';
        let authorUrl = '';
        
        parts.forEach(part => {
          if (part.startsWith('name:')) {
            authorName = part.substring(5).trim();
          } else if (part.startsWith('icon:')) {
            authorIcon = part.substring(5).trim();
          } else if (part.startsWith('url:')) {
            authorUrl = part.substring(4).trim();
          }
        });
        
        document.getElementById('authorName').value = authorName;
        document.getElementById('authorIcon').value = authorIcon;
        document.getElementById('authorUrl').value = authorUrl;
        break;
      
      case 'field':
        let fieldName = '';
        let fieldValue = '';
        let fieldInline = false;
        
        parts.forEach(part => {
          if (part.startsWith('name:')) {
            fieldName = part.substring(5).trim();
          } else if (part.startsWith('value:')) {
            fieldValue = part.substring(6).trim();
          } else if (part === 'inline') {
            fieldInline = true;
          }
        });
        
        window.fieldManager.addField({
          name: fieldName,
          value: fieldValue,
          inline: fieldInline
        });
        break;
      
      case 'footer':
        let footerText = '';
        let footerIcon = '';
        
        parts.forEach(part => {
          if (part.startsWith('text:')) {
            footerText = part.substring(5).trim();
          } else if (part.startsWith('icon:')) {
            footerIcon = part.substring(5).trim();
          }
        });
        
        document.getElementById('footerText').value = footerText;
        document.getElementById('footerIcon').value = footerIcon;
        break;
      
      case 'button':
        if (parts.length >= 2) {
          const buttonType = parts[0];
          const buttonLabel = parts[1];
          const buttonValue = parts.length > 2 ? parts[2] : '';
          
          window.buttonManager.addButton({
            type: buttonType,
            label: buttonLabel,
            value: buttonValue
          });
        }
        break;
    }
  }
  
  // Reset form
  function resetForm() {
    document.getElementById('embedForm').reset();
    
    // Reset color to default
    document.getElementById('color').value = '#5865F2';
    
    // Clear fields and buttons
    window.fieldManager.clearFields();
    window.buttonManager.clearButtons();
    
    // Update color presets
    document.querySelectorAll('.color-preset').forEach(preset => {
      preset.classList.remove('active');
      if (preset.getAttribute('data-color') === '#5865F2') {
        preset.classList.add('active');
      }
    });
  }
});