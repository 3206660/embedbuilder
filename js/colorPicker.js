/**
 * Color picker functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const colorInput = document.getElementById('color');
  const colorTextInput = document.getElementById('colorInput');
  
  // Update color text input when color picker changes
  colorInput.addEventListener('input', () => {
    colorTextInput.value = colorInput.value.toUpperCase();
    updatePreview();
  });
  
  // Update color picker when text input changes
  colorTextInput.addEventListener('input', () => {
    const value = colorTextInput.value;
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      colorInput.value = value;
      updatePreview();
    }
  });
  
  // Format color text input on blur
  colorTextInput.addEventListener('blur', () => {
    let value = colorTextInput.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      colorTextInput.value = value.toUpperCase();
    } else {
      colorTextInput.value = colorInput.value.toUpperCase();
    }
  });
});