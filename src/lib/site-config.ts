const messengerPage =
  process.env.NEXT_PUBLIC_MESSENGER_PAGE || "61595529898398";

export const siteConfig = {
  teamName: "Nhóm 1",
  course: "Công nghệ marketing",
  email: "bodymuse600@gmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595529898398",
  messengerUrl: `https://m.me/${encodeURIComponent(messengerPage)}`,
  slogan: "Love Your Body. Own Your Scent.",
} as const;

export function messengerLink(ref: string) {
  return `${siteConfig.messengerUrl}?ref=${encodeURIComponent(ref || "web")}`;
}
