/**
 * Client-side PDF text extraction using PDF.js via CDN
 * Extracts plain text content from PDF files in the browser
 */

// Type definitions for PDF.js
interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFPageProxy {
  getTextContent(): Promise<TextContent>;
}

interface TextContent {
  items: TextItem[];
}

interface TextItem {
  str: string;
}

interface PDFJSStatic {
  getDocument(params: { data: Uint8Array }): { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: {
    workerSrc: string;
  };
}

declare global {
  interface Window {
    pdfjsLib?: PDFJSStatic;
  }
}

/**
 * Loads PDF.js library from CDN if not already loaded
 */
async function loadPdfJs(): Promise<PDFJSStatic> {
  // Check if already loaded
  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  return new Promise((resolve, reject) => {
    // Create script element for PDF.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    script.async = true;

    script.onload = () => {
      if (window.pdfjsLib) {
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js library failed to load properly'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PDF processing library. Please check your internet connection.'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to extract text from
 * @returns Extracted plain text content
 * @throws Error if PDF cannot be processed
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    // Load PDF.js library
    const pdfjsLib = await loadPdfJs();

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: typedArray });
    const pdf = await loadingTask.promise;

    // Extract text from all pages
    const totalPages = pdf.numPages;
    const textPromises: Promise<string>[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pagePromise = pdf.getPage(pageNum).then(async (page: PDFPageProxy) => {
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: TextItem) => item.str)
          .join(' ');
        return pageText;
      });
      textPromises.push(pagePromise);
    }

    // Wait for all pages to be processed
    const pagesText = await Promise.all(textPromises);
    const fullText = pagesText.join('\n\n');

    if (!fullText || fullText.trim().length === 0) {
      throw new Error('Could not extract text from this PDF. The file may be empty or contain only images.');
    }

    return fullText;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with user-friendly message if it's already an Error
      if (error.message.includes('Could not extract text') || 
          error.message.includes('Failed to load PDF')) {
        throw error;
      }
      throw new Error(`Could not extract text from this PDF: ${error.message}`);
    }
    throw new Error('Could not extract text from this PDF. The file may be corrupted or password-protected.');
  }
}
