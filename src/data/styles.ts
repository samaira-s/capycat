export interface CaptionStyle {
  id: string;
  label: string;
  tagline: string;
  iconName: string;
}

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: 'Witty',
    label: 'Witty',
    tagline: 'Clever, snappy observations',
    iconName: 'Sparkles',
  },
  {
    id: 'Sarcastic',
    label: 'Sarcastic',
    tagline: 'Dry humor & brutal honesty',
    iconName: 'Flame',
  },
  {
    id: 'Wholesome',
    label: 'Wholesome',
    tagline: 'Warm vibes & uplifting positivity',
    iconName: 'Heart',
  },
  {
    id: 'Poetic',
    label: 'Poetic',
    tagline: 'Lyrical depth & aesthetic musings',
    iconName: 'Feather',
  },
  {
    id: 'Gen-Z slang',
    label: 'Gen-Z slang',
    tagline: 'Brainrot, unhinged & no cap',
    iconName: 'Skull',
  },
  {
    id: 'Dramatic movie trailer',
    label: 'Dramatic movie trailer',
    tagline: 'Epic stakes & cinematic bass drops',
    iconName: 'Film',
  },
  {
    id: 'Instagram aesthetic',
    label: 'Instagram aesthetic',
    tagline: 'Minimalist chic, moodboard vibes',
    iconName: 'Camera',
  },
  {
    id: 'LinkedIn-cringe',
    label: 'LinkedIn-cringe',
    tagline: 'Hustle grindset & B2B thought leadership',
    iconName: 'Briefcase',
  },
];
