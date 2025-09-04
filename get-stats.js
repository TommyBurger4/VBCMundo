// Script pour générer un fichier JSON avec les statistiques
const XLSX = require('xlsx');
const fs = require('fs');

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
    
    const stats = {
        'masculin-prenat': prenatStats,
        'masculin-excellence': excellenceStats,
        'masculin-honneur': honneurStats,
        'feminin-regionale': feminStats,
        'loisirs': { victories: 0, defeats: 0, matches: 0 }
    };
    
    // Écrire dans un fichier JSON
    fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
    console.log('Statistiques mises à jour dans stats.json');
    console.log(JSON.stringify(stats, null, 2));
    
} catch (error) {
    console.error('Erreur:', error);
    
    const defaultStats = {
        'masculin-prenat': { victories: 0, defeats: 0, matches: 0 },
        'masculin-excellence': { victories: 0, defeats: 0, matches: 0 },
        'masculin-honneur': { victories: 0, defeats: 0, matches: 0 },
        'feminin-regionale': { victories: 0, defeats: 0, matches: 0 },
        'loisirs': { victories: 0, defeats: 0, matches: 0 }
    };
    
    fs.writeFileSync('stats.json', JSON.stringify(defaultStats, null, 2));
    console.log('Statistiques par défaut créées');
}