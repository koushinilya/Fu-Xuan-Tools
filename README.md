# Fu-Xuan-RPC
Honkai : Star Rail Discord RPC avec Auto Daily Reward

Une application personnalisable de Discord RPC pour le jeu Honkai : Star Rail.

## Prérequis

- Node.js 14.0 ou supérieur

## Installation

1. Clonez ce dépôt ou téléchargez-le en tant qu'archive ZIP et extrayez-le.
2. Ouvrez un terminal ou un invite de commandes dans le dossier du projet.
3. Exécutez `npm install` pour installer les dépendances.

## Configuration

1. Renommez le fichier `.env.example` en `.env`.
2. Ouvrez le fichier `.env` et modifiez les variables en fonction de vos préférences.

### Récupération du token Hoyolab

Pour récupérer votre token Hoyolab, suivez les étapes ci-dessous :

1. Allez sur le site [Hoyolab](https://www.hoyolab.com/).
2. Connectez-vous à votre compte.
3. Ouvrez la console du navigateur en appuyant sur F12.
4. Collez le script suivant dans la console et appuyez sur Entrée :

```javascript
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

console.log('ltoken='+getCookie('ltoken')+'; ltuid='+getCookie('ltuid')+';');
```

5. Copiez la chaîne résultante qui ressemble à `ltoken=xxxx; ltuid=xxxx;` et collez-la dans le fichier `.env` à côté de `TOKEN=`.

## Utilisation

1. Ouvrez un terminal ou un invite de commandes dans le dossier du projet.

2. Exécutez `node <nom_du_fichier_principal>` pour lancer l'application (par exemple : node app.js si le fichier principal s'appelle app.js).

3. L'application commencera à surveiller le jeu Star Rail et mettra à jour votre statut Discord RPC en fonction des informations fournies dans le fichier `.env`.

## Variables du fichier .env

`DETAILS`: Le texte affiché dans les détails du statut Discord RPC.
`STATE`: Le texte affiché dans l'état du statut Discord RPC.
`TOKEN`: Le token Hoyolab utilisé pour la récupération des récompenses.
`DISCORD_ID`: Votre identifiant Discord pour les notifications.
`DISCORD_NOTIFY`: Définit si les notifications doivent être envoyées (`true` ou `false`).
`DISCORD_STAR_RAIL`: Définit si le jeu Star Rail doit être pris en compte dans les notifications (`true` ou `false`).
`DISCORD_NAME`: Votre nom Discord pour les notifications.

## Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
