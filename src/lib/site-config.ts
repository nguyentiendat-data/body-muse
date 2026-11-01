export const siteConfig = {
  teamName: "Nhóm 1",
  course: "Công nghệ marketing",
  email: "bodymuse600@gmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595529898398",
  messengerUrl: "https://m.me/61595529898398",
  slogan: "Love Your Body. Own Your Scent.",
} as const;

export function messengerLink(ref: string) {
  return `${siteConfig.messengerUrl}?ref=${encodeURIComponent(ref || "web")}`;
}
