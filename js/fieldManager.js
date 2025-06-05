/**
 * Field management functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const addFieldButton = document.getElementById('addField');
  const fieldsContainer = document.getElementById('fieldsContainer');
  
  // Add a new field
  addFieldButton.addEventListener('click', () => {
    addField();
  });
  
  // Add a field with optional data
  function addField(data = {}) {
    const fieldId = generateId();
    const fieldItem = document.createElement('div');
    fieldItem.className = 'field-item';
    fieldItem.dataset.id = fieldId;
    
    fieldItem.innerHTML = `
      <div class="field-header">
        <span class="field-title">Field</span>
        <button type="button" class="remove-button" data-id="${fieldId}">×</button>
      </div>
      <div class="form-group">
        <label for="field-name-${fieldId}">Name</label>
        <input type="text" id="field-name-${fieldId}" class="field-name" placeholder="Field name" value="${data.name || ''}">
      </div>
      <div class="form-group">
        <label for="field-value-${fieldId}">Value</label>
        <textarea id="field-value-${fieldId}" class="field-value" placeholder="Field value">${data.value || ''}</textarea>
      </div>
      <div class="inline-checkbox">
        <input type="checkbox" id="field-inline-${fieldId}" class="field-inline" ${data.inline ? 'checked' : ''}>
        <label for="field-inline-${fieldId}">Inline</label>
      </div>
    `;
    
    fieldsContainer.appendChild(fieldItem);
    
    // Set up event listener for remove button
    fieldItem.querySelector('.remove-button').addEventListener('click', (e) => {
      const fieldId = e.target.getAttribute('data-id');
      const fieldItem = document.querySelector(`.field-item[data-id="${fieldId}"]`);
      fieldItem.remove();
      updatePreview();
    });
    
    // Set up event listeners for field inputs
    const nameInput = fieldItem.querySelector('.field-name');
    const valueInput = fieldItem.querySelector('.field-value');
    const inlineCheckbox = fieldItem.querySelector('.field-inline');
    
    [nameInput, valueInput, inlineCheckbox].forEach(input => {
      input.addEventListener('input', updatePreview);
    });
    
    updatePreview();
    return fieldId;
  }
  
  // Get all fields
  function getFields() {
    const fields = [];
    const fieldItems = document.querySelectorAll('.field-item');
    
    fieldItems.forEach(item => {
      const fieldId = item.dataset.id;
      const name = item.querySelector(`.field-name`).value;
      const value = item.querySelector(`.field-value`).value;
      const inline = item.querySelector(`.field-inline`).checked;
      
      fields.push({
        id: fieldId,
        name,
        value,
        inline
      });
    });
    
    return fields;
  }
  
  // Clear all fields
  function clearFields() {
    fieldsContainer.innerHTML = '';
  }
  
  // Expose functions to window
  window.fieldManager = {
    addField,
    getFields,
    clearFields
  };
});