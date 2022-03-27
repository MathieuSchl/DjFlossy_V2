# EmptyBot_V3

## <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/2560px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png" alt="English_Flag" style="width:30px;"/> English

### Description

This repository is my personal structure for creating discord bots. It use discord.js v13. This project is not done yet and more features are on the way.
I have multiple versions of this project:
- V1: my first bots with discord.js v12 (not available) 
- V2 : my first structure for discord bots with discord.js v12 => [Look here](https://github.com/MathieuSchl/emptyBot)
- V3 : This repository (the best one 😉) for discord.js v13. 

This project was designed to facilitate the creation of commands/actions (new user, send message,...), without touching the structure files (events, sql requests,...)

### Features

- Special textChannel* management
- Actions with reactions (like buttons)
- Buttons
- SelectMenus
- SlashCommands
- ~~BasicComands*~~
- Actions for new ~~and departing~~ users
- Actions for specific invitation links
- Actions when the bot joins a new guild and when it leaves it
- Save data with mariaDb server ~~or json files~~
- ~~Special voiceChnnels~~
- Actions with cronTables
- Several languages available. See [here](#Language-availables)

> The crossed out features are new features expected in the future.

> I explain terms with * in the [glossary](#Glossary)

### Instalation

To use this project you need :
- [Node.js](https://nodejs.org/) 16.6.0 or newer
- [npm](https://www.npmjs.com/)
- And several libraries that are installed with the command below

The most important library is discord.js and it is necessary the version is 13.1.0. Check here [discord.js](https://discord.js.org/#/)

##### Libraries instalation : 
To install all libraries and depedencies use this command :
```sh
npm i discord.js@13.1.0 @discordjs/voice libsodium-wrappers ffmpeg opusscript fs cron
```

##### Run the bot :
To run the bot use this command at the root of the project :
```sh
node index.js
```
**The bot will create 2 config files :**
The first one is `./index.json` :
```
{
    "token": "YourTockenHere",
    "prefix": "YourPrefixHere",
    "defaultGuildLanguage": null,
    "defaultUserLanguage": null
}
```
In this file, set:
- Your bot tocken. Find it [here](https://discord.com/developers/applications/). If needed see a guide [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
- Your bot prefix. `basicCommands` need a prefix to work.
- A default language for guilds. If is `null` the bot will use `en`.
- A default language for users. If is `null` the bot will use `en`.

> Check language available for choose language parameters

The second file is `./storage/dataBase/dbConfig.json` : 
```
{
    "useSQLdb": false,
    "host": "hostHere",
    "user": "userHere",
    "password": "passwordHere",
    "database": "databaseHere"
}
```

The bot will save data you can choose to save with ~~json files~~ or MariaDB server.
To set up this, set :
- `useSQLdb` to ~~`false` to use json files or~~ `true` for MariaDB server. If this is `false` the other parameters are not necessary
- `host` to your host server.
- `user` to your user server.
- `password` to your password for your server.
- `database` to your database name.

Tables are created automatically.

Now the bot is ready to go. 😄

### Invite your bot to a server
To invite your bot to a server, you will need the client token. Find it [here](https://discord.com/developers/applications/).
Use [this website](https://discordapi.com/permissions.html) to create your discord link.
If needed see a guide [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).

### Language availables 
The bot has several languages available : 
- English => `en`
- French => `fr`
- German => `de`

### Glossary
I created thermes, look what they mean here:

BasicCommands : Basic commands are a way to trigger actions before slashCommands. They are triggered by a defined token and a name. 

Special textChannel : Special textChannel are channels that have a different operation. They are not used to write text and chat with other users but have a behavior related to the type of channel, e.g.: the console channel will write all the logs written in the log file.

Special voiceChannel : Special voiceChannel are channels that have a different operation. They have specific actions.

Version : 3.0.0








## <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png" alt="French_Flag" style="width:27px;"/> Francais

### Description

Ce dépôt est ma structure personnelle pour la création de bots discord. Il utilise discord.js v13. Ce projet n'est pas encore terminé et d'autres fonctionnalités sont en cours de développement.
J'ai plusieurs versions de ce projet :
- V1: mes premiers bots avec discord.js v12 (non disponible) 
- V2 : ma première structure pour les bots de discord avec discord.js v12 => [regardez ici](https://github.com/MathieuSchl/emptyBot)
- V3 : Ce dépôt (le meilleur 😉) pour discord.js v13.

Ce projet à été concu pour faciliter la création de commandes/d'actions(nouveau utilisateur, envoie de message,...), sans toucher aux fichiers de stucture(évènements, requètes sql,...)

### Features

- Gestion de canneaux textuels spéciaux*
- Actions avec réactions (comme les boutons)
- Boutons
- Menus de sélections
- Commands slash
- ~~Commandes basique*~~
- Actions pour les nouveaux utilisateurs ~~et les utilisateurs qui partent~~
- Actions pour des liens d'invitation spécifique
- Actions lorsque le bot rejoint un nouveau serveur et lorsqu'il le quitte
- Sauvegarde des données avec un serveur mariaDb ~~ou des fichiers json~~
- ~~Canneaux vocal spéciaux*~~
- Actions avec des cronTables
- Plusieurs langues disponible. Regardez [ici](#Langues-disponibles)

> Les fonctionnalités barrées sont de nouvelles fonctionnalités attendues dans le futur.

> J'explique les termes avec * dans le [glossaire](#Glossaire)

### Instalation

Pour utiliser ce projet, vous devez :
- [Node.js](https://nodejs.org/) 16.6.0 ou plus récent
- [npm](https://www.npmjs.com/)
- Et plusieurs bibliothèques qui sont installées avec la commande ci-dessous

La bibliothèque la plus importante est discord.js et il est nécessaire que la version utilisé soit 13.1.0. Vérifiez ici [discord.js](https://discord.js.org/#/)

##### Installation des bibliothèques : 
Pour installer toutes les bibliothèques et dépendances, utilisez cette commande :
```sh
npm i discord.js@13.1.0 @discordjs/voice libsodium-wrappers ffmpeg opusscript fs child_process
```

##### Lancer le bot :
Pour lancer le bot, utilisez la commande suivante à la racine du projet :
```sh
node index.js
```
**Le bot créera 2 fichiers de configuration :**
Le premier est `./index.json` :
```
{
    "token": "YourTockenHere",
    "prefix": "YourPrefixHere",
    "defaultGuildLanguage": null,
    "defaultUserLanguage": null
}
```
Dans ce fichier, définissez:
- Votre tocken pour le bot. Trouvez-le [ici](https://discord.com/developers/applications/). Si nécessaire, consultez un guide [ici](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot), c'est en anglais désolé. 😇
- Votre préfix. Les `commandes basique` ont besoin d'un préfix pour fonctionner.
- Une langue par défaut pour les serveurs. Si ce paramètre est `null`, le bot va utiliser `en`.
-  Une langue par défaut pour les utilisateurs. Si ce paramètre est `null`, le bot va utiliser `en`.

> Vérifier la langue disponible pour choisir les paramètres de langue

Le second fichier est `./storage/dataBase/dbConfig.json` : 
```
{
    "useSQLdb": false,
    "host": "hostHere",
    "user": "userHere",
    "password": "passwordHere",
    "database": "databaseHere"
}
```

Le bot va sauvegarder les données que vous pouvez choisir de sauvegarder avec des ~~fichiers json~~ ou un serveur MariaDB.
Pour configurer cela, définissez:
- `useSQLdb` à ~~`false` pour utiliser des fichiers json ou~~ `true` pour un serveur MariaDB. Si cette valeur est `false`, les autres paramètres ne sont pas nécessaires.
- `host` pour l'ip de votre serveur.
- `user` pour votre nom d'utilisateur.
- `password` pour votre mot de passe.
- `database` pour la table que vous souhaitez utiliser.

Les tables sont créés automatiquement.

Maintenant le bot est prêt pour l'action. 😄

### Invitez votre bot sur un serveur
Pour inviter votre bot sur un serveur, vous avez besoin du tocken client. Trouvez-le [ici](https://discord.com/developers/applications/).
Utilisez [ce site](https://discordapi.com/permissions.html) pour créer le lien d'invitation.
Si nécessaire, consultez ce [guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links). C'est aussi en anglais. 😇

### Langues disponibles 
Le bot est disponible en plusieurs langues : 
- Français => `fr`
- Anglais => `en`
- Allemend => `de`

### Glossaire
J'ai créé des termes, regardez ce qu'ils signifient ici :

Commandes basiqus : Les commandes basiques sont une manière de déclencher des actions avant les commandes slash. Elles sont déclenché grâce à un tocken défini et un nom.

Canneaux textuels spéciaux : Les canneaux textuels spéciaux sont des canneaux qui ont un fonctionnement différent. Ils ne servent pas à écrire du texte et parler avec d'autres utilisateurs mais ont un comportement lié au type du cannal, ex: le cannal de console va écrire tous les logs écrits dans le fichier de log. 

Canneaux vocal spéciaux : Les canneaux vocal spéciaux sont des canneaux qui ont un fonctionnement différent. Ils ont des actions spécifiques.

Version : 3.0.0