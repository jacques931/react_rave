# RAVES - Application Mobile d'Enregistrement Audio

## Description
RAVES est une application mobile développée avec React Native et Expo qui permet aux utilisateurs d'enregistrer des fichiers audio, de les sauvegarder localement et de les transformer vers un serveur distant. 
> **Note :** Ce projet a été réalisé dans le cadre d'un projet scolaire pour démontrer mes compétences techniques et pratiques en développement web.

## Accès rapide via QR Code Expo

Scannez ce QR code avec votre application Expo Go pour accéder rapidement au projet :

![image](https://github.com/user-attachments/assets/65b78c03-b47c-4308-8796-07de7e0da614)

## Fonctionnalités

- **Connexion à un serveur distant** : Interface de connexion permettant de spécifier l'adresse IP et le port du serveur
- **Enregistrement audio** : Enregistrement de fichiers audio via le microphone de l'appareil
- **Gestion des enregistrements** : Sauvegarde, lecture et suppression des enregistrements
- **Transformation audio** : Envoi des enregistrements vers le serveur qui les transforme via un modèle choisi et renvoie le fichier audio modifié

## Installation

1. Cloner le dépôt :
```
git clone [URL_DU_REPO]
```

2. Installer les dépendances :
```
cd react_rave
npm install
```

3. Lancer l'application :
```
npm start
```

## Configuration du serveur Flask

Pour que l'application fonctionne correctement, vous devez également lancer un serveur Flask en local :

1. Assurez-vous d'avoir Python installé sur votre machine
2. Récupérez le projet Git du serveur :
3. Lancez le serveur Flask :
```
python server.py
```
4. Le serveur sera accessible avec un adresse IP et un port

## Utilisation

1. Lancez l'application et connectez-vous à votre serveur en spécifiant l'adresse IP et le port
2. Utilisez l'onglet "Studio" pour créer et gérer vos enregistrements audio
3. Utilisez l'onglet "Convertisseur" pour envoyer vos enregistrements au serveur qui les transformera via le modèle sélectionné

---
