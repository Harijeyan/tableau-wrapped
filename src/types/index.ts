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
    profileName: string;
    title: string;
    organization: string;
    avatarUrl: string;
    totalFollowers: number;
    totalFollowing: number;
    joinDate: number;
  };
  stats: {
    yearsOnPlatform: number;
    monthsOnPlatform: number;
    daysOnPlatform: number;
    totalWorkbooks: number;
    totalViews: number;
    totalFavorites: number;
  };
  generatedAt: string;
}
