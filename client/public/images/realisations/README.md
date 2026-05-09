# Photos des réalisations

**À mettre dans ce dossier** (4 photos minimum pour la page Réalisations) :

| Fichier attendu | Description |
|---|---|
| `sdb-port-de-bouc-avant.jpg` | Salle de bain rose vintage (faïence rose, meuble bois) — AVANT rénovation |
| `sdb-port-de-bouc-apres.jpg` | Même salle de bain en moderne (carrelage gris, parquet bois, vitre douche) — APRÈS |
| `sdb-baignoire-ilot.jpg` | SDB blanche avec baignoire îlot et WC suspendu |
| `sdb-deco-finitions.jpg` | SDB beige aménagée avec plantes et déco |

## Format recommandé

- JPG ou WebP (pas PNG, trop lourd)
- Largeur : 1400-1800 px
- Poids : < 400 KB par photo (compresser via tinypng.com ou squoosh.app)

## Comment les ajouter

Glissez-déposez les fichiers depuis l'explorateur Windows directement dans ce dossier. Le nom du fichier doit correspondre EXACTEMENT à la liste ci-dessus (sensible à la casse, tirets, accents).

## Pour ajouter d'autres réalisations

1. Mettre la photo dans ce dossier (nom logique en kebab-case : `sdb-martigues-renovation.jpg`)
2. Modifier `client/src/lib/business.js` → tableau `realizations` → ajouter une nouvelle entrée :

```js
{
  title: "Titre du chantier",
  city: "Ville",
  type: "Rénovation" | "Recherche fuite" | "Carrelage" | "Chauffe-eau" | "Installation",
  imageBefore: "/images/realisations/sdb-xxx-avant.jpg",  // si avant/après
  imageAfter: "/images/realisations/sdb-xxx-apres.jpg",   // si avant/après
  // OU
  image: "/images/realisations/sdb-xxx.jpg",              // photo unique
  problem: "La situation initiale...",
  solution: "Ce qu'on a fait...",
  result: "Le résultat final...",
  duration: "X jours",
}
```

Si imageBefore + imageAfter sont fournis, la réalisation apparaît dans le **slider phare** en haut.
Sinon, elle apparaît dans la **galerie simple** en bas.
