#!/usr/bin/env python3
"""
Serveur web simple pour VBC Mundolsheim
Lance le site en local pour éviter les problèmes CORS
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Port du serveur
PORT = 8000

# Changer vers le répertoire du site
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les headers CORS pour permettre l'accès aux fichiers Excel
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def start_server():
    """Lance le serveur web local"""
    handler = CORSHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"🏐 Serveur VBC Mundolsheim démarré sur le port {PORT}")
            print(f"🌐 Ouvrez votre navigateur à l'adresse : http://localhost:{PORT}")
            print(f"📁 Dossier servi : {os.getcwd()}")
            print("\n📋 Pages disponibles :")
            print(f"   - Accueil : http://localhost:{PORT}/index.html")
            print(f"   - Calendrier : http://localhost:{PORT}/calendrier.html")
            print(f"   - Équipes masculines : http://localhost:{PORT}/masculines.html")
            print(f"   - Équipes féminines : http://localhost:{PORT}/feminines.html")
            print("\n⏹️  Appuyez sur Ctrl+C pour arrêter le serveur")
            
            # Ouvrir automatiquement le navigateur
            try:
                webbrowser.open(f'http://localhost:{PORT}/index.html')
            except:
                pass
            
            # Démarrer le serveur
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Serveur arrêté par l'utilisateur")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Port déjà utilisé
            print(f"❌ Erreur : Le port {PORT} est déjà utilisé")
            print("💡 Essayez de fermer les autres serveurs ou changez le port")
        else:
            print(f"❌ Erreur : {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()