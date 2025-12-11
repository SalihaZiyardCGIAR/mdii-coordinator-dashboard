import Papa from 'papaparse';

const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT;
const sasToken = import.meta.env.VITE_AZURE_TOOL_STATUS_STORAGE_SAS_TOKEN;
const containerName = import.meta.env.VITE_AZURE_TOOL_STATUS_STORAGE_CONTAINER;

// Remove leading '?' if present in SAS token
const cleanSasToken = sasToken?.startsWith('?') ? sasToken.slice(1) : sasToken;

// CSV file name

// Build the blob URL
const getAzureBlobUrl = () => {
  if (!accountName || !cleanSasToken || !containerName) {
    console.error('Missing Azure configuration:', { accountName, hasToken: !!cleanSasToken, containerName });
    throw new Error('Azure Storage not configured properly');
  }
  return `https://${accountName}.blob.core.windows.net/${containerName}/${import.meta.env.VITE_AZURE_TOOL_STATUS_BLOB_NAME}?${cleanSasToken}`;
};

const AZURE_BLOB_URL = getAzureBlobUrl();

export interface ToolStatusRow {
  [key: string]: string;
}

/**
 * Parse CSV data (handles a merged first/title row and auto-detects delimiter)
 */
const parseCSV = (csvText: string): Promise<{ data: ToolStatusRow[]; firstRow: string }> => {
  const lines = csvText.replace(/\r/g, "").split("\n");
  if (lines.length === 0) return Promise.resolve({ data: [], firstRow: "" });

  // Save the first row (merged title row)
  const firstRow = lines[0];

  // Use the rest (from line 2 onward) for parsing
  const csvContent = lines.slice(1).join("\n").trim();
  if (!csvContent) return Promise.resolve({ data: [], firstRow });

  // Auto-detect delimiter: prefer tab if it appears more than commas
  const sample = csvContent.slice(0, 2000);
  const tabCount = (sample.match(/\t/g) || []).length;
  const commaCount = (sample.match(/,/g) || []).length;
  const delimiter = tabCount > commaCount ? "\t" : ",";

  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      delimiter,
      transformHeader: (header: string) => (header || "").trim(),
      complete: (results) => {
        console.log("CSV parsed. Delimiter:", delimiter, "Total rows:", results.data.length);
        if (results.data.length > 0) {
          console.log("Column names:", Object.keys(results.data[0]));
        }
        resolve({ data: results.data as ToolStatusRow[], firstRow });
      },
      error: (error) => {
        console.error("Papa Parse error:", error);
        reject(error);
      }
    });
  });
};


/**
 * Convert tasks to CSV (use tab delimiter)
 */
const tasksToCSV = (data: ToolStatusRow[]): string => {
  return Papa.unparse(data, {
    delimiter: ',',  // Use comma, not tab!
    quotes: true,    // Quote all fields to preserve data
    skipEmptyLines: false
  });
};

/**
 * Read CSV from Azure Blob Storage
 */
async function readCSV(): Promise<{ data: ToolStatusRow[]; firstRow: string }> {
  try {
    console.log('Reading CSV from Azure:', AZURE_BLOB_URL.split('?')[0]);

    const response = await fetch(AZURE_BLOB_URL, {
      method: 'GET',
      headers: {
        'x-ms-blob-type': 'BlockBlob'
      }
    });

    console.log('Response status:', response.status);

    if (response.status === 404) {
      throw new Error('CSV file not found');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure response error:', errorText);
      throw new Error(`Failed to read CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('CSV downloaded, size:', csvText.length, 'bytes');

    return await parseCSV(csvText);
  } catch (error: any) {
    console.error('Error reading CSV:', error);
    throw error;
  }
}

async function writeCSV(data: ToolStatusRow[], originalFirstRow: string): Promise<void> {
  try {
    console.log('Preparing to write CSV. Total rows:', data.length);

    const csvContent = tasksToCSV(data);
    const finalCSV = originalFirstRow + '\n' + csvContent;

    console.log('Final CSV length:', finalCSV.length, 'characters');

    // Create blob with UTF-8 BOM to preserve special characters
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + finalCSV], { 
      type: 'text/csv;charset=utf-8' 
    });

    console.log('Uploading to Azure...');
    const response = await fetch(AZURE_BLOB_URL, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'text/csv;charset=utf-8'
      },
      body: blob
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      throw new Error(`Failed to write CSV: ${response.status} ${response.statusText}`);
    }

    console.log('CSV SUCCESSFULLY UPDATED IN AZURE');
    console.log('Response status:', response.status);

    // Verify upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Verifying upload...');
    const verifyResponse = await fetch(AZURE_BLOB_URL, {
      method: 'GET',
      headers: { 'x-ms-blob-type': 'BlockBlob' }
    });

    if (verifyResponse.ok) {
      const verifyText = await verifyResponse.text();
      console.log('Verification successful, size:', verifyText.length, 'bytes');
    }
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
}

/**
 * Update tool status when Stop button is clicked
 */
export async function updateToolStatusOnStop(toolId: string, stoppedAt: string): Promise<void> {
  try {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('    UPDATING TOOL STATUS IN AZURE');
    console.log('═══════════════════════════════════════════');
    console.log('Tool ID:', toolId);
    console.log('Stopped At:', stoppedAt);
    console.log('');

    const { data: existingData, firstRow: originalFirstRow } = await readCSV();

    if (existingData.length === 0) {
      throw new Error('CSV file has no data rows');
    }

    console.log('CSV loaded. Total rows:', existingData.length);

    // Debug: Show first few Tool_IDs
    console.log('First 3 Tool IDs:', existingData.slice(0, 3).map(r => r['Tool_ID']).filter(Boolean));

    const toolIndex = existingData.findIndex(row => {
      const rowToolId = String(row['Tool_ID'] || '').trim();
      return rowToolId === toolId;
    });

    if (toolIndex === -1) {
      const availableIds = existingData.map(r => String(r['Tool_ID'] || '').trim()).filter(Boolean);
      console.error('Tool not found in CSV!');
      console.error('Available Tool IDs:', availableIds.slice(0, 10));
      throw new Error(`Failed to stop tool: Tool ID "${toolId}" not found. Available: ${availableIds.slice(0, 5).join(', ')}...`);
    }

    console.log('Found tool at row:', toolIndex + 2, '(Excel row number)');

    console.log('BEFORE UPDATE:');
    console.log('   Status:', existingData[toolIndex]['Status'] || '(empty)');
    console.log('   Current Step:', existingData[toolIndex]['Current Step'] || '(empty)');
    console.log('   Survey Closed (Direct Users):', existingData[toolIndex]['Survey Closed Time for Direct Users'] || '(empty)');
    console.log('   Survey Closed:', existingData[toolIndex]['Survey Closed Time for Downstream Beneficiries'] || '(empty)');

    // Update columns
    existingData[toolIndex]['Status'] = 'Completed';
    existingData[toolIndex]['Current Step'] = 'Report Sent';
    existingData[toolIndex]['Survey Closed Time for Direct Users'] = stoppedAt;
    existingData[toolIndex]['Survey Closed Time for Downstream Beneficiries'] = stoppedAt;
    existingData[toolIndex]['Report Sent'] = '✓';

    console.log('AFTER UPDATE:');
    console.log('   Status: Completed');
    console.log('   Current Step: Report Sent');
    console.log('   Survey Closed:', stoppedAt);

    await writeCSV(existingData, originalFirstRow);

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('   UPDATE COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('UPDATE FAILED:', error);
    throw error;
  }
}

/**
 * Get tool status from CSV
 */
export async function getToolStatus(toolId: string): Promise<ToolStatusRow | null> {
  try {
    console.log('Fetching tool status for:', toolId);
    const { data } = await readCSV();

    const tool = data.find(row => {
      const rowToolId = String(row['Tool_ID'] || '').trim();
      return rowToolId === toolId;
    });

    if (tool) {
      // Check if tool is actually completed based on all required conditions
      const isCompleted = 
        tool['Status'] === 'Completed' &&
        tool['Current Step'] === 'Report Sent' &&
        (tool['Report Sent'] === 'Checkmark' || tool['Report Sent'] === '✓') &&
        tool['Survey Closed Time for Downstream Beneficiries'];

      console.log('Tool found:', {
        toolId: tool['Tool_ID'],
        status: tool['Status'],
        currentStep: tool['Current Step'],
        reportSent: tool['Report Sent'],
        surveyClosed: tool['Survey Closed Time for Downstream Beneficiries'],
        isActuallyCompleted: isCompleted
      });

      // Override status if not actually completed
      if (!isCompleted) {
        tool['Status'] = 'In Progress';
      }
    } else {
      console.log('Tool not found in CSV');
    }

    return tool || null;
  } catch (error) {
    console.error('Error getting tool status:', error);
    return null;
  }
}

/**
 * Get all stopped/completed tools
 */
export async function getAllStoppedTools(): Promise<ToolStatusRow[]> {
  try {
    const { data } = await readCSV();
    return data.filter(row => row['Status'] === 'Completed');
  } catch (error) {
    console.error('Error getting stopped tools:', error);
    return [];
  }
}

/**
 * Get all tools
 */
export async function getAllTools(): Promise<ToolStatusRow[]> {
  try {
    const { data } = await readCSV();
    return data;
  } catch (error) {
    console.error('Error getting all tools:', error);
    return [];
  }
}