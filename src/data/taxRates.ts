// Hardcoded US Sales Tax Rates — Offline Fallback
// Sources: State & city tax data (approximate combined rates)
// Last updated: 2026

export interface TaxLocation {
  state: string;
  stateCode: string;
  baseTax: number; // State base rate %
  cities: {
    name: string;
    zipPrefix?: string[];
    totalTax: number; // Combined state+county+city %
  }[];
}

export const TAX_DATA: TaxLocation[] = [
  {
    state: 'California',
    stateCode: 'CA',
    baseTax: 7.25,
    cities: [
      { name: 'Los Angeles', zipPrefix: ['900', '901', '902', '903', '904'], totalTax: 10.25 },
      { name: 'San Francisco', zipPrefix: ['941'], totalTax: 8.625 },
      { name: 'San Diego', zipPrefix: ['921', '922'], totalTax: 7.75 },
      { name: 'San Jose', zipPrefix: ['951', '952'], totalTax: 9.375 },
      { name: 'Sacramento', zipPrefix: ['958'], totalTax: 8.75 },
      { name: 'Long Beach', zipPrefix: ['908'], totalTax: 10.25 },
      { name: 'Anaheim', zipPrefix: ['928'], totalTax: 7.75 },
    ],
  },
  {
    state: 'New York',
    stateCode: 'NY',
    baseTax: 4.0,
    cities: [
      { name: 'New York City', zipPrefix: ['100', '101', '102', '103', '104', '111', '112', '113', '114', '116'], totalTax: 8.875 },
      { name: 'Buffalo', zipPrefix: ['142'], totalTax: 8.75 },
      { name: 'Albany', zipPrefix: ['122'], totalTax: 8.0 },
      { name: 'Yonkers', zipPrefix: ['107'], totalTax: 8.375 },
    ],
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    baseTax: 6.25,
    cities: [
      { name: 'Houston', zipPrefix: ['770', '771', '772'], totalTax: 8.25 },
      { name: 'Dallas', zipPrefix: ['752', '753'], totalTax: 8.25 },
      { name: 'Austin', zipPrefix: ['787', '786'], totalTax: 8.25 },
      { name: 'San Antonio', zipPrefix: ['782'], totalTax: 8.25 },
    ],
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    baseTax: 6.0,
    cities: [
      { name: 'Miami', zipPrefix: ['331', '332', '333'], totalTax: 7.0 },
      { name: 'Orlando', zipPrefix: ['328', '327'], totalTax: 6.5 },
      { name: 'Tampa', zipPrefix: ['336'], totalTax: 7.5 },
      { name: 'Jacksonville', zipPrefix: ['322'], totalTax: 7.0 },
    ],
  },
  {
    state: 'Washington',
    stateCode: 'WA',
    baseTax: 6.5,
    cities: [
      { name: 'Seattle', zipPrefix: ['981', '982'], totalTax: 10.25 },
      { name: 'Bellevue', zipPrefix: ['980'], totalTax: 10.2 },
      { name: 'Spokane', zipPrefix: ['992'], totalTax: 8.9 },
    ],
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    baseTax: 6.25,
    cities: [
      { name: 'Chicago', zipPrefix: ['606', '607', '608'], totalTax: 10.25 },
      { name: 'Naperville', zipPrefix: ['605'], totalTax: 8.75 },
    ],
  },
  {
    state: 'Nevada',
    stateCode: 'NV',
    baseTax: 4.6,
    cities: [
      { name: 'Las Vegas', zipPrefix: ['891'], totalTax: 8.375 },
      { name: 'Henderson', zipPrefix: ['890'], totalTax: 8.375 },
      { name: 'Reno', zipPrefix: ['895'], totalTax: 8.265 },
    ],
  },
  {
    state: 'Arizona',
    stateCode: 'AZ',
    baseTax: 5.6,
    cities: [
      { name: 'Phoenix', zipPrefix: ['850', '851', '852', '853'], totalTax: 8.6 },
      { name: 'Tucson', zipPrefix: ['857', '856'], totalTax: 8.7 },
      { name: 'Scottsdale', zipPrefix: ['852'], totalTax: 8.05 },
    ],
  },
  {
    state: 'Massachusetts',
    stateCode: 'MA',
    baseTax: 6.25,
    cities: [
      { name: 'Boston', zipPrefix: ['021', '022'], totalTax: 6.25 },
      { name: 'Cambridge', zipPrefix: ['021'], totalTax: 6.25 },
    ],
  },
  {
    state: 'Colorado',
    stateCode: 'CO',
    baseTax: 2.9,
    cities: [
      { name: 'Denver', zipPrefix: ['802', '803'], totalTax: 8.81 },
      { name: 'Boulder', zipPrefix: ['803'], totalTax: 8.845 },
    ],
  },
  {
    state: 'Oregon',
    stateCode: 'OR',
    baseTax: 0,
    cities: [
      { name: 'Portland', zipPrefix: ['972'], totalTax: 0 },
      { name: 'Eugene', zipPrefix: ['974'], totalTax: 0 },
    ],
  },
  {
    state: 'Montana',
    stateCode: 'MT',
    baseTax: 0,
    cities: [
      { name: 'Billings', zipPrefix: ['591'], totalTax: 0 },
      { name: 'Missoula', zipPrefix: ['598'], totalTax: 0 },
    ],
  },
  {
    state: 'New Hampshire',
    stateCode: 'NH',
    baseTax: 0,
    cities: [
      { name: 'Manchester', zipPrefix: ['031'], totalTax: 0 },
      { name: 'Nashua', zipPrefix: ['030'], totalTax: 0 },
    ],
  },
  {
    state: 'Delaware',
    stateCode: 'DE',
    baseTax: 0,
    cities: [
      { name: 'Wilmington', zipPrefix: ['198'], totalTax: 0 },
      { name: 'Dover', zipPrefix: ['199'], totalTax: 0 },
    ],
  },
  {
    state: 'Hawaii',
    stateCode: 'HI',
    baseTax: 4.0,
    cities: [
      { name: 'Honolulu', zipPrefix: ['968'], totalTax: 4.712 },
      { name: 'Maui', zipPrefix: ['967'], totalTax: 4.712 },
    ],
  },
  {
    state: 'Georgia',
    stateCode: 'GA',
    baseTax: 4.0,
    cities: [
      { name: 'Atlanta', zipPrefix: ['303', '304'], totalTax: 8.9 },
      { name: 'Savannah', zipPrefix: ['314'], totalTax: 7.0 },
    ],
  },
  {
    state: 'Pennsylvania',
    stateCode: 'PA',
    baseTax: 6.0,
    cities: [
      { name: 'Philadelphia', zipPrefix: ['191'], totalTax: 8.0 },
      { name: 'Pittsburgh', zipPrefix: ['152'], totalTax: 7.0 },
    ],
  },
  {
    state: 'Ohio',
    stateCode: 'OH',
    baseTax: 5.75,
    cities: [
      { name: 'Columbus', zipPrefix: ['432', '431'], totalTax: 7.75 },
      { name: 'Cleveland', zipPrefix: ['441'], totalTax: 8.0 },
      { name: 'Cincinnati', zipPrefix: ['452', '451'], totalTax: 7.8 },
    ],
  },
  {
    state: 'Michigan',
    stateCode: 'MI',
    baseTax: 6.0,
    cities: [
      { name: 'Detroit', zipPrefix: ['482', '481'], totalTax: 6.0 },
      { name: 'Grand Rapids', zipPrefix: ['495', '494'], totalTax: 6.0 },
    ],
  },
  {
    state: 'Minnesota',
    stateCode: 'MN',
    baseTax: 6.875,
    cities: [
      { name: 'Minneapolis', zipPrefix: ['554'], totalTax: 8.025 },
      { name: 'St. Paul', zipPrefix: ['551'], totalTax: 8.125 },
    ],
  },
];

// Default fallback tax if location unknown
export const DEFAULT_TAX_RATE = 8.0;

export function getTaxByZip(zipCode: string): { rate: number; location: string } {
  for (const state of TAX_DATA) {
    for (const city of state.cities) {
      if (city.zipPrefix) {
        for (const prefix of city.zipPrefix) {
          if (zipCode.startsWith(prefix)) {
            return {
              rate: city.totalTax,
              location: `${city.name}, ${state.stateCode}`,
            };
          }
        }
      }
    }
  }
  return { rate: DEFAULT_TAX_RATE, location: 'Unknown Location' };
}

export function getTaxByCity(stateCode: string, cityName: string): number {
  const stateData = TAX_DATA.find((s) => s.stateCode === stateCode);
  if (!stateData) return DEFAULT_TAX_RATE;
  const city = stateData.cities.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city?.totalTax ?? stateData.baseTax;
}
