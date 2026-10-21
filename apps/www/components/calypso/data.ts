export const CALYPSO = {
  name: "Calypso",
  tagline: "Café & Restaurant — Cairo",
  phoneDisplay: "+20 10 0268 3835",
  phoneHref: "tel:+201002683835",
  email: "calypsocafeegypt@gmail.com",
  address: "Chill Out, El Kafrawi Axis, Cairo, Egypt",
  maps: "https://www.google.com/maps/search/?api=1&query=Chill+Out+El+Kafrawi+Axis+Cairo+Egypt",
  facebook: "https://www.facebook.com/Calypso.egypt/",
  instagram: "https://www.instagram.com/calypso.egypt",
  whatsapp: "https://wa.me/201002683835?text=Hello%20Calypso!",
} as const

/** Every verified public account for Calypso Egypt (from their FB/IG pages). */
export const SOCIALS = [
  {
    label: "Instagram",
    handle: "@calypso.egypt",
    href: CALYPSO.instagram,
    icon: "instagram",
  },
  {
    label: "Facebook",
    handle: "Calypso Café and Restaurant",
    href: CALYPSO.facebook,
    icon: "facebook",
  },
  {
    label: "WhatsApp",
    handle: CALYPSO.phoneDisplay,
    href: CALYPSO.whatsapp,
    icon: "whatsapp",
  },
] as const

/**
 * The real Calypso menu (print.pdf, shared by the owner via Google Drive).
 * Served from Drive so the site never carries the 48 MB print file:
 * `preview` is Google Drive's embeddable viewer, `view`/`download` are
 * the visitor-facing open & save links.
 */
export const MENU_PDF = {
  fileId: "1OvX0V3D_4u6cX1gFOc67zONf-nkqI7Cq",
  view: "https://drive.google.com/file/d/1OvX0V3D_4u6cX1gFOc67zONf-nkqI7Cq/view?usp=drivesdk",
  preview:
    "https://drive.google.com/file/d/1OvX0V3D_4u6cX1gFOc67zONf-nkqI7Cq/preview",
  download:
    "https://drive.google.com/uc?id=1OvX0V3D_4u6cX1gFOc67zONf-nkqI7Cq&export=download",
} as const

const photo = (name: string) => `/calypso-preview/photos/${name}`

export const IMAGES = {
  hero: photo("storefront-night.jpg"),
  storefront: photo("storefront-day.jpg"),
  brownie: photo("brownie.jpg"),
}

export type MenuItem = {
  name: string
  desc: string
  price: string
  image: string
  tag?: string
}

const SEE_MENU = "See full menu"

export const MENU: Record<string, MenuItem[]> = {
  Kitchen: [
    { name: "Beef Skillet, Rice & Fries", desc: "Slow-cooked beef in a creamy mushroom sauce, rosemary, rice & golden fries.", price: SEE_MENU, image: photo("beef-skillet.jpg"), tag: "House favourite" },
    { name: "Spaghetti Bolognese", desc: "Rich beef ragù over spaghetti, garlic toast & fresh parsley.", price: SEE_MENU, image: photo("bolognese.jpg") },
    { name: "Creamy Penne & Crispy Chicken", desc: "Penne in white sauce with crispy chicken under melted cheese sauce.", price: SEE_MENU, image: photo("penne-chicken.jpg"), tag: "Most loved" },
    { name: "Chicken Mushroom", desc: "Our famous chicken mushroom — the dish ordered every single day, with fries.", price: SEE_MENU, image: photo("chicken-mushroom.jpg"), tag: "Signature" },
  ],
  "Café & Bakery": [
    { name: "Croissants & Lattes for Two", desc: "Flaky butter croissants with two lattes and latte art — the Calypso morning.", price: SEE_MENU, image: photo("croissant-coffee.jpg"), tag: "Morning ritual" },
    { name: "Cookies, Croissant & Coffee", desc: "Chocolate-chip cookies and a fresh croissant next to your coffee.", price: SEE_MENU, image: photo("cookies-coffee.jpg") },
    { name: "Penne Arrabbiata & Burger", desc: "Spicy tomato penne with garlic bread, and our burger waiting behind it.", price: SEE_MENU, image: photo("penne-burger.jpg"), tag: "For sharing" },
  ],
  Desserts: [
    { name: "Chocolate Brownie & Ice Cream", desc: "Warm chocolate brownie, vanilla ice cream and a glossy chocolate pour.", price: SEE_MENU, image: photo("brownie.jpg"), tag: "House signature" },
    { name: "Berry Cheesecake", desc: "Baked cheesecake drowned in warm berry sauce, poured at the table.", price: SEE_MENU, image: photo("cheesecake.jpg"), tag: "Poured tableside" },
    { name: "Chocolate-Chip Cookies", desc: "Fresh-baked, loaded with chocolate chips — best with a cappuccino.", price: SEE_MENU, image: photo("cookies-coffee.jpg"), tag: "Fresh from the oven" },
  ],
}

export const GALLERY = [
  { src: photo("storefront-night.jpg"), alt: "Calypso Café & Restaurant at night, fully lit", caption: "Calypso after dark — now opened" },
  { src: photo("storefront-day.jpg"), alt: "Calypso storefront and sunny terrace by day", caption: "The terrace, in the Cairo sun" },
  { src: photo("brownie.jpg"), alt: "Chocolate brownie with ice cream and chocolate sauce", caption: "Something sweet to finish" },
  { src: photo("cheesecake.jpg"), alt: "Berry sauce being poured over cheesecake", caption: "Berry cheesecake, poured live" },
  { src: photo("croissant-coffee.jpg"), alt: "Croissants and lattes on a wooden table, from above", caption: "Slow mornings, done right" },
  { src: photo("chicken-mushroom.jpg"), alt: "Chicken Mushroom with fries", caption: "Chicken Mushroom — ordered every day" },
]

export const TESTIMONIALS = [
  {
    quote:
      "You feel the homey, friendly atmosphere the moment you step in — and you never want to leave.",
    name: "A regular, Cairo",
  },
  {
    quote:
      "A meal, a drink, shisha with friends — Calypso is where our evenings naturally end up.",
    name: "Weekend guest",
  },
  {
    quote:
      "Unhurried service, generous plates and a terrace made for long conversations.",
    name: "First-time visitor",
  },
]
