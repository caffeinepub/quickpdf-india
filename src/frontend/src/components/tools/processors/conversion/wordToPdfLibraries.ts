/**
 * pdfMake library loader with proper VFS initialization
 * Loads pdfmake from CDN with explicit VFS (fonts) initialization following the pattern:
 * pdfMake.vfs = pdfFonts.pdfMake.vfs
 */

interface ConversionLibraries {
  pdfMake: any;
  JSZip: any;
}

let pdfMakeInstance: any = null;
let isInitialized = false;
let initializationError: Error | null = null;
let initRetryCount = 0;
const MAX_INIT_RETRIES = 1;

// CDN URLs for the libraries
const PDFMAKE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js';
const PDFMAKE_FONTS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.min.js';
const JSZIP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

/**
 * Load a script from CDN
 */
function loadScript(url: string, globalName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any)[globalName]) {
      resolve((window as any)[globalName]);
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      const lib = (window as any)[globalName];
      if (lib) {
        resolve(lib);
      } else {
        reject(new Error(`Library ${globalName} not found after loading ${url}`));
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script from ${url}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize pdfMake with proper VFS validation following the required pattern
 * Throws clear error if initialization fails
 */
export async function initPdfMake(): Promise<void> {
  try {
    // Load pdfMake library first
    await loadScript(PDFMAKE_URL, 'pdfMake');
    
    const pdfMake = (window as any).pdfMake;
    
    // Debug logging as required
    console.log('pdfMake:', pdfMake);
    
    // Validate pdfMake is loaded
    if (!pdfMake || typeof pdfMake !== 'object') {
      throw new Error('pdfMake failed to load - pdfMake module is undefined or invalid');
    }

    // Load vfs_fonts - this creates a separate pdfFonts object on window
    await loadScript(PDFMAKE_FONTS_URL, 'pdfMake');
    
    // The vfs_fonts script actually updates window.pdfMake.vfs directly,
    // but we need to validate it exists and log pdfFonts for debugging
    const pdfMakeWithFonts = (window as any).pdfMake;
    
    // Create a pdfFonts reference for logging (simulating the import pattern)
    const pdfFonts = {
      pdfMake: {
        vfs: pdfMakeWithFonts.vfs
      }
    };
    
    // Debug logging as required
    console.log('pdfFonts:', pdfFonts);

    // Validate pdfFonts structure exists
    if (!pdfFonts || !pdfFonts.pdfMake || !pdfFonts.pdfMake.vfs) {
      throw new Error('pdfMake failed to load - VFS (fonts) not available in pdfFonts structure');
    }

    // Following the required pattern: pdfMake.vfs = pdfFonts.pdfMake.vfs
    // (In this CDN case, it's already assigned, but we validate and reassign to follow the pattern)
    pdfMakeWithFonts.vfs = pdfFonts.pdfMake.vfs;

    // Validate createPdf method exists
    if (typeof pdfMakeWithFonts.createPdf !== 'function') {
      throw new Error('pdfMake failed to load - createPdf method not found');
    }

    // Validate vfs is properly assigned and is an object
    if (!pdfMakeWithFonts.vfs || typeof pdfMakeWithFonts.vfs !== 'object') {
      throw new Error('pdfMake failed to load - VFS (fonts) not available');
    }

    // Verify VFS has font data
    const vfsKeys = Object.keys(pdfMakeWithFonts.vfs);
    if (vfsKeys.length === 0) {
      throw new Error('pdfMake failed to load - VFS (fonts) is empty');
    }

    pdfMakeInstance = pdfMakeWithFonts;
    isInitialized = true;
    initializationError = null;
    console.log('✓ pdfMake initialized successfully with', vfsKeys.length, 'font files');
  } catch (error: any) {
    isInitialized = false;
    initializationError = error;
    pdfMakeInstance = null;
    console.error('✗ pdfMake initialization failed:', error);
    throw new Error(`pdfMake failed to load: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Load conversion libraries with guaranteed initialization
 * Ensures pdfMake is initialized before returning
 */
export async function loadConversionLibraries(): Promise<ConversionLibraries> {
  // If already initialized successfully, return immediately
  if (isInitialized && pdfMakeInstance && !initializationError) {
    const JSZip = await loadJSZip();
    return { pdfMake: pdfMakeInstance, JSZip };
  }

  // If previous initialization failed and we haven't retried yet
  if (initializationError && initRetryCount < MAX_INIT_RETRIES) {
    initRetryCount++;
    console.warn(`Retrying pdfMake initialization (${initRetryCount}/${MAX_INIT_RETRIES})...`);
    
    // Clear error state for retry
    initializationError = null;
    isInitialized = false;
    pdfMakeInstance = null;
    
    // Wait a bit before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      await initPdfMake();
      const JSZip = await loadJSZip();
      return { pdfMake: pdfMakeInstance, JSZip };
    } catch (error: any) {
      // If retry fails, throw final error
      throw new Error(
        `pdfMake failed to load after ${initRetryCount + 1} attempts. ${error?.message || 'Unknown error'}. Please refresh the page and try again.`
      );
    }
  }

  // If we've exhausted retries, throw the last error
  if (initializationError) {
    throw new Error(
      `pdfMake failed to load. ${initializationError.message}. Please refresh the page and try again.`
    );
  }

  // First-time initialization
  try {
    await initPdfMake();
    const JSZip = await loadJSZip();
    return { pdfMake: pdfMakeInstance, JSZip };
  } catch (error: any) {
    throw new Error(
      `Failed to load conversion libraries: ${error?.message || 'Unknown error'}. Please refresh the page and try again.`
    );
  }
}

/**
 * Load JSZip from CDN
 */
let jszipCache: any = null;
let jszipLoadPromise: Promise<any> | null = null;

async function loadJSZip(): Promise<any> {
  if (jszipCache) {
    return jszipCache;
  }

  if (jszipLoadPromise) {
    return jszipLoadPromise;
  }

  jszipLoadPromise = loadScript(JSZIP_URL, 'JSZip')
    .then(jszip => {
      jszipCache = jszip;
      return jszip;
    })
    .catch(error => {
      jszipLoadPromise = null;
      throw new Error(`Failed to load JSZip: ${error?.message || 'Unknown error'}`);
    });

  return jszipLoadPromise;
}

/**
 * Clear the library cache (useful for testing or forcing reload)
 */
export function clearLibraryCache(): void {
  pdfMakeInstance = null;
  isInitialized = false;
  initializationError = null;
  initRetryCount = 0;
  jszipCache = null;
  jszipLoadPromise = null;
}
