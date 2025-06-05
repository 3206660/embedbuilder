/**
 * Main application script
 */
document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to all form inputs
  const formInputs = document.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  // Initialize color picker
  const colorInput = document.getElementById('color');
  colorInput.addEventListener('input', updatePreview);
  
  // Initialize timestamp checkbox
  const timestampEnabled = document.getElementById('timestampEnabled');
  const timestamp = document.getElementById('timestamp');
  
  timestampEnabled.addEventListener('change', () => {
    timestamp.disabled = !timestampEnabled.checked;
    updatePreview();
  });
  
  // Initialize everything
  updatePreview();
  
  // Create CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background-color: var(--accent-color);
      color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      z-index: 1000;
    }
    
    .notification.error {
      background-color: var(--red);
    }
    
    .notification.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
  
  // Add animation to embed preview on hover
  const embedPreview = document.querySelector('.embed-preview-container');
  embedPreview.addEventListener('mouseenter', () => {
    const embed = embedPreview.querySelector('.embed');
    embed.style.transform = 'scale(1.02)';
    embed.style.transition = 'transform 0.3s ease';
  });
  
  embedPreview.addEventListener('mouseleave', () => {
    const embed = embedPreview.querySelector('.embed');
    embed.style.transform = 'scale(1)';
  });
});