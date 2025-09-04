const XLSX = require('xlsx');

// Lire le fichier Excel
const workbook = XLSX.readFile('/mnt/c/Users/tburg/Documents/Projet/VBCMundo/matchs.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Calculer les statistiques pour chaque type de match
function calculateStats(matchType = null) {
    let victories = 0;
    let defeats = 0;
    let matchesPlayed = 0;
    
    data.forEach((row) => {
        // Si on filtre par type et que ce n'est pas le bon type, on passe
        if (matchType && row['Type'] !== matchType) {
            return;
        }
        
        const scoreNous = row['Score Nous'];
        const scoreAdversaire = row['Score Adversaire'];
        
        // Vérifier que les scores sont renseignés
        if (scoreNous !== undefined && scoreNous !== '' && 
            scoreAdversaire !== undefined && scoreAdversaire !== '') {
            
            matchesPlayed++;
            
            // Convertir en nombres
            const notre = parseInt(scoreNous);
            const leur = parseInt(scoreAdversaire);
            
            if (notre > leur) {
                victories++;
            } else if (notre < leur) {
                defeats++;
            }
            // Si égalité, on ne compte ni victoire ni défaite
        }
    });
    
    return {
        matchesPlayed,
        victories,
        defeats,
        points: victories * 3 + defeats * 0 // En volleyball, généralement 3 points par victoire
    };
}

// Afficher tous les matchs avec scores
console.log('=== ANALYSE DES MATCHS ===\n');

let totalMatches = 0;
data.forEach((row, index) => {
    const scoreNous = row['Score Nous'];
    const scoreAdversaire = row['Score Adversaire'];
    
    if (scoreNous !== undefined && scoreNous !== '' && 
        scoreAdversaire !== undefined && scoreAdversaire !== '') {
        totalMatches++;
        console.log(`Match ${totalMatches}: ${row['Date']} - ${row['Adversaire']}`);
        console.log(`  Score: ${scoreNous} - ${scoreAdversaire}`);
        console.log(`  Résultat: ${scoreNous > scoreAdversaire ? 'VICTOIRE' : (scoreNous < scoreAdversaire ? 'DÉFAITE' : 'ÉGALITÉ')}`);
        console.log('');
    }
});

if (totalMatches === 0) {
    console.log('Aucun match avec des scores renseignés pour le moment.\n');
}

// Calculer les statistiques globales
const stats = calculateStats();

console.log('=== STATISTIQUES GLOBALES ===');
console.log(`Matchs joués: ${stats.matchesPlayed}`);
console.log(`Victoires: ${stats.victories}`);
console.log(`Défaites: ${stats.defeats}`);
console.log(`Points: ${stats.points}`);

// Calculer les statistiques par type si on a des matchs
if (stats.matchesPlayed > 0) {
    console.log('\n=== STATISTIQUES PAR TYPE ===');
    
    const championnatStats = calculateStats('Championnat');
    if (championnatStats.matchesPlayed > 0) {
        console.log('\nChampionnat:');
        console.log(`  Matchs: ${championnatStats.matchesPlayed}`);
        console.log(`  Victoires: ${championnatStats.victories}`);
        console.log(`  Défaites: ${championnatStats.defeats}`);
    }
    
    const coupeStats = calculateStats('Coupe');
    if (coupeStats.matchesPlayed > 0) {
        console.log('\nCoupe:');
        console.log(`  Matchs: ${coupeStats.matchesPlayed}`);
        console.log(`  Victoires: ${coupeStats.victories}`);
        console.log(`  Défaites: ${coupeStats.defeats}`);
    }
}

// Si on est dans un environnement Node.js, calculer et retourner les stats JSON
if (typeof process !== 'undefined' && process.argv) {
    // Calculer les statistiques globales
    const globalStats = calculateStats();
    
    // Retourner les stats au format JSON pour le serveur Python
    const jsonStats = {
        'masculin-prenat': { 
            victories: globalStats.victories, 
            defeats: globalStats.defeats, 
            matches: globalStats.matchesPlayed 
        },
        'masculin-excellence': { victories: 0, defeats: 0, matches: 0 },
        'masculin-honneur': { victories: 0, defeats: 0, matches: 0 },
        'feminin-regionale': { victories: 0, defeats: 0, matches: 0 },
        'loisirs': { victories: 0, defeats: 0, matches: 0 }
    };
    
    console.log(JSON.stringify(jsonStats));
}