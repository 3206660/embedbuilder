/**
 * Preview functionality
 */
function updatePreview() {
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
  
  // Update preview elements
  const previewPill = document.getElementById('previewPill');
  const previewContent = document.getElementById('previewContent');
  const previewAuthor = document.getElementById('previewAuthor');
  const previewTitle = document.getElementById('previewTitle');
  const previewDescription = document.getElementById('previewDescription');
  const previewFields = document.getElementById('previewFields');
  const previewImage = document.getElementById('previewImage');
  const previewThumbnail = document.getElementById('previewThumbnail');
  const previewFooter = document.getElementById('previewFooter');
  const previewButtons = document.getElementById('previewButtons');
  
  // Set color
  previewPill.style.backgroundColor = color;
  
  // Set content
  previewContent.innerHTML = formatDiscordText(content);
  previewContent.style.display = content ? 'block' : 'none';
  
  // Set author
  if (authorName) {
    let authorHTML = '';
    
    if (authorIcon) {
      authorHTML += `<img src="${authorIcon}" class="author-icon" alt="Author Icon">`;
    }
    
    if (authorUrl) {
      authorHTML += `<a href="${authorUrl}" target="_blank">${escapeHTML(authorName)}</a>`;
    } else {
      authorHTML += escapeHTML(authorName);
    }
    
    previewAuthor.innerHTML = authorHTML;
    previewAuthor.style.display = 'flex';
  } else {
    previewAuthor.innerHTML = '';
    previewAuthor.style.display = 'none';
  }
  
  // Set title
  if (title) {
    if (url) {
      previewTitle.innerHTML = `<a href="${url}" target="_blank">${escapeHTML(title)}</a>`;
    } else {
      previewTitle.innerHTML = escapeHTML(title);
    }
    previewTitle.style.display = 'block';
  } else {
    previewTitle.innerHTML = '';
    previewTitle.style.display = 'none';
  }
  
  // Set description
  if (description) {
    previewDescription.innerHTML = formatDiscordText(description);
    previewDescription.style.display = 'block';
  } else {
    previewDescription.innerHTML = '';
    previewDescription.style.display = 'none';
  }
  
  // Set fields
  if (fields.length > 0) {
    let fieldsHTML = '';
    
    fields.forEach(field => {
      if (field.name || field.value) {
        fieldsHTML += `
          <div class="embed-field ${field.inline ? 'inline' : 'non-inline'}">
            ${field.name ? `<div class="field-name">${escapeHTML(field.name)}</div>` : ''}
            ${field.value ? `<div class="field-value">${formatDiscordText(field.value)}</div>` : ''}
          </div>
        `;
      }
    });
    
    previewFields.innerHTML = fieldsHTML;
    previewFields.style.display = fieldsHTML ? 'grid' : 'none';
  } else {
    previewFields.innerHTML = '';
    previewFields.style.display = 'none';
  }
  
  // Set image
  if (image) {
    previewImage.innerHTML = `<img src="${image}" alt="Embed Image">`;
    previewImage.style.display = 'block';
  } else {
    previewImage.innerHTML = '';
    previewImage.style.display = 'none';
  }
  
  // Set thumbnail
  if (thumbnail) {
    previewThumbnail.innerHTML = `<img src="${thumbnail}" alt="Embed Thumbnail">`;
    previewThumbnail.style.display = 'block';
  } else {
    previewThumbnail.innerHTML = '';
    previewThumbnail.style.display = 'none';
  }
  
  // Set footer
  if (footerText || timestampEnabled) {
    let footerHTML = '';
    
    if (footerIcon) {
      footerHTML += `<img src="${footerIcon}" class="footer-icon" alt="Footer Icon">`;
    }
    
    if (footerText) {
      footerHTML += `<span>${escapeHTML(footerText)}</span>`;
    }
    
    if (timestampEnabled) {
      const now = new Date().toLocaleString();
      footerHTML += footerText ? ` • ${now}` : now;
    }
    
    previewFooter.innerHTML = footerHTML;
    previewFooter.style.display = 'flex';
  } else {
    previewFooter.innerHTML = '';
    previewFooter.style.display = 'none';
  }
  
  // Set buttons
  if (buttons.length > 0) {
    let buttonsHTML = '';
    
    buttons.forEach(button => {
      if (button.label) {
        const buttonType = button.type || 'link';
        const buttonValue = button.value || '';
        const buttonEmoji = buttonType !== 'link' ? buttonValue : '';
        
        buttonsHTML += `
          <div class="discord-button ${buttonType}">
            ${buttonEmoji ? `<span class="button-emoji">${buttonEmoji}</span>` : ''}
            <span class="button-label">${escapeHTML(button.label)}</span>
          </div>
        `;
      }
    });
    
    previewButtons.innerHTML = buttonsHTML;
    previewButtons.style.display = buttonsHTML ? 'flex' : 'none';
  } else {
    previewButtons.innerHTML = '';
    previewButtons.style.display = 'none';
  }
}

// Initialize preview
document.addEventListener('DOMContentLoaded', () => {
  const timestampEnabled = document.getElementById('timestampEnabled');
  timestampEnabled.addEventListener('change', updatePreview);
  updatePreview();
});