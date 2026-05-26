// Hardcoded US Sales Tax Rates — Offline Fallback
// Sources: CDTFA (California), state revenue departments
// Last updated: Q1 2025 — rates may change; always verify with your receipt.

// ─────────────────────────── Interfaces ────────────────────────────────────

export interface CityEntry {
  name: string;
  totalTax: number; // Combined state + county + city %
  zipPrefix?: string[];
}

export interface CountyEntry {
  name: string;
  countyTax: number; // Combined rate for unincorporated county areas
  cities: CityEntry[];
}

export interface TaxLocation {
  state: string;
  stateCode: string;
  baseTax: number; // State-only base rate
  counties?: CountyEntry[];
  cities: CityEntry[]; // Kept for backward-compat & GPS fallback search
}

// ─────────────────────────── Data ──────────────────────────────────────────

export const TAX_DATA: TaxLocation[] = [
  {
    state: 'California',
    stateCode: 'CA',
    baseTax: 7.25,
    counties: [
      {
        name: 'Los Angeles County',
        countyTax: 10.25, // unincorporated areas rate (incl. Measure J)
        cities: [
          // ── 9.5% — county base, no additional local measures ──
          { name: 'Agoura Hills',         totalTax: 9.5  },
          { name: 'Artesia',              totalTax: 9.5  },
          { name: 'Bell',                 totalTax: 9.5  },
          { name: 'Beverly Hills',        totalTax: 9.5  },
          { name: 'Bradbury',             totalTax: 9.5  },
          { name: 'Cerritos',             totalTax: 9.5  },
          { name: 'Claremont',            totalTax: 9.5  },
          { name: 'Diamond Bar',          totalTax: 9.5  },
          { name: 'Duarte',               totalTax: 9.5  },
          { name: 'El Segundo',           totalTax: 9.5  },
          { name: 'Glendora',             totalTax: 9.5  },
          { name: 'Hermosa Beach',        totalTax: 9.5  },
          { name: 'Hidden Hills',         totalTax: 9.5  },
          { name: 'City of Industry',     totalTax: 9.5  },
          { name: 'Irwindale',            totalTax: 9.5  },
          { name: 'La Cañada Flintridge', totalTax: 9.5  },
          { name: 'La Habra Heights',     totalTax: 9.5  },
          { name: 'La Mirada',            totalTax: 9.5  },
          { name: 'La Puente',            totalTax: 9.5  },
          { name: 'La Verne',             totalTax: 9.5  },
          { name: 'Lomita',               totalTax: 9.5  },
          { name: 'Malibu',               totalTax: 9.5  },
          { name: 'Manhattan Beach',      totalTax: 9.5  },
          { name: 'Palos Verdes Estates', totalTax: 9.5  },
          { name: 'Rancho Palos Verdes',  totalTax: 9.5  },
          { name: 'Redondo Beach',        totalTax: 9.5  },
          { name: 'Rolling Hills',        totalTax: 9.5  },
          { name: 'Rolling Hills Estates',totalTax: 9.5  },
          { name: 'Rosemead',             totalTax: 9.5  },
          { name: 'San Dimas',            totalTax: 9.5  },
          { name: 'San Marino',           totalTax: 9.5  },
          { name: 'Santa Clarita',        totalTax: 9.5  },
          { name: 'Santa Fe Springs',     totalTax: 9.5  },
          { name: 'Sierra Madre',         totalTax: 9.5  },
          { name: 'South El Monte',       totalTax: 9.5  },
          { name: 'Temple City',          totalTax: 9.5  },
          { name: 'Torrance',             totalTax: 9.5  },
          { name: 'Vernon',               totalTax: 9.5  },
          { name: 'Walnut',               totalTax: 9.5  },
          { name: 'Westlake Village',     totalTax: 9.5  },
          // ── 10.0% ──
          { name: 'Avalon',               totalTax: 10.0 },
          // ── 10.25% — added local measures ──
          { name: 'Alhambra',             totalTax: 10.25 },
          { name: 'Arcadia',              totalTax: 10.25 },
          { name: 'Baldwin Park',         totalTax: 10.25 },
          { name: 'Bell Gardens',         totalTax: 10.25 },
          { name: 'Bellflower',           totalTax: 10.25 },
          { name: 'Burbank',              totalTax: 10.25 },
          { name: 'Calabasas',            totalTax: 10.25 },
          { name: 'Carson',               totalTax: 10.25 },
          { name: 'Commerce',             totalTax: 10.25 },
          { name: 'Compton',              totalTax: 10.25 },
          { name: 'Covina',               totalTax: 10.25 },
          { name: 'Cudahy',               totalTax: 10.25 },
          { name: 'Culver City',          totalTax: 10.25 },
          { name: 'Downey',               totalTax: 10.25 },
          { name: 'El Monte',             totalTax: 10.25 },
          { name: 'Gardena',              totalTax: 10.25 },
          { name: 'Glendale',             totalTax: 10.25 },
          { name: 'Hawaiian Gardens',     totalTax: 10.25 },
          { name: 'Hawthorne',            totalTax: 10.25 },
          { name: 'Huntington Park',      totalTax: 10.25 },
          { name: 'Inglewood',            totalTax: 10.25 },
          { name: 'Lakewood',             totalTax: 10.25 },
          { name: 'Lancaster',            totalTax: 10.25 },
          { name: 'Lawndale',             totalTax: 10.25 },
          { name: 'Long Beach',           totalTax: 10.25, zipPrefix: ['908'] },
          { name: 'Los Angeles',          totalTax: 10.25, zipPrefix: ['900','901','902','903','904'] },
          { name: 'Lynwood',              totalTax: 10.25 },
          { name: 'Maywood',              totalTax: 10.25 },
          { name: 'Monrovia',             totalTax: 10.25 },
          { name: 'Montebello',           totalTax: 10.25 },
          { name: 'Monterey Park',        totalTax: 10.25 },
          { name: 'Norwalk',              totalTax: 10.25 },
          { name: 'Palmdale',             totalTax: 10.25 },
          { name: 'Paramount',            totalTax: 10.25 },
          { name: 'Pasadena',             totalTax: 10.25 },
          { name: 'Pico Rivera',          totalTax: 10.25 },
          { name: 'Pomona',               totalTax: 10.25 },
          { name: 'San Fernando',         totalTax: 10.25 },
          { name: 'San Gabriel',          totalTax: 10.25 },
          { name: 'Santa Monica',         totalTax: 10.25 },
          { name: 'Signal Hill',          totalTax: 10.25 },
          { name: 'South Gate',           totalTax: 10.25 },
          { name: 'South Pasadena',       totalTax: 10.25 },
          { name: 'West Covina',          totalTax: 10.25 },
          { name: 'West Hollywood',       totalTax: 10.25 },
          { name: 'Whittier',             totalTax: 10.25 },
          // ── 10.75% — additional local measure ──
          { name: 'Azusa',                totalTax: 10.75 },
        ],
      },
      {
        name: 'Orange County',
        countyTax: 7.75,
        cities: [
          // ── 7.75% — county base ──
          { name: 'Aliso Viejo',          totalTax: 7.75 },
          { name: 'Anaheim',              totalTax: 7.75 },
          { name: 'Brea',                 totalTax: 7.75 },
          { name: 'Buena Park',           totalTax: 7.75 },
          { name: 'Costa Mesa',           totalTax: 7.75 },
          { name: 'Cypress',              totalTax: 7.75 },
          { name: 'Dana Point',           totalTax: 7.75 },
          { name: 'Fountain Valley',      totalTax: 7.75 },
          { name: 'Fullerton',            totalTax: 7.75 },
          { name: 'Huntington Beach',     totalTax: 7.75 },
          { name: 'Irvine',               totalTax: 7.75 },
          { name: 'La Habra',             totalTax: 8.25 },
          { name: 'La Palma',             totalTax: 7.75 },
          { name: 'Laguna Beach',         totalTax: 7.75 },
          { name: 'Laguna Hills',         totalTax: 7.75 },
          { name: 'Laguna Niguel',        totalTax: 7.75 },
          { name: 'Laguna Woods',         totalTax: 7.75 },
          { name: 'Lake Forest',          totalTax: 7.75 },
          { name: 'Los Alamitos',         totalTax: 7.75 },
          { name: 'Mission Viejo',        totalTax: 7.75 },
          { name: 'Newport Beach',        totalTax: 7.75 },
          { name: 'Orange',               totalTax: 7.75 },
          { name: 'Placentia',            totalTax: 7.75 },
          { name: 'Rancho Santa Margarita', totalTax: 7.75 },
          { name: 'San Clemente',         totalTax: 7.75 },
          { name: 'San Juan Capistrano',  totalTax: 7.75 },
          { name: 'Seal Beach',           totalTax: 7.75 },
          { name: 'Stanton',              totalTax: 7.75 },
          { name: 'Tustin',               totalTax: 7.75 },
          { name: 'Villa Park',           totalTax: 7.75 },
          { name: 'Yorba Linda',          totalTax: 7.75 },
          // ── Higher rates (added local measures) ──
          { name: 'Garden Grove',         totalTax: 8.75 },
          { name: 'Santa Ana',            totalTax: 9.25 },
          { name: 'Westminster',          totalTax: 8.75 },
        ],
      },
      {
        name: 'San Francisco County',
        countyTax: 8.625,
        cities: [
          { name: 'San Francisco',        totalTax: 8.625, zipPrefix: ['941'] },
        ],
      },
      {
        name: 'Santa Clara County',
        countyTax: 9.125,
        cities: [
          // ── 9.125% — county base ──
          { name: 'Campbell',             totalTax: 9.375 },
          { name: 'Cupertino',            totalTax: 9.125 },
          { name: 'Gilroy',               totalTax: 9.125 },
          { name: 'Los Altos',            totalTax: 9.125 },
          { name: 'Los Altos Hills',      totalTax: 9.125 },
          { name: 'Los Gatos',            totalTax: 9.125 },
          { name: 'Milpitas',             totalTax: 9.375 },
          { name: 'Monte Sereno',         totalTax: 9.125 },
          { name: 'Morgan Hill',          totalTax: 9.125 },
          { name: 'Mountain View',        totalTax: 9.125 },
          { name: 'Palo Alto',            totalTax: 9.125, zipPrefix: ['943'] },
          { name: 'San Jose',             totalTax: 9.375, zipPrefix: ['951','952'] },
          { name: 'Santa Clara',          totalTax: 9.375, zipPrefix: ['950'] },
          { name: 'Saratoga',             totalTax: 9.125 },
          { name: 'Sunnyvale',            totalTax: 9.125, zipPrefix: ['940'] },
        ],
      },
      {
        name: 'Alameda County',
        countyTax: 10.25,
        cities: [
          // ── 10.25% — county base ──
          { name: 'Dublin',               totalTax: 10.25 },
          { name: 'Fremont',              totalTax: 10.25, zipPrefix: ['945'] },
          { name: 'Livermore',            totalTax: 10.25 },
          { name: 'Newark',               totalTax: 10.25 },
          { name: 'Oakland',              totalTax: 10.25, zipPrefix: ['946'] },
          { name: 'Pleasanton',           totalTax: 10.25 },
          { name: 'Union City',           totalTax: 10.25 },
          // ── 10.5% ──
          { name: 'Emeryville',           totalTax: 10.5  },
          // ── 10.75% (added local measures) ──
          { name: 'Alameda',              totalTax: 10.75 },
          { name: 'Albany',               totalTax: 10.75 },
          { name: 'Berkeley',             totalTax: 10.75, zipPrefix: ['947'] },
          { name: 'Hayward',              totalTax: 10.75 },
          { name: 'Piedmont',             totalTax: 10.75 },
          { name: 'San Leandro',          totalTax: 10.75 },
        ],
      },
      {
        name: 'San Diego County',
        countyTax: 7.75,
        cities: [
          // ── 7.75% — county base ──
          { name: 'Carlsbad',             totalTax: 7.75 },
          { name: 'Coronado',             totalTax: 7.75 },
          { name: 'Del Mar',              totalTax: 7.75 },
          { name: 'El Cajon',             totalTax: 7.75 },
          { name: 'Encinitas',            totalTax: 7.75 },
          { name: 'Escondido',            totalTax: 7.75 },
          { name: 'Imperial Beach',       totalTax: 7.75 },
          { name: 'La Mesa',              totalTax: 7.75 },
          { name: 'Lemon Grove',          totalTax: 7.75 },
          { name: 'Oceanside',            totalTax: 7.75 },
          { name: 'Poway',                totalTax: 7.75 },
          { name: 'San Diego',            totalTax: 7.75, zipPrefix: ['921','922'] },
          { name: 'San Marcos',           totalTax: 7.75 },
          { name: 'Santee',               totalTax: 7.75 },
          { name: 'Solana Beach',         totalTax: 7.75 },
          { name: 'Vista',                totalTax: 7.75 },
          // ── Higher rates ──
          { name: 'Chula Vista',          totalTax: 8.75 },
          { name: 'National City',        totalTax: 8.75 },
        ],
      },
      {
        name: 'Sacramento County',
        countyTax: 8.75,
        cities: [
          { name: 'Citrus Heights',       totalTax: 8.75 },
          { name: 'Elk Grove',            totalTax: 8.75 },
          { name: 'Folsom',               totalTax: 7.75 },
          { name: 'Galt',                 totalTax: 8.75 },
          { name: 'Isleton',              totalTax: 8.75 },
          { name: 'Rancho Cordova',       totalTax: 8.75 },
          { name: 'Sacramento',           totalTax: 8.75, zipPrefix: ['958'] },
        ],
      },
      {
        name: 'San Bernardino County',
        countyTax: 7.75,
        cities: [
          // ── 7.75% ──
          { name: 'Chino',                totalTax: 7.75 },
          { name: 'Chino Hills',          totalTax: 7.75 },
          { name: 'Hesperia',             totalTax: 7.75 },
          { name: 'Loma Linda',           totalTax: 7.75 },
          { name: 'Montclair',            totalTax: 7.75 },
          { name: 'Ontario',              totalTax: 7.75 },
          { name: 'Rancho Cucamonga',     totalTax: 7.75 },
          { name: 'Redlands',             totalTax: 7.75 },
          { name: 'Rialto',               totalTax: 7.75 },
          { name: 'San Bernardino',       totalTax: 8.75 },
          { name: 'Upland',               totalTax: 7.75 },
          { name: 'Victorville',          totalTax: 7.75 },
          { name: 'Yucaipa',              totalTax: 7.75 },
          // ── Higher rates ──
          { name: 'Colton',               totalTax: 8.75 },
          { name: 'Fontana',              totalTax: 7.75 },
        ],
      },
      {
        name: 'Riverside County',
        countyTax: 7.75,
        cities: [
          { name: 'Cathedral City',       totalTax: 8.75 },
          { name: 'Coachella',            totalTax: 8.75 },
          { name: 'Corona',               totalTax: 7.75 },
          { name: 'Desert Hot Springs',   totalTax: 8.75 },
          { name: 'Hemet',                totalTax: 7.75 },
          { name: 'Indio',                totalTax: 8.75 },
          { name: 'Jurupa Valley',        totalTax: 7.75 },
          { name: 'Lake Elsinore',        totalTax: 7.75 },
          { name: 'Menifee',              totalTax: 7.75 },
          { name: 'Moreno Valley',        totalTax: 7.75 },
          { name: 'Murrieta',             totalTax: 7.75 },
          { name: 'Palm Desert',          totalTax: 7.75 },
          { name: 'Palm Springs',         totalTax: 9.25 },
          { name: 'Perris',               totalTax: 7.75 },
          { name: 'Riverside',            totalTax: 8.75, zipPrefix: ['925'] },
          { name: 'Temecula',             totalTax: 7.75 },
        ],
      },
      {
        name: 'Contra Costa County',
        countyTax: 8.75,
        cities: [
          { name: 'Antioch',              totalTax: 9.75 },
          { name: 'Brentwood',            totalTax: 8.75 },
          { name: 'Concord',              totalTax: 9.75 },
          { name: 'Danville',             totalTax: 8.75 },
          { name: 'El Cerrito',           totalTax: 10.25 },
          { name: 'Hercules',             totalTax: 9.25 },
          { name: 'Lafayette',            totalTax: 8.75 },
          { name: 'Martinez',             totalTax: 8.75 },
          { name: 'Moraga',               totalTax: 8.75 },
          { name: 'Oakley',               totalTax: 8.75 },
          { name: 'Orinda',               totalTax: 8.75 },
          { name: 'Pinole',               totalTax: 9.75 },
          { name: 'Pittsburg',            totalTax: 9.25 },
          { name: 'Pleasant Hill',        totalTax: 8.75 },
          { name: 'Richmond',             totalTax: 9.75 },
          { name: 'San Pablo',            totalTax: 9.5  },
          { name: 'San Ramon',            totalTax: 8.75 },
          { name: 'Walnut Creek',         totalTax: 8.75 },
        ],
      },
    ],
    // Flat cities list for backward-compat / GPS partial match
    cities: [
      { name: 'Los Angeles',    zipPrefix: ['900','901','902','903','904'], totalTax: 10.25 },
      { name: 'San Francisco',  zipPrefix: ['941'],                         totalTax: 8.625 },
      { name: 'San Diego',      zipPrefix: ['921','922'],                   totalTax: 7.75  },
      { name: 'San Jose',       zipPrefix: ['951','952'],                   totalTax: 9.375 },
      { name: 'Sacramento',     zipPrefix: ['958'],                         totalTax: 8.75  },
      { name: 'Long Beach',     zipPrefix: ['908'],                         totalTax: 10.25 },
      { name: 'Anaheim',        zipPrefix: ['928'],                         totalTax: 7.75  },
      { name: 'Oakland',        zipPrefix: ['946'],                         totalTax: 10.25 },
      { name: 'Fremont',        zipPrefix: ['945'],                         totalTax: 10.25 },
      { name: 'Berkeley',       zipPrefix: ['947'],                         totalTax: 10.25 },
      { name: 'Hayward',                                                    totalTax: 10.75 },
      { name: 'Sunnyvale',      zipPrefix: ['940'],                         totalTax: 9.125 },
      { name: 'Santa Clara',    zipPrefix: ['950'],                         totalTax: 9.375 },
      { name: 'Mountain View',  zipPrefix: ['940'],                         totalTax: 9.125 },
      { name: 'Palo Alto',      zipPrefix: ['943'],                         totalTax: 9.125 },
      { name: 'Riverside',      zipPrefix: ['925'],                         totalTax: 8.75  },
      { name: 'Bakersfield',    zipPrefix: ['933'],                         totalTax: 8.25  },
      { name: 'Stockton',       zipPrefix: ['952'],                         totalTax: 9.0   },
      { name: 'Fresno',         zipPrefix: ['937'],                         totalTax: 8.35  },
      { name: 'Santa Monica',                                               totalTax: 10.25 },
      { name: 'Beverly Hills',                                              totalTax: 9.5   },
      { name: 'Pasadena',                                                   totalTax: 10.25 },
      { name: 'Glendale',                                                   totalTax: 10.25 },
      { name: 'Burbank',                                                    totalTax: 10.25 },
      { name: 'Torrance',                                                   totalTax: 9.5   },
    ],
  },
  {
    state: 'New York',
    stateCode: 'NY',
    baseTax: 4.0,
    cities: [
      { name: 'New York City', zipPrefix: ['100','101','102','103','104','111','112','113','114','116'], totalTax: 8.875 },
      { name: 'Buffalo',        zipPrefix: ['142'], totalTax: 8.75  },
      { name: 'Albany',         zipPrefix: ['122'], totalTax: 8.0   },
      { name: 'Yonkers',        zipPrefix: ['107'], totalTax: 8.375 },
      { name: 'Syracuse',       zipPrefix: ['132'], totalTax: 8.0   },
      { name: 'Rochester',      zipPrefix: ['146'], totalTax: 8.0   },
    ],
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    baseTax: 6.25,
    cities: [
      { name: 'Houston',       zipPrefix: ['770','771','772'], totalTax: 8.25 },
      { name: 'Dallas',        zipPrefix: ['752','753'],       totalTax: 8.25 },
      { name: 'Austin',        zipPrefix: ['787'],             totalTax: 8.25 },
      { name: 'San Antonio',   zipPrefix: ['782'],             totalTax: 8.25 },
      { name: 'Fort Worth',    zipPrefix: ['761'],             totalTax: 8.25 },
      { name: 'El Paso',       zipPrefix: ['799'],             totalTax: 8.25 },
      { name: 'Arlington',     zipPrefix: ['760'],             totalTax: 8.25 },
      { name: 'Plano',         zipPrefix: ['750'],             totalTax: 8.25 },
    ],
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    baseTax: 6.0,
    cities: [
      { name: 'Miami',         zipPrefix: ['331','332'],       totalTax: 7.0  },
      { name: 'Orlando',       zipPrefix: ['328'],             totalTax: 6.5  },
      { name: 'Tampa',         zipPrefix: ['336'],             totalTax: 7.5  },
      { name: 'Jacksonville',  zipPrefix: ['322'],             totalTax: 7.5  },
      { name: 'Fort Lauderdale', zipPrefix: ['333'],           totalTax: 7.0  },
      { name: 'Naples',        zipPrefix: ['341'],             totalTax: 6.0  },
      { name: 'Key West',      zipPrefix: ['330'],             totalTax: 7.5  },
    ],
  },
  {
    state: 'Washington',
    stateCode: 'WA',
    baseTax: 6.5,
    cities: [
      { name: 'Seattle',       zipPrefix: ['981'],             totalTax: 10.25 },
      { name: 'Bellevue',      zipPrefix: ['980'],             totalTax: 10.2  },
      { name: 'Tacoma',        zipPrefix: ['984'],             totalTax: 10.2  },
      { name: 'Spokane',       zipPrefix: ['992'],             totalTax: 8.9   },
      { name: 'Vancouver',     zipPrefix: ['986'],             totalTax: 8.5   },
      { name: 'Kirkland',                                      totalTax: 10.2  },
      { name: 'Redmond',                                       totalTax: 10.2  },
    ],
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    baseTax: 6.25,
    cities: [
      { name: 'Chicago',       zipPrefix: ['606','607','608'], totalTax: 10.25 },
      { name: 'Evanston',      zipPrefix: ['602'],             totalTax: 10.0  },
      { name: 'Naperville',    zipPrefix: ['605'],             totalTax: 8.75  },
      { name: 'Rockford',      zipPrefix: ['611'],             totalTax: 8.75  },
    ],
  },
  {
    state: 'Nevada',
    stateCode: 'NV',
    baseTax: 6.85,
    cities: [
      { name: 'Las Vegas',     zipPrefix: ['891'],             totalTax: 8.375 },
      { name: 'Henderson',     zipPrefix: ['890'],             totalTax: 8.375 },
      { name: 'Reno',          zipPrefix: ['895'],             totalTax: 8.265 },
      { name: 'North Las Vegas', zipPrefix: ['891'],           totalTax: 8.375 },
    ],
  },
  {
    state: 'Arizona',
    stateCode: 'AZ',
    baseTax: 5.6,
    cities: [
      { name: 'Phoenix',       zipPrefix: ['850','851'],       totalTax: 8.6   },
      { name: 'Tucson',        zipPrefix: ['857'],             totalTax: 8.7   },
      { name: 'Mesa',          zipPrefix: ['852'],             totalTax: 8.3   },
      { name: 'Chandler',      zipPrefix: ['852'],             totalTax: 7.8   },
      { name: 'Scottsdale',    zipPrefix: ['852'],             totalTax: 8.05  },
      { name: 'Tempe',         zipPrefix: ['852'],             totalTax: 8.1   },
    ],
  },
  {
    state: 'Massachusetts',
    stateCode: 'MA',
    baseTax: 6.25,
    cities: [
      { name: 'Boston',        zipPrefix: ['021','022'],       totalTax: 6.25  },
      { name: 'Cambridge',     zipPrefix: ['021'],             totalTax: 6.25  },
      { name: 'Worcester',     zipPrefix: ['016'],             totalTax: 6.25  },
      { name: 'Springfield',   zipPrefix: ['011'],             totalTax: 6.25  },
    ],
  },
  {
    state: 'Colorado',
    stateCode: 'CO',
    baseTax: 2.9,
    cities: [
      { name: 'Denver',        zipPrefix: ['802'],             totalTax: 8.81  },
      { name: 'Colorado Springs', zipPrefix: ['808','809'],    totalTax: 8.2   },
      { name: 'Aurora',        zipPrefix: ['800'],             totalTax: 8.0   },
      { name: 'Boulder',       zipPrefix: ['803'],             totalTax: 8.845 },
      { name: 'Fort Collins',  zipPrefix: ['805'],             totalTax: 7.55  },
    ],
  },
  { state: 'Oregon',       stateCode: 'OR', baseTax: 0,    cities: [] },
  { state: 'Montana',      stateCode: 'MT', baseTax: 0,    cities: [] },
  { state: 'New Hampshire',stateCode: 'NH', baseTax: 0,    cities: [] },
  { state: 'Delaware',     stateCode: 'DE', baseTax: 0,    cities: [] },
  {
    state: 'Hawaii',
    stateCode: 'HI',
    baseTax: 4.0,
    cities: [
      { name: 'Honolulu',      zipPrefix: ['968'],             totalTax: 4.5   },
      { name: 'Maui',          zipPrefix: ['967'],             totalTax: 4.0   },
    ],
  },
  {
    state: 'Georgia',
    stateCode: 'GA',
    baseTax: 4.0,
    cities: [
      { name: 'Atlanta',       zipPrefix: ['303'],             totalTax: 8.9   },
      { name: 'Savannah',      zipPrefix: ['314'],             totalTax: 7.0   },
      { name: 'Augusta',       zipPrefix: ['309'],             totalTax: 8.0   },
    ],
  },
  {
    state: 'Pennsylvania',
    stateCode: 'PA',
    baseTax: 6.0,
    cities: [
      { name: 'Philadelphia',  zipPrefix: ['191'],             totalTax: 8.0   },
      { name: 'Pittsburgh',    zipPrefix: ['152'],             totalTax: 7.0   },
      { name: 'Allentown',     zipPrefix: ['181'],             totalTax: 6.0   },
    ],
  },
  {
    state: 'Ohio',
    stateCode: 'OH',
    baseTax: 5.75,
    cities: [
      { name: 'Columbus',      zipPrefix: ['432'],             totalTax: 7.5   },
      { name: 'Cleveland',     zipPrefix: ['441'],             totalTax: 8.0   },
      { name: 'Cincinnati',    zipPrefix: ['452'],             totalTax: 6.5   },
    ],
  },
  {
    state: 'Michigan',
    stateCode: 'MI',
    baseTax: 6.0,
    cities: [
      { name: 'Detroit',       zipPrefix: ['482'],             totalTax: 6.0   },
      { name: 'Grand Rapids',  zipPrefix: ['495'],             totalTax: 6.0   },
      { name: 'Ann Arbor',     zipPrefix: ['481'],             totalTax: 6.0   },
    ],
  },
  {
    state: 'Minnesota',
    stateCode: 'MN',
    baseTax: 6.875,
    cities: [
      { name: 'Minneapolis',   zipPrefix: ['554'],             totalTax: 8.025 },
      { name: 'St. Paul',      zipPrefix: ['551'],             totalTax: 8.375 },
      { name: 'Duluth',        zipPrefix: ['558'],             totalTax: 8.875 },
    ],
  },
  {
    state: 'North Carolina',
    stateCode: 'NC',
    baseTax: 4.75,
    cities: [
      { name: 'Charlotte',     zipPrefix: ['282'],             totalTax: 7.25  },
      { name: 'Raleigh',       zipPrefix: ['276'],             totalTax: 7.25  },
      { name: 'Greensboro',    zipPrefix: ['274'],             totalTax: 6.75  },
    ],
  },
  {
    state: 'Virginia',
    stateCode: 'VA',
    baseTax: 4.3,
    cities: [
      { name: 'Virginia Beach', zipPrefix: ['234'],            totalTax: 6.0   },
      { name: 'Norfolk',       zipPrefix: ['235'],             totalTax: 6.0   },
      { name: 'Richmond',      zipPrefix: ['232'],             totalTax: 6.0   },
      { name: 'Arlington',     zipPrefix: ['222'],             totalTax: 6.0   },
    ],
  },
  {
    state: 'Tennessee',
    stateCode: 'TN',
    baseTax: 7.0,
    cities: [
      { name: 'Nashville',     zipPrefix: ['372'],             totalTax: 9.25  },
      { name: 'Memphis',       zipPrefix: ['381'],             totalTax: 9.75  },
      { name: 'Knoxville',     zipPrefix: ['379'],             totalTax: 9.25  },
    ],
  },
  {
    state: 'New Jersey',
    stateCode: 'NJ',
    baseTax: 6.625,
    cities: [
      { name: 'Newark',        zipPrefix: ['071'],             totalTax: 6.625 },
      { name: 'Jersey City',   zipPrefix: ['073'],             totalTax: 6.625 },
      { name: 'Atlantic City', zipPrefix: ['084'],             totalTax: 6.625 },
    ],
  },
  {
    state: 'Utah',
    stateCode: 'UT',
    baseTax: 4.85,
    cities: [
      { name: 'Salt Lake City', zipPrefix: ['841'],            totalTax: 7.75  },
      { name: 'Provo',         zipPrefix: ['846'],             totalTax: 7.25  },
      { name: 'Park City',     zipPrefix: ['840'],             totalTax: 7.05  },
      { name: 'St. George',    zipPrefix: ['847'],             totalTax: 6.75  },
    ],
  },
];

// ─────────────────────────── Helpers ───────────────────────────────────────

export const DEFAULT_TAX_RATE = 8.0;

/** Flat list of all cities across counties (for GPS matching). */
export function getAllCitiesForState(stateCode: string): CityEntry[] {
  const state = TAX_DATA.find((s) => s.stateCode === stateCode);
  if (!state) return [];
  const fromCounties = state.counties?.flatMap((c) => c.cities) ?? [];
  // Merge: counties take priority for matching
  const fromFlat = state.cities.filter(
    (fc) => !fromCounties.some((cc) => cc.name.toLowerCase() === fc.name.toLowerCase())
  );
  return [...fromCounties, ...fromFlat];
}

export function getTaxByZip(zipCode: string): { rate: number; location: string } {
  for (const state of TAX_DATA) {
    // Search county cities first
    for (const county of state.counties ?? []) {
      for (const city of county.cities) {
        if (city.zipPrefix?.some((p) => zipCode.startsWith(p))) {
          return { rate: city.totalTax, location: `${city.name}, ${state.stateCode}` };
        }
      }
    }
    // Fallback to flat list
    for (const city of state.cities) {
      if (city.zipPrefix?.some((p) => zipCode.startsWith(p))) {
        return { rate: city.totalTax, location: `${city.name}, ${state.stateCode}` };
      }
    }
  }
  return { rate: DEFAULT_TAX_RATE, location: 'Unknown Location' };
}

export function getTaxByCity(stateCode: string, cityName: string): number {
  const allCities = getAllCitiesForState(stateCode);
  const city = allCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
  if (city) return city.totalTax;
  const state = TAX_DATA.find((s) => s.stateCode === stateCode);
  return state?.baseTax ?? DEFAULT_TAX_RATE;
}

/** Match a Nominatim reverse-geocode result to the best tax entry. */
export function getTaxByGeo(params: {
  cityName?: string;
  county?: string;
  stateName?: string;
  stateCode?: string;
}): { rate: number; location: string; confidence: 'city' | 'county' | 'state' | 'default' } {
  const { cityName, county, stateName, stateCode } = params;

  const stateEntry = TAX_DATA.find(
    (s) =>
      (stateCode && s.stateCode.toLowerCase() === stateCode.toLowerCase()) ||
      (stateName && s.state.toLowerCase() === stateName.toLowerCase())
  );

  if (!stateEntry) return { rate: DEFAULT_TAX_RATE, location: 'Unknown', confidence: 'default' };

  const allCities = getAllCitiesForState(stateEntry.stateCode);
  const candidates = [cityName, county?.replace(/ county$/i, '')].filter(Boolean) as string[];

  // 1. Exact city match
  for (const name of candidates) {
    const exact = allCities.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exact) {
      return { rate: exact.totalTax, location: `${exact.name}, ${stateEntry.stateCode}`, confidence: 'city' };
    }
  }

  // 2. Partial city match
  for (const name of candidates) {
    const partial = allCities.find(
      (c) =>
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(c.name.toLowerCase())
    );
    if (partial) {
      return { rate: partial.totalTax, location: `${partial.name}, ${stateEntry.stateCode}`, confidence: 'city' };
    }
  }

  // 3. County-level match
  if (county && stateEntry.counties) {
    const countyMatch = stateEntry.counties.find(
      (co) => co.name.toLowerCase().includes(county.toLowerCase().replace(/ county$/i, ''))
    );
    if (countyMatch) {
      return {
        rate: countyMatch.countyTax,
        location: `${countyMatch.name} (unincorporated), ${stateEntry.stateCode}`,
        confidence: 'county',
      };
    }
  }

  // 4. State base rate
  return {
    rate: stateEntry.baseTax,
    location: `${stateEntry.state} (state rate)`,
    confidence: 'state',
  };
}
