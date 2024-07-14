export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "_lzLend()",
  description: "The best Web3 starter to win every hackathon",
  url: "http://localhost:3000",
  ogImage: "https://localhost:3000/og.png",
  links: {
    twitter: "",
  },
};
