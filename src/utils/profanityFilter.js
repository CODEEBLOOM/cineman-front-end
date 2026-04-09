import { Filter } from 'bad-words';

const CHARACTER_SUBSTITUTIONS = {
  '@': 'a',
  '$': 's',
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
};

const CUSTOM_PROFANITY_TERMS = [
  // ===== VIỆT NAM =====
  'dit', 'dit me', 'ditme', 'dit mẹ', 'địt', 'địt mẹ', 'đjt', 'dj t',
  'du ma', 'duma', 'đụ', 'đụ má', 'đm', 'dcm', 'dm', 'dm me', 'dm mẹ',
  'vl', 'vcl', 'vkl', 'vloz', 'vcc',
  'vai lon', 'vai lol', 'vai loz',
  'lon', 'lồn', 'loz', 'lol', 'l0n',
  'lon mat', 'lồn mặt',
  'cai lon', 'cái lồn',
  'con cac', 'cặc', 'cak', 'cac', 'c4c', 'c*c',
  'buoi', 'buồi', 'bưởi',
  'cc', 'cl',
  'oc cho', 'óc chó',
  'ngu', 'ngu lol', 'ngu vl',
  'thang cho', 'thằng chó',
  'con cho', 'con chó',
  'me may', 'mẹ mày', 'mày',
  'bo may', 'bố mày',
  'an cut', 'ăn cứt', 'cut', 'cứt',
  'djt', 'd1t', 'd!t',
  'l0z', 'l*z', 'l.o.l',
  'c.u.t', 'c_ut', 'Con cặt', 'con c?t','con kẹt',

  // ===== ENGLISH =====
  'fuck', 'fck', 'fuk', 'f*ck', 'f**k',
  'shit', 'sh!t', 'sht', 'sh*t',
  'bitch', 'b!tch', 'btch',
  'asshole', 'a$$hole', 'ass',
  'bastard', 'bstrd',
  'dick', 'd!ck',
  'pussy', 'pusy', 'p*ssy',
  'cock', 'c0ck',
  'motherfucker', 'mf', 'mfer',
  'wtf', 'wth',
  'slut',
  'whore',
  'damn', 'd4mn',
  'hell',
  'retard',
  'idiot', 'stupid',
  'dumbass',
  'jackass',

  // ===== MIX / LÁCH LUẬT =====
  'dmk', 'dmm', 'dmmm',
  'vlon', 'vlonz',
  'cccd', // hay spam troll
  'lmao', // tùy ngữ cảnh (có thể giữ hoặc không)
  'fml',
  'fukc', 'fucc', 'fu*k',
  'shiit', 'shiiit',
  'b1tch',
  '4ss',
  'a55',
];

const normalizeProfanityInput = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\u0111/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(
      /[@$0134578!]/g,
      (character) => CHARACTER_SUBSTITUTIONS[character] || character
    )
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const uniqueTerms = Array.from(
  new Set(
    CUSTOM_PROFANITY_TERMS.map((term) => normalizeProfanityInput(term)).filter(
      Boolean
    )
  )
);

const defaultFilter = new Filter();
const normalizedFilter = new Filter({ emptyList: true });
const compactFilter = new Filter({ emptyList: true });
const compactTerms = [
  'ditme',
  'duma',
  'dmme',
  'dcm',
  'vcl',
  'vkl',
  'vloz',
  'vailon',
  'cailon',
  'lonmat',
  'concac',
];

normalizedFilter.addWords(...uniqueTerms);
compactFilter.addWords(...compactTerms);

export const containsProfanity = (value) => {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return false;
  }

  const normalizedValue = normalizeProfanityInput(rawValue);
  const compactValue = normalizedValue.replace(/\s+/g, '');

  return (
    defaultFilter.isProfane(rawValue) ||
    normalizedFilter.isProfane(normalizedValue) ||
    compactFilter.isProfane(compactValue)
  );
};
