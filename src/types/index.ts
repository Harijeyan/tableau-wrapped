export interface TableauProfile {
  name: string;
  profileName: string;
  title: string;
  organization: string;
  avatarUrl: string;
  totalFollowers: number;
  totalFollowing: number;
  joinDate: number;
}

export interface TableauStats {
  profile: {
    name: string;
    title: string;
    avatarUrl: string;
    totalFollowers: number;
    totalFollowing: number;
    joinDate: number | null;
  };
  stats: {
    totalWorkbooks: number;
    totalViews: number;
    totalFavorites: number;
    yearsOnPlatform: number;
    monthsOnPlatform: number;
    daysOnPlatform: number;
  };
}

export type { DataType };
