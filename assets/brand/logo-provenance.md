# Dences logo asset

Source: user-supplied `/home/malan/Pictures/dences_logo.jpg`.

Method: built-in ImageGen, with transparent background requested. The original source is unchanged. Generated cutouts should be checked against the original before production use.

First extraction prompt:

> Use case: background-extraction. Edit target: attached Dences logo. Remove only the black background and output a PNG with genuine alpha transparency. Preserve the exact existing white angular logo silhouette, its proportions and orientation, and subtle gray edge/shadow. Do not redesign, add text, change geometry, or introduce any other elements. Transparent pixels everywhere outside the logo.

The first result was rejected for rough edges and debris.

Final cleanup prompt:

> Use case: background-extraction. Clean up the attached Dences logo cutout into a crisp transparent PNG. Preserve the exact angular white logo silhouette, orientation, and proportions from the original. Make the logo pure flat white with smooth antialiased edges. Remove ALL speckles, white debris, gray outlines, bevels, and shadows outside and inside its silhouette. Interior negative space and surrounding canvas must be fully transparent, no background, no new shapes or text. Do not redesign the mark.
