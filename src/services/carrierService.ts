import Papa from 'papaparse';

export interface CarrierData {
  CARRIER_OP: string;
  POWER_UNITS: number;
  TOTAL_DRIVERS: number;
  CLASS_DEF: string;
  STATE: string;
}

export interface FilterParams {
  carrierOp?: string;
  powerUnits?: number;
  totalDrivers?: number;
  classDef?: string;
  state?: string;
}

export interface FilterResponse {
  count: number;
  data: CarrierData[];
  error?: string;
}

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const CARRIER_OPERATIONS = ['Interstate', 'Intrastate'];
export const CLASS_DEFINITIONS = ['For-hire', 'Private'];

export async function filterCarriers(params: FilterParams): Promise<FilterResponse> {
  try {
    console.log('Filtering carriers with params:', params);
    
    const response = await fetch('/data/filtered_carrier_data.csv');
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toUpperCase(),
        transform: (value: string, header: string) => {
          const trimmedValue = value.trim();
          if (header === 'POWER_UNITS' || header === 'TOTAL_DRIVERS') {
            return parseInt(trimmedValue, 10);
          }
          return trimmedValue;
        },
        complete: (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parse errors:', results.errors);
              resolve({
                count: 0,
                data: [],
                error: 'Error parsing CSV file'
              });
              return;
            }

            let filteredData = results.data as CarrierData[];
            
            // Apply filters
            if (params.carrierOp) {
              filteredData = filteredData.filter(row => 
                row.CARRIER_OP?.toLowerCase() === params.carrierOp?.toLowerCase()
              );
            }
            
            if (params.powerUnits !== undefined && params.powerUnits > 0) {
              filteredData = filteredData.filter(row => 
                row.POWER_UNITS >= params.powerUnits!
              );
            }
            
            if (params.totalDrivers !== undefined && params.totalDrivers > 0) {
              filteredData = filteredData.filter(row => 
                row.TOTAL_DRIVERS >= params.totalDrivers!
              );
            }
            
            if (params.classDef) {
              filteredData = filteredData.filter(row => 
                row.CLASS_DEF?.toLowerCase() === params.classDef?.toLowerCase()
              );
            }
            
            if (params.state) {
              filteredData = filteredData.filter(row => 
                row.STATE?.toLowerCase() === params.state?.toLowerCase()
              );
            }

            // Limit to 50 rows
            const limitedData = filteredData.slice(0, 50);
            
            console.log(`Filtered ${filteredData.length} results, returning ${limitedData.length}`);
            
            resolve({
              count: filteredData.length,
              data: limitedData
            });
          } catch (error) {
            console.error('Error filtering data:', error);
            resolve({
              count: 0,
              data: [],
              error: 'Error processing filter parameters'
            });
          }
        },
        error: (error) => {
          console.error('Papa parse error:', error);
          resolve({
            count: 0,
            data: [],
            error: 'Failed to parse CSV file'
          });
        }
      });
    });
  } catch (error) {
    console.error('Service error:', error);
    return {
      count: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}