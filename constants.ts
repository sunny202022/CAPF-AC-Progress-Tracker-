import { Subject } from './types';

export const SYLLABUS_DATA: Subject[] = [
  {
    id: 'polity',
    name: 'Polity',
    icon: 'Scale',
    topics: [
      {
        id: 'p_day1',
        title: 'Day 1: Schedules & Preamble',
        subtopics: ['Schedules of Indian Constitution', 'Preamble Objectives', 'Keywords (Sovereign, Socialist, etc.)', 'Amendability of Preamble'],
      },
      {
        id: 'p_day2',
        title: 'Day 2: Union & Citizenship',
        subtopics: ['Union & Territory (Art 1-4)', 'States Reorganization', 'Citizenship Act 1955', 'Fundamental Duties'],
      },
      {
        id: 'p_day3',
        title: 'Day 3: Fundamental Rights I',
        subtopics: ['Right to Equality (Art 14-18)', 'Right to Freedom (Art 19-22)', 'Preventive Detention'],
      },
      {
        id: 'p_day4',
        title: 'Day 4: Fundamental Rights II',
        subtopics: ['Right against Exploitation', 'Freedom of Religion', 'Cultural & Educational Rights', 'Writs (Art 32)'],
      },
      {
        id: 'p_day5',
        title: 'Day 5: DPSP',
        subtopics: ['Socialist Principles', 'Gandhian Principles', 'Liberal-Intellectual Principles', 'Uniform Civil Code'],
      },
      {
        id: 'p_day6',
        title: 'Day 6: Union Executive',
        subtopics: ['President (Election, Powers, Veto)', 'Vice-President', 'Prime Minister', 'Council of Ministers'],
      },
      {
        id: 'p_day7',
        title: 'Day 7: Parliament',
        subtopics: ['Lok Sabha vs Rajya Sabha', 'Sessions of Parliament', 'Bills (Ordinary, Money, Finance)', 'Budget Process'],
      },
      {
        id: 'p_day8',
        title: 'Day 8: Judiciary',
        subtopics: ['Supreme Court', 'High Courts', 'Appointment of Judges', 'Judicial Review', 'PIL'],
      },
      {
        id: 'p_day9',
        title: 'Day 9: State Govt & Local Bodies',
        subtopics: ['Governor', 'State Legislature', 'Panchayati Raj (73rd Amd)', 'Municipalities (74th Amd)'],
      },
      {
        id: 'p_day10',
        title: 'Day 10: Constitutional Bodies',
        subtopics: ['Election Commission', 'UPSC/SPSC', 'Finance Commission', 'CAG', 'Attorney General'],
      },
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Scroll',
    topics: [
      {
        id: 'h_day1',
        title: 'Day 1: Ancient India',
        subtopics: ['Indus Valley Civilization', 'Vedic Age (Early & Later)', 'Buddhism & Jainism', 'Mauryan Empire', 'Gupta Period'],
      },
      {
        id: 'h_day2',
        title: 'Day 2: Medieval India',
        subtopics: ['Delhi Sultanate (Admin & Art)', 'Mughal Empire (Akbar to Aurangzeb)', 'Vijayanagar Empire', 'Bhakti & Sufi Movements'],
      },
      {
        id: 'h_day3',
        title: 'Day 3: Modern - European Advent',
        subtopics: ['Portuguese, Dutch, French, British', 'Carnatic Wars', 'Battle of Plassey & Buxar', 'Land Revenue Systems'],
      },
      {
        id: 'h_day4',
        title: 'Day 4: Revolt of 1857 & Reforms',
        subtopics: ['Causes & Failure of 1857 Revolt', 'Socio-Religious Reform Movements', 'Raja Ram Mohan Roy', 'Dayanand Saraswati'],
      },
      {
        id: 'h_day5',
        title: 'Day 5: Freedom Struggle (1885-1919)',
        subtopics: ['Formation of INC', 'Moderates vs Extremists', 'Partition of Bengal (1905)', 'Swadeshi Movement', 'Home Rule League'],
      },
      {
        id: 'h_day6',
        title: 'Day 6: Gandhian Era (1919-1947)',
        subtopics: ['Non-Cooperation Movement', 'Civil Disobedience', 'Round Table Conferences', 'Quit India Movement', 'Partition & Independence'],
      },
    ],
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    topics: [
      {
        id: 'g_day1',
        title: 'Day 1: Physical Geography',
        subtopics: ['Interior of Earth', 'Plate Tectonics', 'Earthquakes & Volcanoes', 'Rock System', 'Landforms'],
      },
      {
        id: 'g_day2',
        title: 'Day 2: Climatology',
        subtopics: ['Structure of Atmosphere', 'Insolation & Heat Budget', 'Pressure Belts & Winds', 'Cyclones (Tropical/Temperate)', 'Clouds & Precipitation'],
      },
      {
        id: 'g_day3',
        title: 'Day 3: Oceanography',
        subtopics: ['Ocean Floor Relief', 'Temperature & Salinity', 'Ocean Currents', 'Tides & Coral Reefs'],
      },
      {
        id: 'g_day4',
        title: 'Day 4: Indian Geography I',
        subtopics: ['Physiography of India', 'Himalayas', 'Northern Plains', 'Peninsular Plateau', 'Coastal Plains'],
      },
      {
        id: 'g_day5',
        title: 'Day 5: Indian Geography II',
        subtopics: ['Drainage System (Rivers)', 'Monsoon Mechanism', 'Soils of India', 'Natural Vegetation', 'Agriculture & Irrigation'],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Atom',
    topics: [
      {
        id: 's_day1',
        title: 'Day 1: Physics I',
        subtopics: ['Units & Measurements', 'Motion & Laws of Motion', 'Work, Energy, Power', 'Gravitation'],
      },
      {
        id: 's_day2',
        title: 'Day 2: Physics II',
        subtopics: ['Light (Reflection/Refraction)', 'Human Eye', 'Electricity & Magnetism', 'Sound & Waves'],
      },
      {
        id: 's_day3',
        title: 'Day 3: Chemistry I',
        subtopics: ['Matter & States', 'Atoms & Molecules', 'Structure of Atom', 'Chemical Reactions & Equations'],
      },
      {
        id: 's_day4',
        title: 'Day 4: Chemistry II',
        subtopics: ['Acids, Bases, Salts', 'Metals & Non-Metals', 'Carbon & Compounds', 'Periodic Table'],
      },
      {
        id: 's_day5',
        title: 'Day 5: Biology I',
        subtopics: ['Cell Structure', 'Tissues', 'Nutrition (Plants/Animals)', 'Digestive & Respiratory Systems'],
      },
      {
        id: 's_day6',
        title: 'Day 6: Biology II',
        subtopics: ['Circulatory System', 'Excretion', 'Control & Coordination', 'Reproduction', 'Heredity & Evolution'],
      },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: 'TrendingUp',
    topics: [
      {
        id: 'e_day1',
        title: 'Day 1: Macro Economics',
        subtopics: ['National Income (GDP, GNP)', 'Inflation (Types, Causes)', 'Monetary Policy (RBI)', 'Fiscal Policy (Budget)'],
      },
      {
        id: 'e_day2',
        title: 'Day 2: Banking & External',
        subtopics: ['Banking System in India', 'Money Market vs Capital Market', 'Balance of Payments', 'Forex & Exchange Rates'],
      },
      {
        id: 'e_day3',
        title: 'Day 3: Sectors & Schemes',
        subtopics: ['Agriculture & Green Revolution', 'Industrial Policies', 'Poverty & Unemployment', 'Govt Schemes'],
      },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'Leaf',
    topics: [
      {
        id: 'env_day1',
        title: 'Day 1: Ecology',
        subtopics: ['Ecosystem Structure', 'Food Chain & Food Web', 'Ecological Pyramids', 'Biogeochemical Cycles'],
      },
      {
        id: 'env_day2',
        title: 'Day 2: Biodiversity',
        subtopics: ['Biodiversity Hotspots', 'IUCN Red List', 'National Parks & Wildlife Sanctuaries', 'Biosphere Reserves'],
      },
      {
        id: 'env_day3',
        title: 'Day 3: Issues & Acts',
        subtopics: ['Climate Change & Global Warming', 'Ozone Depletion', 'Pollution (Air, Water, Noise)', 'Environmental Acts (Wildlife Protection, etc.)'],
      },
    ],
  },
  {
    id: 'aptitude',
    name: 'Maths & Reasoning',
    icon: 'Calculator',
    topics: [
      {
        id: 'apt_day1',
        title: 'Day 1: Quantitative I',
        subtopics: ['Number System', 'HCF & LCM', 'Average', 'Percentage', 'Profit & Loss'],
      },
      {
        id: 'apt_day2',
        title: 'Day 2: Quantitative II',
        subtopics: ['Ratio & Proportion', 'Time & Work', 'Time, Speed, Distance', 'Simple & Compound Interest'],
      },
      {
        id: 'apt_day3',
        title: 'Day 3: Reasoning',
        subtopics: ['Series Completion', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Clocks & Calendars'],
      },
    ],
  },
];