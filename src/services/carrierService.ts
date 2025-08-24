import { supabase } from '@/integrations/supabase/client';

export interface CarrierData {
  id: string;
  dot_number?: string;
  carrier_operation?: string;
  phone?: string;
  fax?: string;
  cell_phone?: string;
  company_officer_1?: string;
  company_officer_2?: string;
  business_org_desc?: string;
  truck_units?: number;
  power_units?: number;
  total_intrastate_drivers?: number;
  total_drivers?: number;
  classdef?: string;
  legal_name?: string;
  dba_name?: string;
  phy_street?: string;
  phy_city?: string;
  phy_country?: string;
  phy_state?: string;
  phy_zip?: string;
  carrier_mailing_street?: string;
  carrier_mailing_state?: string;
  carrier_mailing_city?: string;
  carrier_mailing_country?: string;
  carrier_mailing_zip?: string;
  carrier_mailing_cnty?: string;
  email_address?: string;
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
    
    let query = supabase
      .from('carrier_data')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (params.carrierOp) {
      query = query.ilike('carrier_operation', `%${params.carrierOp}%`);
    }
    
    if (params.powerUnits !== undefined && params.powerUnits > 0) {
      query = query.gte('power_units', params.powerUnits);
    }
    
    if (params.totalDrivers !== undefined && params.totalDrivers > 0) {
      query = query.gte('total_drivers', params.totalDrivers);
    }
    
    if (params.classDef) {
      query = query.ilike('classdef', `%${params.classDef}%`);
    }
    
    if (params.state) {
      query = query.ilike('phy_state', params.state);
    }

    // Limit to 50 rows
    query = query.limit(50);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return {
        count: 0,
        data: [],
        error: 'Failed to fetch carrier data'
      };
    }
    
    console.log(`Found ${count} total results, returning ${data?.length || 0} rows`);
    
    return {
      count: count || 0,
      data: data || []
    };
  } catch (error) {
    console.error('Service error:', error);
    return {
      count: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}