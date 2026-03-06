export interface FamilyMember {
  id: string;
  kirundi: string;
  english: string;
  french: string;
  pronunciation: string;
  description: string;
  descriptionFrench: string;
  category: FamilyCategory;
  gender?: 'male' | 'female' | 'neutral';
}

export type FamilyCategory = 'immediate' | 'grandparents' | 'extended' | 'in-laws' | 'other';