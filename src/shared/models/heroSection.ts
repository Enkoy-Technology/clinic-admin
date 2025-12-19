interface HeroSection {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

export type { HeroSection };
