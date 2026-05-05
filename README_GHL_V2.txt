LeadPilot - GoHighLevel API v2 / Private Integration

IMPORTANT:
Ne mets jamais ton token GoHighLevel directement dans index.html.
Ajoute-le seulement dans les variables d'environnement Netlify.

Variables Netlify obligatoires:
1. GHL_API_KEY
   Ton Private Integration Token GoHighLevel.

2. GHL_LOCATION_ID
   Le Location ID du sous-compte GoHighLevel.
   Chemin: GoHighLevel > Sub-account > Settings > Business Info > Location ID.

Variables Netlify optionnelles:
3. GHL_API_VERSION
   Valeur recommandée: 2023-02-21

4. GHL_API_URL
   Valeur par défaut:
   https://services.leadconnectorhq.com/contacts/upsert

Déploiement:
1. Dézippe ce fichier.
2. Upload le dossier complet sur Netlify.
3. Va dans Site configuration / Site settings > Environment variables.
4. Ajoute GHL_API_KEY et GHL_LOCATION_ID.
5. Redéploie le site.
6. Teste le formulaire.

Ce que le formulaire fait:
Landing page -> Netlify Function -> GoHighLevel contacts/upsert

Champs envoyés:
- firstName
- lastName
- name
- email
- phone
- companyName
- source
- tags
- locationId

Notes:
- Le message et le secteur sont inclus dans le champ source pour éviter d'exiger des custom fields GoHighLevel.
- Plus tard, on pourra ajouter de vrais custom fields si tu me fournis leurs IDs.
