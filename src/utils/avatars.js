export const AVATAR_SEEDS = [
  "coder",
  "javadev",
  "bytewise",
  "loopmaster",
  "stackpro",
  "nullpointer",
  "helloworld",
  "runtime",
  "debugger",
  "compiler",
  "lambda",
  "recursion",
  "algorithm",
  "boolean",
  "integer",
  "classmethod",
  "interface",
  "abstract",
  "polymorphic",
  "inherited",
];

export const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;

export const buildAvatarCatalog = (googlePhotoUrl = null) => {
  const dicebearAvatars = AVATAR_SEEDS.map((seed) => ({
    id: seed,
    url: getAvatarUrl(seed),
    label: null,
  }));

  // Si tiene foto de Google, la agrega al inicio con etiqueta especial
  if (googlePhotoUrl) {
    return [
      { id: "google", url: googlePhotoUrl, label: "Google Account" },
      ...dicebearAvatars,
    ];
  }

  return dicebearAvatars;
};
