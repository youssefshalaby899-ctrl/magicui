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
} as const

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMAGES = {
  hero: img("1554118811-1e0d58224f24", 2200),
  interior: img("1514933651103-005eec06c04b"),
  dining: img("1414235077428-338989a2e8c0"),
  bar: img("1470337458703-46ad1756a187"),
  coffee: img("1509042239860-f550ce710b93"),
}

export type MenuItem = {
  name: string
  desc: string
  price: string
  image: string
  tag?: string
}

export const MENU: Record<string, MenuItem[]> = {
  Kitchen: [
    {
      name: "Calypso Grilled Platter",
      desc: "Char-grilled cuts, smoked garlic butter, warm bread & house salads.",
      price: "EGP 420",
      image: img("1555939594-58d7cb561ad1", 900),
      tag: "House signature",
    },
    {
      name: "Slow Pasta al Pomodoro",
      desc: "Hand-torn basil, rich tomato sugo, aged parmesan, olive oil.",
      price: "EGP 240",
      image: img("1473093295043-cdd812d0e601", 900),
    },
    {
      name: "The Calypso Burger",
      desc: "Smashed beef, cheddar, pickles & secret sauce in a toasted brioche.",
      price: "EGP 285",
      image: img("1568901346375-23c9450c58cd", 900),
      tag: "Most loved",
    },
    {
      name: "Garden Bowl",
      desc: "Seasonal greens, grains, avocado & citrus-herb dressing.",
      price: "EGP 210",
      image: img("1540189549336-e6e99c629fe0", 900),
    },
  ],
  Café: [
    {
      name: "Signature Espresso Bar",
      desc: "Single-origin beans, pulled slow — cortado, flat white or classic espresso.",
      price: "from EGP 70",
      image: img("1509042239860-f550ce710b93", 900),
      tag: "House signature",
    },
    {
      name: "Iced Spanish Latte",
      desc: "Double shot, cold milk & a whisper of condensed sweetness over ice.",
      price: "EGP 110",
      image: img("1495474472287-4d71bcdd2085", 900),
    },
    {
      name: "Honeycomb Pancakes",
      desc: "Fluffy stack, honeycomb butter, berries & maple drizzle.",
      price: "EGP 195",
      image: img("1567620905732-2d1ec7ab7445", 900),
    },
    {
      name: "Midnight Dessert",
      desc: "Dark chocolate, sea salt & cream — the table always shares one more.",
      price: "EGP 165",
      image: img("1551024506-0bccd828d307", 900),
      tag: "After dinner",
    },
  ],
  "Drinks & Shisha": [
    {
      name: "Sunset Mocktails",
      desc: "Fresh citrus, herbs & sparkling botanicals, mixed to order at the bar.",
      price: "from EGP 120",
      image: img("1514362545857-3bc16c4c7d1b", 900),
      tag: "Golden hour",
    },
    {
      name: "Fresh-Brewed Classics",
      desc: "Mint tea, Turkish coffee & seasonal fresh juices, served the slow way.",
      price: "from EGP 60",
      image: img("1546069901-baacef7a0c4d", 900),
    },
    {
      name: "Premium Shisha",
      desc: "Your favourite blends, prepared tableside — best enjoyed outdoors, unhurried.",
      price: "Ask your host",
      image: img("1470337458703-46ad1756a187", 900),
      tag: "Outdoor terrace",
    },
    {
      name: "Pizza, Fired Fresh",
      desc: "Blistered crust, fior di latte & toppings straight from the kitchen pass.",
      price: "from EGP 230",
      image: img("1513104890138-7c749659a591", 900),
    },
  ],
}

export const GALLERY = [
  {
    src: IMAGES.hero,
    alt: "Warm café interior with guests relaxing",
    caption: "The room, as evening settles in",
  },
  {
    src: IMAGES.dining,
    alt: "Elegant table setting at Calypso",
    caption: "Dinner, served without hurry",
  },
  {
    src: IMAGES.bar,
    alt: "Calypso bar at night",
    caption: "Drinks & conversation at the bar",
  },
  {
    src: IMAGES.interior,
    alt: "Restaurant interior with warm lighting",
    caption: "Homey corners, friendly faces",
  },
  {
    src: IMAGES.coffee,
    alt: "Freshly brewed coffee being poured",
    caption: "First pour of the day",
  },
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
