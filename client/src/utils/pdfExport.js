import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Robust, high-quality PDF exporter for resumes
 * Clones target element into a 1:1 scale A4 offscreen container to guarantee
 * proper rendering regardless of parent CSS transforms or hidden view state.
 */
export const exportToPDF = async (element, filename = 'resume') => {
  if (!element) {
    throw new Error('Preview element not found');
  }

  let container = null;
  try {
    // 1. Create a dedicated offscreen A4 wrapper on document.body
    container = document.createElement('div');
    container.id = 'pdf-export-container';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.minHeight = '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '99999';
    container.style.opacity = '1';
    container.style.pointerEvents = 'none';

    // 2. Clone the element and remove height & overflow restrictions
    const clone = element.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.display = 'block';
    clone.style.width = '794px';
    clone.style.height = 'auto';
    clone.style.minHeight = '1123px';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

    // Remove hidden/scale/overflow-hidden utilities from clone and all descendants
    const fixOverflow = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.style.overflow = 'visible';
        node.style.maxHeight = 'none';
        node.classList.remove('hidden', 'scale-75', 'scale-90', 'lg:scale-75', 'xl:scale-90', 'overflow-hidden');
        for (const child of node.children) {
          fixOverflow(child);
        }
      }
    };
    fixOverflow(clone);

    container.appendChild(clone);
    document.body.appendChild(container);

    // 3. Wait briefly for layout & fonts to render
    await new Promise(resolve => setTimeout(resolve, 200));

    // Calculate full natural height of all resume sections
    const fullHeight = Math.max(container.scrollHeight, clone.scrollHeight, 1123);

    // 4. Capture canvas with full height and oklab/oklch color sanitizer
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      windowHeight: fullHeight,
      height: fullHeight,
      onclone: (clonedDoc) => {
        // Sanitize oklab/oklch in style tags to prevent html2canvas color parse errors
        const styleElements = clonedDoc.querySelectorAll('style');
        styleElements.forEach(style => {
          if (style.textContent && (style.textContent.includes('oklab') || style.textContent.includes('oklch') || style.textContent.includes('color-mix'))) {
            style.textContent = style.textContent.replace(/(oklab|oklch|color-mix)\([^)]+\)/gi, 'rgba(30, 41, 59, 0.8)');
          }
        });

        // Sanitize elements with inline oklab/oklch
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          el.style.overflow = 'visible';
          el.style.maxHeight = 'none';
          const attrStyle = el.getAttribute('style');
          if (attrStyle && (attrStyle.includes('oklab') || attrStyle.includes('oklch') || attrStyle.includes('color-mix'))) {
            el.setAttribute('style', attrStyle.replace(/(oklab|oklch|color-mix)\([^)]+\)/gi, 'rgba(30, 41, 59, 0.8)'));
          }
        });
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to generate render canvas');
    }

    // 5. Generate PDF with multi-page support
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = 210; // A4 width in mm
    const pdfPageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfPageHeight;

    while (heightLeft > 5) {
      position -= pdfPageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfPageHeight;
    }

    const cleanFilename = (filename || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`${cleanFilename}.pdf`);

    return true;
  } finally {
    // 6. Clean up temporary DOM container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};
