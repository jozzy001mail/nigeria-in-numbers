// Nigeria in Numbers — data layer.
// Every figure carries its source and year. Figures are public official
// statistics; see the Sources page in the app for the full citations.
// All numbers below are the values as published by the named source.

export const HEADLINES = [
  { key: 'population', label: 'Population', value: '232.7m', note: '2024 estimate', source: 'UN World Population Prospects 2024', year: 2024 },
  { key: 'gdp', label: 'GDP (nominal)', value: '$187.8bn', note: 'current US$', source: 'World Bank, World Development Indicators', year: 2024 },
  { key: 'gdpCapita', label: 'GDP per capita', value: '$807', note: 'current US$', source: 'World Bank, World Development Indicators', year: 2024 },
  { key: 'growth', label: 'Real GDP growth', value: '3.4%', note: 'year-on-year', source: 'National Bureau of Statistics (NBS)', year: 2024 },
  { key: 'inflation', label: 'CPI inflation (avg)', value: '33.2%', note: 'annual average', source: 'National Bureau of Statistics (NBS)', year: 2024 },
  { key: 'unemployment', label: 'Unemployment rate', value: '4.3%', note: 'Q2, new methodology', source: 'National Bureau of Statistics (NBS)', year: 2024 },
  { key: 'lifeExpectancy', label: 'Life expectancy at birth', value: '52.7 years', note: 'both sexes', source: 'World Bank, World Development Indicators', year: 2023 },
  { key: 'hdi', label: 'Human Development Index', value: '0.548', note: 'medium human development', source: 'UNDP Human Development Report', year: 2023 },
  { key: 'poverty', label: 'Poverty headcount', value: '40.1%', note: 'national poverty line', source: 'National Bureau of Statistics (NBS)', year: 2019 },
];

// Nominal GDP, current US$ billions (World Bank WDI).
export const GDP_SERIES = [
  { year: 2015, gdp: 493.0 }, { year: 2016, gdp: 404.6 },
  { year: 2017, gdp: 375.7 }, { year: 2018, gdp: 421.7 },
  { year: 2019, gdp: 448.1 }, { year: 2020, gdp: 432.3 },
  { year: 2021, gdp: 440.8 }, { year: 2022, gdp: 472.6 },
  { year: 2023, gdp: 363.8 }, { year: 2024, gdp: 187.8 },
];

// Real GDP growth, % year-on-year (NBS).
export const GROWTH_SERIES = [
  { year: 2015, v: 2.7 }, { year: 2016, v: -1.6 },
  { year: 2017, v: 0.8 }, { year: 2018, v: 1.9 },
  { year: 2019, v: 2.2 }, { year: 2020, v: -1.8 },
  { year: 2021, v: 3.6 }, { year: 2022, v: 3.3 },
  { year: 2023, v: 2.9 }, { year: 2024, v: 3.4 },
];

// GDP per capita, current US$ (World Bank WDI).
export const GDP_CAPITA_SERIES = [
  { year: 2015, v: 2700 }, { year: 2016, v: 2169 },
  { year: 2017, v: 1971 }, { year: 2018, v: 2163 },
  { year: 2019, v: 2246 }, { year: 2020, v: 2118 },
  { year: 2021, v: 2113 }, { year: 2022, v: 2216 },
  { year: 2023, v: 1670 }, { year: 2024, v: 807 },
];

// CPI inflation, annual average % (NBS).
export const CPI_SERIES = [
  { year: 2015, v: 9.0 }, { year: 2016, v: 15.7 },
  { year: 2017, v: 16.5 }, { year: 2018, v: 12.1 },
  { year: 2019, v: 11.4 }, { year: 2020, v: 13.2 },
  { year: 2021, v: 17.0 }, { year: 2022, v: 18.8 },
  { year: 2023, v: 24.7 }, { year: 2024, v: 33.2 },
];

// CPI index (2015 = 100), chained from the annual-average inflation rates above.
export const CPI_INDEX = (() => {
  let idx = 100;
  return CPI_SERIES.map((d) => {
    if (d.year !== 2015) idx = idx * (1 + d.v / 100);
    return { year: d.year, index: Math.round(idx * 10) / 10 };
  });
})();

// Population, millions (UN WPP 2024 medium estimate).
export const POP_SERIES = [
  { year: 2015, v: 183.5 }, { year: 2016, v: 188.7 },
  { year: 2017, v: 194.0 }, { year: 2018, v: 199.4 },
  { year: 2019, v: 204.9 }, { year: 2020, v: 210.6 },
  { year: 2021, v: 216.3 }, { year: 2022, v: 222.2 },
  { year: 2023, v: 227.9 }, { year: 2024, v: 232.7 },
];

// 2006 Population Census, National Population Commission (NPC).
// Population in persons; zones are the six geopolitical zones.
export const STATES = [
  { name: 'Abia', zone: 'South East', pop: 2845380, capital: 'Umuahia' },
  { name: 'Adamawa', zone: 'North East', pop: 3178950, capital: 'Yola' },
  { name: 'Akwa Ibom', zone: 'South South', pop: 3902051, capital: 'Uyo' },
  { name: 'Anambra', zone: 'South East', pop: 4177828, capital: 'Awka' },
  { name: 'Bauchi', zone: 'North East', pop: 4653066, capital: 'Bauchi' },
  { name: 'Bayelsa', zone: 'South South', pop: 1704515, capital: 'Yenagoa' },
  { name: 'Benue', zone: 'North Central', pop: 4253641, capital: 'Makurdi' },
  { name: 'Borno', zone: 'North East', pop: 4171104, capital: 'Maiduguri' },
  { name: 'Cross River', zone: 'South South', pop: 2892988, capital: 'Calabar' },
  { name: 'Delta', zone: 'South South', pop: 4112445, capital: 'Asaba' },
  { name: 'Ebonyi', zone: 'South East', pop: 2176947, capital: 'Abakaliki' },
  { name: 'Edo', zone: 'South South', pop: 3233366, capital: 'Benin City' },
  { name: 'Ekiti', zone: 'South West', pop: 2398957, capital: 'Ado-Ekiti' },
  { name: 'Enugu', zone: 'South East', pop: 3267837, capital: 'Enugu' },
  { name: 'Gombe', zone: 'North East', pop: 2365040, capital: 'Gombe' },
  { name: 'Imo', zone: 'South East', pop: 3927563, capital: 'Owerri' },
  { name: 'Jigawa', zone: 'North West', pop: 4361002, capital: 'Dutse' },
  { name: 'Kaduna', zone: 'North West', pop: 6113503, capital: 'Kaduna' },
  { name: 'Kano', zone: 'North West', pop: 9401288, capital: 'Kano' },
  { name: 'Katsina', zone: 'North West', pop: 5801584, capital: 'Katsina' },
  { name: 'Kebbi', zone: 'North West', pop: 3256541, capital: 'Birnin Kebbi' },
  { name: 'Kogi', zone: 'North Central', pop: 3314043, capital: 'Lokoja' },
  { name: 'Kwara', zone: 'North Central', pop: 2365353, capital: 'Ilorin' },
  { name: 'Lagos', zone: 'South West', pop: 9113605, capital: 'Ikeja' },
  { name: 'Nasarawa', zone: 'North Central', pop: 1869377, capital: 'Lafia' },
  { name: 'Niger', zone: 'North Central', pop: 3954772, capital: 'Minna' },
  { name: 'Ogun', zone: 'South West', pop: 3751140, capital: 'Abeokuta' },
  { name: 'Ondo', zone: 'South West', pop: 3460877, capital: 'Akure' },
  { name: 'Osun', zone: 'South West', pop: 3416959, capital: 'Osogbo' },
  { name: 'Oyo', zone: 'South West', pop: 5580894, capital: 'Ibadan' },
  { name: 'Plateau', zone: 'North Central', pop: 3206531, capital: 'Jos' },
  { name: 'Rivers', zone: 'South South', pop: 5198716, capital: 'Port Harcourt' },
  { name: 'Sokoto', zone: 'North West', pop: 3702676, capital: 'Sokoto' },
  { name: 'Taraba', zone: 'North East', pop: 2294800, capital: 'Jalingo' },
  { name: 'Yobe', zone: 'North East', pop: 2321339, capital: 'Damaturu' },
  { name: 'Zamfara', zone: 'North West', pop: 3278873, capital: 'Gusau' },
  { name: 'FCT Abuja', zone: 'North Central', pop: 1406239, capital: 'Abuja' },
];

export const ZONES = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'];

// CPI basket weights (NBS CPI weights, % of the basket, selected divisions).
export const BASKET = [
  { item: 'Food & non-alcoholic beverages', weight: 51.8 },
  { item: 'Housing, water, electricity, gas', weight: 16.7 },
  { item: 'Transport', weight: 6.5 },
  { item: 'Clothing & footwear', weight: 7.7 },
  { item: 'Education', weight: 3.9 },
  { item: 'Health', weight: 3.0 },
  { item: 'Communication', weight: 0.7 },
  { item: 'Recreation & culture', weight: 0.7 },
  { item: 'Restaurants & hotels', weight: 1.2 },
  { item: 'Other goods & services', weight: 7.8 },
];

export const SOURCES = [
  { org: 'National Bureau of Statistics (NBS)', what: 'CPI inflation, real GDP growth, unemployment, poverty headcount', url: 'https://www.nigerianstat.gov.ng', note: 'Nigeria\u2019s official statistics office.' },
  { org: 'World Bank — World Development Indicators', what: 'Nominal GDP, GDP per capita, life expectancy, population', url: 'https://data.worldbank.org/country/nigeria', note: 'Annual country indicators.' },
  { org: 'United Nations — World Population Prospects 2024', what: 'Population estimates 2015\u20132024', url: 'https://population.un.org/wpp/', note: 'UN medium-variant estimates.' },
  { org: 'National Population Commission (NPC)', what: '2006 Population Census state figures', url: 'https://nationalpopulation.gov.ng', note: 'Nigeria\u2019s most recent completed census.' },
  { org: 'UNDP — Human Development Report 2023/24', what: 'Human Development Index 0.548', url: 'https://hdr.undp.org', note: 'HDI for Nigeria, 2023.' },
];

export function fmtPop(n) {
  return (n / 1e6).toFixed(2) + 'm';
}

export function shareOfTotal(state) {
  const total = STATES.reduce((s, x) => s + x.pop, 0);
  return ((state.pop / total) * 100).toFixed(1) + '%';
}

export function censusTotal() {
  return STATES.reduce((s, x) => s + x.pop, 0);
}
