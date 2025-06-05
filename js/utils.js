function parseVariables(text) {
  if (!text) return '';


  const variables = {
    '{user}': 'User',
    '{user.mention}': '@User',
    '{user.name}': 'User',
    '{user.id}': '123456789012345678',
    '{guild.name}': 'Server',
    '{guild.membercount}': '1,234',
    '{channel.name}': 'general',
    '{channel.mention}': '#general'
  };

  let parsedText = text;

  // Replace all variables in the text
  Object.keys(variables).forEach(variable => {
    parsedText = parsedText.replace(new RegExp(variable, 'g'), variables[variable]);
  });

  return parsedText;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Simple Discord markdown formatter - preserves line breaks exactly as typed
function formatDiscordText(text) {
  if (!text) return '';

  // Parse variables first
  let formattedText = parseVariables(text);

  // Escape HTML for safety
  formattedText = escapeHTML(formattedText);

  // Process inline markdown only (no block-level changes)
  formattedText = processInlineMarkdown(formattedText);

  // Convert line breaks to <br> tags - this preserves exact spacing
  return formattedText.replace(/\n/g, '<br>');
}

// Simple Discord markdown parser that preserves line breaks properly
function parseDiscordMarkdown(text) {
  // Split into lines and process each line
  const lines = text.split('\n');
  const processedLines = [];

  for (let line of lines) {
    if (line.trim() === '') {
      // Empty line
      processedLines.push('');
    } else {
      // Process markdown on this line
      processedLines.push(processLineMarkdown(line));
    }
  }

  // Join with <br> tags, preserving empty lines
  return processedLines.map(line => line === '' ? '<br>' : line).join('<br>');
}

// Process markdown on a single line
function processLineMarkdown(line) {
  let processed = line;

  // Headers (must have space after #)
  if (line.match(/^# /)) {
    const content = line.substring(2);
    processed = `<span class="discord-header-1">${processInlineMarkdown(content)}</span>`;
  } else if (line.match(/^## /)) {
    const content = line.substring(3);
    processed = `<span class="discord-header-2">${processInlineMarkdown(content)}</span>`;
  } else if (line.match(/^### /)) {
    const content = line.substring(4);
    processed = `<span class="discord-header-3">${processInlineMarkdown(content)}</span>`;
  } else if (line.match(/^-# /)) {
    const content = line.substring(3);
    processed = `<span class="discord-header-4">${processInlineMarkdown(content)}</span>`;
  } else if (line.match(/^> /)) {
    const content = line.substring(2);
    processed = `<span class="discord-blockquote">${processInlineMarkdown(content)}</span>`;
  } else {
    // Regular text with inline markdown
    processed = processInlineMarkdown(line);
  }

  return processed;
}

// Proper markdown block parser following Discord's specification
function parseMarkdownBlocks(text) {
  const lines = text.split('\n');
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const trimmedLine = originalLine.trim();

    // Preserve empty lines for spacing - each empty line becomes a <br>
    if (trimmedLine === '') {
      processedLines.push('<br>');
      continue;
    }

    // Check if this line is already processed (code block)
    if (originalLine.includes('<div class="discord-code-block">') ||
        originalLine.includes('</code></pre></div>') ||
        originalLine.includes('<code class="language-')) {
      processedLines.push(originalLine);
      continue;
    }

    // Parse block-level elements using proper markdown rules
    const blockElement = parseBlockElement(trimmedLine);
    if (blockElement) {
      processedLines.push(blockElement);
    } else {
      // Handle regular text with inline markdown
      processedLines.push(processInlineMarkdown(trimmedLine));
    }
  }

  // Join lines with proper spacing using improved logic
  return joinProcessedLines(processedLines);
}

// Proper markdown block element parser following Discord's specification
function parseBlockElement(line) {
  // ATX Headers (Discord style) - must have space after # symbols
  const headerMatch = parseATXHeader(line);
  if (headerMatch) {
    return headerMatch;
  }

  // Blockquotes - must have space after >
  if (isBlockquote(line)) {
    return parseBlockquote(line);
  }

  // Lists - must have space after list markers
  const listMatch = parseListItem(line);
  if (listMatch) {
    return listMatch;
  }

  // Not a block element
  return null;
}

// Parse ATX headers following Discord's exact specification
function parseATXHeader(line) {
  // Discord ATX header rules:
  // 1. Line must start with 1-3 # characters (or -# for subheader)
  // 2. Must be followed by exactly one space
  // 3. Must have content after the space
  // 4. Leading/trailing whitespace is ignored for the line itself

  // Check for subheader pattern: -# followed by space
  if (line.startsWith('-# ') && line.length > 3) {
    const content = line.substring(3); // Remove "-# "
    if (content.trim().length > 0) {
      return `<h4 class="discord-header-4">${processInlineMarkdown(content)}</h4>`;
    }
  }
  // Check for header pattern: start of line, 1-3 #, exactly one space, then content
  else if (line.startsWith('# ') && line.length > 2) {
    const content = line.substring(2); // Remove "# "
    if (content.trim().length > 0) {
      return `<h1 class="discord-header-1">${processInlineMarkdown(content)}</h1>`;
    }
  } else if (line.startsWith('## ') && line.length > 3) {
    const content = line.substring(3); // Remove "## "
    if (content.trim().length > 0) {
      return `<h2 class="discord-header-2">${processInlineMarkdown(content)}</h2>`;
    }
  } else if (line.startsWith('### ') && line.length > 4) {
    const content = line.substring(4); // Remove "### "
    if (content.trim().length > 0) {
      return `<h3 class="discord-header-3">${processInlineMarkdown(content)}</h3>`;
    }
  }

  return null;
}

// Check if line is a blockquote
function isBlockquote(line) {
  return line.startsWith('> ') || line.startsWith('&gt; ');
}

// Parse blockquote
function parseBlockquote(line) {
  if (line.startsWith('&gt; ')) {
    const content = line.substring(5);
    return `<div class="discord-blockquote">${processInlineMarkdown(content)}</div>`;
  } else if (line.startsWith('> ')) {
    const content = line.substring(2);
    return `<div class="discord-blockquote">${processInlineMarkdown(content)}</div>`;
  }
  return null;
}

// Parse list items
function parseListItem(line) {
  // Unordered lists: -, *, + followed by space
  if ((line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) && line.length > 2) {
    const content = line.substring(2);
    return `<div class="discord-list-item">• ${processInlineMarkdown(content)}</div>`;
  }

  // Ordered lists: number followed by . and space
  const orderedMatch = line.match(/^(\d+)\. (.+)$/);
  if (orderedMatch) {
    const number = orderedMatch[1];
    const content = orderedMatch[2];
    return `<div class="discord-list-item">${number}. ${processInlineMarkdown(content)}</div>`;
  }

  return null;
}

// Join processed lines with proper spacing logic
function joinProcessedLines(processedLines) {
  let result = '';

  for (let i = 0; i < processedLines.length; i++) {
    const line = processedLines[i];
    const nextLine = processedLines[i + 1];

    result += line;

    // Only add spacing between lines when there's a next line
    if (i < processedLines.length - 1) {
      // If current line is <br> (empty line), don't add extra <br>
      if (line === '<br>') {
        continue;
      }

      // If next line is <br> (empty line), don't add <br> - the empty line handles spacing
      if (nextLine === '<br>') {
        continue;
      }

      // For all other cases (content followed by content), add <br>
      result += '<br>';
    }
  }

  return result;
}

// Check if a line is a block-level element
function isBlockLevelElement(line) {
  return line.includes('<h1') || line.includes('<h2') || line.includes('<h3') || line.includes('<h4') ||
         line.includes('<div class="discord-blockquote">') ||
         line.includes('<div class="discord-list-item">') ||
         line.includes('<div class="discord-code-block">');
}

// Process code blocks separately
function processCodeBlocks(text) {
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;

  return text.replace(codeBlockRegex, (match, language, code) => {
    const lang = language || '';
    const cleanCode = code.trim();
    return `<div class="discord-code-block"><pre><code class="language-${lang}">${cleanCode}</code></pre></div>`;
  });
}

// Escape HTML but preserve our processed code blocks
function escapeHTMLButPreserveCodeBlocks(str) {
  if (!str) return '';

  // First, temporarily replace code blocks with placeholders
  const codeBlocks = [];
  let tempStr = str.replace(/<div class="discord-code-block">[\s\S]*?<\/div>/g, (match) => {
    codeBlocks.push(match);
    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });

  // Escape HTML
  tempStr = tempStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    tempStr = tempStr.replace(`__CODEBLOCK_${index}__`, block);
  });

  return tempStr;
}

// Process inline markdown
function processInlineMarkdown(text) {
  // Code blocks (process first to avoid conflicts)
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, language, code) => {
    const lang = language || '';
    const cleanCode = code.trim();
    return `<div class="discord-code-block"><pre><code class="language-${lang}">${cleanCode}</code></pre></div>`;
  });

  // Headers (process line by line to handle start-of-line patterns)
  text = text.replace(/^### (.+)$/gm, '<span class="discord-header-3">$1</span>');
  text = text.replace(/^## (.+)$/gm, '<span class="discord-header-2">$1</span>');
  text = text.replace(/^# (.+)$/gm, '<span class="discord-header-1">$1</span>');
  text = text.replace(/^-# (.+)$/gm, '<span class="discord-header-4">$1</span>');

  // Lists (unordered)
  text = text.replace(/^- (.+)$/gm, '<span class="discord-list-item">• $1</span>');
  text = text.replace(/^\* (.+)$/gm, '<span class="discord-list-item">• $1</span>');
  text = text.replace(/^\+ (.+)$/gm, '<span class="discord-list-item">• $1</span>');

  // Lists (ordered)
  text = text.replace(/^(\d+)\. (.+)$/gm, '<span class="discord-list-item">$1. $2</span>');

  // Blockquotes (handle nested blockquotes)
  text = text.replace(/^&gt;&gt; (.+)$/gm, '<span class="discord-blockquote">$1</span>');
  text = text.replace(/^>> (.+)$/gm, '<span class="discord-blockquote">$1</span>');
  text = text.replace(/^&gt; (.+)$/gm, '<span class="discord-blockquote">$1</span>');
  text = text.replace(/^> (.+)$/gm, '<span class="discord-blockquote">$1</span>');

  // Bold (**text** and __text__)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<u>$1</u>'); // Discord uses underline for __

  // Italic (*text* and _text_) - be careful not to conflict with bold
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '<em>$1</em>');

  // Strikethrough
  text = text.replace(/~~(.*?)~~/g, '<s>$1</s>');

  // Spoilers
  text = text.replace(/\|\|(.*?)\|\|/g, '<span class="discord-spoiler">$1</span>');

  // Inline code (before links to avoid conflicts) - handle both escaped and unescaped
  text = text.replace(/`([^`\n]+?)`/g, '<code class="discord-inline-code">$1</code>');
  text = text.replace(/&#x60;([^&#x60;\n]+?)&#x60;/g, '<code class="discord-inline-code">$1</code>');

  // Markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="discord-link">$1</a>');

  // Auto-detect URLs (but not if they're already in a link)
  text = text.replace(/(?<!href=["'])(https?:\/\/[^\s<]+)(?![^<]*<\/a>)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="discord-link">$1</a>');

  // Discord emojis :emoji: (basic support)
  text = text.replace(/:([a-zA-Z0-9_]+):/g, '<span class="discord-emoji">:$1:</span>');

  return text;
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Show notification
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Copy text to clipboard
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Copied to clipboard!');
      return true;
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      showNotification('Failed to copy text', 'error');
      return false;
    });
}