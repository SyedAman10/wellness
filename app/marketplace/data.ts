export type Product = {
  id: string;
  name: string;
  price: number;
  cat: string;
  blurb: string;
  hue: number;
  tag?: string;
  size?: string;
  img?: string;
};

export type CartItem = Product & { qty: number };

export type User = { name: string; email: string };

export type Testimonial = { quote: string; name: string; loc: string };

export const PRODUCTS: Product[] = [
  {
    id: "ayahoney",
    name: "AyaHoney",
    price: 25,
    cat: "Edibles",
    tag: "Bestseller",
    size: "4 oz",
    blurb: "For tea, toast, coffee or smoothies. Not for children under 2 y/o.",
    hue: 42,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQwNjQ1LCJwdXIiOiJibG9iX2lkIn19--58641b41a8ae8a255bff532e7572a09c30975a19/image_picker_E3C3EE3F-3FA4-4C45-AC8E-7277C286692F-17286-00000520F9B60931.jpg",
  },
  {
    id: "kit",
    name: "AyaCaapi Kit",
    price: 30,
    cat: "Kits",
    blurb: "The Smokers Kit — 5 gm of Peruvian AyaCaapi Vine. Great to top tobacco or smokable herbs.",
    hue: 150,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExNDE5LCJwdXIiOiJibG9iX2lkIn19--6f19a44aceac7173464dccc79006d9b821eb01cb/image_picker_B8CD9A02-CD3B-4233-845D-6FCC91DC05C0-6853-000001B07BFE3DCC.jpg",
  },
  {
    id: "oil",
    name: "AyaCaapi Ascension Oil",
    price: 50,
    cat: "Oils & Vape",
    size: "Large",
    blurb: "AyaCaapi, jojoba oil, coconut oil, Vit E & essential oils. Great for meditation or stress reduction — apply liberally to the forehead.",
    hue: 28,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExMzgxLCJwdXIiOiJibG9iX2lkIn19--eb9b4ce230472513b2a0635add07a9f3405c23e8/image_picker_BD743683-B909-4396-9564-0D6DD65A2954-6853-000001AC37202C9B.jpg",
  },
  {
    id: "microdose",
    name: "30-Day Caapi Microdose",
    price: 50,
    cat: "Microdose",
    tag: "Guided",
    blurb: "A measured, month-long Caapi microdose journey with daily portions.",
    hue: 130,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExMzYyLCJwdXIiOiJibG9iX2lkIn19--34fe2701c3f29a49777fa822ac6b59b6c9b1076f/image_picker_37F551F0-186F-449B-87D9-1061E83D552A-6853-000001AAC40E3756.jpg",
  },
  {
    id: "candy",
    name: "Caapi Candy",
    price: 20,
    cat: "Edibles",
    blurb: "Caapi cooked into organic Texas clover honey. Vegan and delicious.",
    hue: 8,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExMzY4LCJwdXIiOiJibG9iX2lkIn19--5925aa867aff3ceecbce5d508bec8ae839d874fc/image_picker_D068F397-7491-4080-864D-94843D9B82A2-6853-000001AB30F85502.jpg",
  },
  {
    id: "vape",
    name: "AyaCaapi Vape Juice",
    price: 35,
    cat: "Oils & Vape",
    blurb: "Light, loving and effective. Just add to your own vape mod!",
    hue: 170,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExNDAyLCJwdXIiOiJibG9iX2lkIn19--977f4f058af0e0abcf8d471e145bd7fcd7a63508/image_picker_C3BC3255-E2B1-492D-8967-CE06262FF8B8-6853-000001AE8CD3F7B8.jpg",
  },
  {
    id: "flower",
    name: "AyaCaapi Fruit & Honey Flower",
    price: 10,
    cat: "Edibles",
    blurb: "Caapi honey heated and drizzled on dehydrated fruit (mango or apple). Fun, yummy and chewy!",
    hue: 48,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExNDEyLCJwdXIiOiJibG9iX2lkIn19--cd0e8286cac0ac82a8ae11b51503888e95a8377c/image_picker_8E8634CA-F19A-4173-B7FA-A8D098A3F8C5-6853-000001AF8A4BEBE1.jpg",
  },
  {
    id: "suckers",
    name: "AyaHoney Suckers",
    price: 7,
    cat: "Edibles",
    blurb: "Caapi-infused honey suckers — a sweet, soothing way to enjoy Grandmother Vine on the go.",
    hue: 36,
    img: "https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExNDI3LCJwdXIiOiJibG9iX2lkIn19--94e4576708665c0378b848cd69c84dd630d4ec52/image_picker_F5906B34-1410-4D61-893C-72225AE90570-6853-000001B1DAF0B9D8.jpg",
  },
];

export const CATEGORIES = ["All", "Kits", "Oils & Vape", "Edibles", "Microdose"];

export const TESTIMONIALS: Testimonial[] = [
  { quote: "The reverence here is real. From sourcing to the note tucked in the box, it felt like care — not commerce.", name: "Marisol R.", loc: "Austin, TX" },
  { quote: "I appreciated the clear safety guidance most. Honest, grounded, and never pushy about it.", name: "Devon L.", loc: "Santa Fe, NM" },
  { quote: "My microdose month gave me a steadiness I hadn’t felt in years. The integration notes made all the difference.", name: "Priya N.", loc: "Portland, OR" },
];

export const fmt = (n: number) => "$" + n.toFixed(2);
