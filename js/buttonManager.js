/**
 * Button management functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const addButtonBtn = document.getElementById('addButton');
  const buttonsContainer = document.getElementById('buttonsContainer');
  
  // Button types and their colors
  const buttonTypes = [
    { value: 'link', label: 'Link', color: '#4f545c' },
    { value: 'blue', label: 'Blue', color: '#5865F2' },
    { value: 'green', label: 'Green', color: '#57F287' },
    { value: 'red', label: 'Red', color: '#ED4245' },
    { value: 'gray', label: 'Gray', color: '#4f545c' }
  ];
  
  // Add a new button
  addButtonBtn.addEventListener('click', () => {
    addButton();
  });
  
  // Create button type selector HTML
  function createButtonTypeSelector(buttonId, selectedType = 'link') {
    let html = '<div class="button-type-selector">';
    
    buttonTypes.forEach(type => {
      const isActive = type.value === selectedType ? 'active' : '';
      html += `<div class="button-type ${isActive}" data-type="${type.value}" data-button-id="${buttonId}">${type.label}</div>`;
    });
    
    html += '</div>';
    return html;
  }
  
  // Add a button with optional data
  function addButton(data = {}) {
    const buttonId = generateId();
    const buttonType = data.type || 'link';
    const buttonItem = document.createElement('div');
    buttonItem.className = 'button-item';
    buttonItem.dataset.id = buttonId;
    buttonItem.dataset.type = buttonType;
    
    buttonItem.innerHTML = `
      <div class="button-header">
        <span class="button-title">Button</span>
        <button type="button" class="remove-button" data-id="${buttonId}">×</button>
      </div>
      ${createButtonTypeSelector(buttonId, buttonType)}
      <div class="form-group">
        <label for="button-label-${buttonId}">Label</label>
        <input type="text" id="button-label-${buttonId}" class="button-label" placeholder="Button label" value="${data.label || ''}">
      </div>
      <div class="form-group ${buttonType === 'link' ? '' : 'emoji-input'}">
        <label for="button-value-${buttonId}">${buttonType === 'link' ? 'URL' : 'Emoji'}</label>
        <input type="text" id="button-value-${buttonId}" class="button-value" placeholder="${buttonType === 'link' ? 'https://example.com' : '👍'}" value="${data.value || ''}">
      </div>
    `;
    
    buttonsContainer.appendChild(buttonItem);
    
    // Set up event listener for remove button
    buttonItem.querySelector('.remove-button').addEventListener('click', (e) => {
      const buttonId = e.target.getAttribute('data-id');
      const buttonItem = document.querySelector(`.button-item[data-id="${buttonId}"]`);
      buttonItem.remove();
      updatePreview();
    });
    
    // Set up event listeners for button inputs
    const labelInput = buttonItem.querySelector('.button-label');
    const valueInput = buttonItem.querySelector('.button-value');
    
    [labelInput, valueInput].forEach(input => {
      input.addEventListener('input', updatePreview);
    });
    
    // Set up event listeners for button type selector
    const typeButtons = buttonItem.querySelectorAll('.button-type');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const buttonId = e.target.getAttribute('data-button-id');
        const buttonType = e.target.getAttribute('data-type');
        const buttonItem = document.querySelector(`.button-item[data-id="${buttonId}"]`);
        
        // Update button type
        buttonItem.dataset.type = buttonType;
        
        // Update active state
        typeButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update value label
        const valueLabel = buttonItem.querySelector('.button-value').previousElementSibling;
        valueLabel.textContent = buttonType === 'link' ? 'URL' : 'Emoji';
        
        // Update placeholder
        const valueInput = buttonItem.querySelector('.button-value');
        valueInput.placeholder = buttonType === 'link' ? 'https://example.com' : '👍';
        
        // Toggle emoji input class
        const formGroup = valueInput.parentElement;
        if (buttonType === 'link') {
          formGroup.classList.remove('emoji-input');
        } else {
          formGroup.classList.add('emoji-input');
        }
        
        updatePreview();
      });
    });
    
    updatePreview();
    return buttonId;
  }
  
  // Get all buttons
  function getButtons() {
    const buttons = [];
    const buttonItems = document.querySelectorAll('.button-item');
    
    buttonItems.forEach(item => {
      const buttonId = item.dataset.id;
      const type = item.dataset.type;
      const label = item.querySelector(`.button-label`).value;
      const value = item.querySelector(`.button-value`).value;
      
      buttons.push({
        id: buttonId,
        type,
        label,
        value
      });
    });
    
    return buttons;
  }
  
  // Clear all buttons
  function clearButtons() {
    buttonsContainer.innerHTML = '';
  }
  
  // Expose functions to window
  window.buttonManager = {
    addButton,
    getButtons,
    clearButtons
  };
});