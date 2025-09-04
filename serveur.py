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
import json
import urllib.parse

# Port du serveur
PORT = 8001

# Changer vers le répertoire du site
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les headers CORS pour permettre l'accès aux fichiers Excel
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_GET(self):
        # API endpoint pour les statistiques
        if self.path == '/api/stats':
            try:
                stats = self.calculate_team_stats()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(stats).encode())
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
                return
        
        # Endpoint pour mettre à jour les statistiques
        elif self.path == '/update-stats':
            try:
                # Exécuter le script Node.js pour générer stats.json
                import subprocess
                result = subprocess.run(['node', 'get-stats.js'], 
                                     capture_output=True, text=True, cwd='.')
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status": "updated"}')
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
                return
        
        # Pour tous les autres fichiers, utiliser le comportement par défaut
        super().do_GET()
    
    def calculate_team_stats(self):
        """Utilise Node.js pour calculer les statistiques depuis le fichier Excel"""
        try:
            # Utiliser le script Node.js pour lire l'Excel
            import subprocess
            result = subprocess.run(['node', '-e', """
const XLSX = require('xlsx');

function calculateSheetStats(workbook, sheetName) {
    if (!workbook.SheetNames.includes(sheetName)) {
        return { victories: 0, defeats: 0, matches: 0 };
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    let victories = 0;
    let defeats = 0;
    let matches = 0;
    
    data.forEach((row) => {
        const scoreNous = row['Score Nous'];
        const scoreAdversaire = row['Score Adversaire'];
        
        if (scoreNous !== undefined && scoreNous !== '' && 
            scoreAdversaire !== undefined && scoreAdversaire !== '') {
            matches++;
            const notre = parseInt(scoreNous);
            const leur = parseInt(scoreAdversaire);
            
            if (notre > leur) {
                victories++;
            } else if (notre < leur) {
                defeats++;
            }
        }
    });
    
    return { victories, defeats, matches };
}

try {
    const workbook = XLSX.readFile('matchs.xlsx');
    
    const prenatStats = calculateSheetStats(workbook, 'Senior 1 Pré-National');
    const excellenceStats = calculateSheetStats(workbook, 'Senior 2 Excellence');
    const honneurStats = calculateSheetStats(workbook, 'Senior 3 Honneur');
    const feminStats = calculateSheetStats(workbook, 'Senior Feminine');
    const loisirsStats = { victories: 0, defeats: 0, matches: 0 }; // Pas de feuille loisirs pour l'instant
    
    const stats = {
        'masculin-prenat': prenatStats,
        'masculin-excellence': excellenceStats,
        'masculin-honneur': honneurStats,
        'feminin-regionale': feminStats,
        'loisirs': loisirsStats
    };
    
    console.log(JSON.stringify(stats));
} catch (error) {
    console.log(JSON.stringify({
        'masculin-prenat': { victories: 0, defeats: 0, matches: 0 },
        'masculin-excellence': { victories: 0, defeats: 0, matches: 0 },
        'masculin-honneur': { victories: 0, defeats: 0, matches: 0 },
        'feminin-regionale': { victories: 0, defeats: 0, matches: 0 },
        'loisirs': { victories: 0, defeats: 0, matches: 0 }
    }));
}
            """], capture_output=True, text=True, cwd='.')
            
            if result.returncode == 0:
                # Parser la sortie JSON
                try:
                    return json.loads(result.stdout.strip())
                except json.JSONDecodeError:
                    pass
            
            # Stats par défaut si erreur
            return {
                'masculin-prenat': {'victories': 0, 'defeats': 0, 'matches': 0},
                'masculin-excellence': {'victories': 0, 'defeats': 0, 'matches': 0},
                'masculin-honneur': {'victories': 0, 'defeats': 0, 'matches': 0},
                'feminin-regionale': {'victories': 0, 'defeats': 0, 'matches': 0},
                'loisirs': {'victories': 0, 'defeats': 0, 'matches': 0}
            }
            
        except Exception as e:
            # En cas d'erreur, retourner des stats vides
            return {
                'masculin-prenat': {'victories': 0, 'defeats': 0, 'matches': 0},
                'masculin-excellence': {'victories': 0, 'defeats': 0, 'matches': 0},
                'masculin-honneur': {'victories': 0, 'defeats': 0, 'matches': 0},
                'feminin-regionale': {'victories': 0, 'defeats': 0, 'matches': 0},
                'loisirs': {'victories': 0, 'defeats': 0, 'matches': 0}
            }

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