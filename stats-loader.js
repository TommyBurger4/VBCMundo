// Script pour charger et calculer les statistiques depuis le fichier JSON
async function loadMatchStats() {
    try {
        // Générer les stats à jour
        await fetch('/update-stats');
        
        // Charger le fichier JSON mis à jour
        const response = await fetch('stats.json');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const teamStats = await response.json();
        return teamStats;
        
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        // Retourner des stats par défaut en cas d'erreur
        return {
            'masculin-prenat': { victories: 0, defeats: 0, matches: 0 },
            'masculin-excellence': { victories: 0, defeats: 0, matches: 0 },
            'masculin-honneur': { victories: 0, defeats: 0, matches: 0 },
            'feminin-regionale': { victories: 0, defeats: 0, matches: 0 },
            'loisirs': { victories: 0, defeats: 0, matches: 0 }
        };
    }
}

// Mettre à jour l'affichage des statistiques sur la page
async function updateStatsDisplay() {
    const stats = await loadMatchStats();
    
    // Mettre à jour les cartes d'équipe selon la page
    if (window.location.pathname.includes('masculines.html')) {
        // Pré National
        const prenatMatches = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(1) .stat-number');
        const prenatVictories = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(2) .stat-number');
        const prenatDefeats = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(3) .stat-number');
        if (prenatMatches && prenatVictories && prenatDefeats) {
            prenatMatches.textContent = stats['masculin-prenat'].matches || '-';
            prenatVictories.textContent = stats['masculin-prenat'].victories || '-';
            prenatDefeats.textContent = stats['masculin-prenat'].defeats || '-';
        }
        
        // Excellence
        const excellenceMatches = document.querySelector('.team-overview-card:nth-child(2) .stat:nth-child(1) .stat-number');
        const excellenceVictories = document.querySelector('.team-overview-card:nth-child(2) .stat:nth-child(2) .stat-number');
        const excellenceDefeats = document.querySelector('.team-overview-card:nth-child(2) .stat:nth-child(3) .stat-number');
        if (excellenceMatches && excellenceVictories && excellenceDefeats) {
            excellenceMatches.textContent = stats['masculin-excellence'].matches || '-';
            excellenceVictories.textContent = stats['masculin-excellence'].victories || '-';
            excellenceDefeats.textContent = stats['masculin-excellence'].defeats || '-';
        }
        
        // Honneur
        const honneurMatches = document.querySelector('.team-overview-card:nth-child(3) .stat:nth-child(1) .stat-number');
        const honneurVictories = document.querySelector('.team-overview-card:nth-child(3) .stat:nth-child(2) .stat-number');
        const honneurDefeats = document.querySelector('.team-overview-card:nth-child(3) .stat:nth-child(3) .stat-number');
        if (honneurMatches && honneurVictories && honneurDefeats) {
            honneurMatches.textContent = stats['masculin-honneur'].matches || '-';
            honneurVictories.textContent = stats['masculin-honneur'].victories || '-';
            honneurDefeats.textContent = stats['masculin-honneur'].defeats || '-';
        }
    }
    
    // Mettre à jour les cartes d'équipe si on est sur la page feminines.html
    else if (window.location.pathname.includes('feminines.html')) {
        // Féminine Régionale
        const feminMatches = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(1) .stat-number');
        const feminVictories = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(2) .stat-number');
        const feminDefeats = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(3) .stat-number');
        if (feminMatches && feminVictories && feminDefeats) {
            feminMatches.textContent = stats['feminin-regionale'].matches || '-';
            feminVictories.textContent = stats['feminin-regionale'].victories || '-';
            feminDefeats.textContent = stats['feminin-regionale'].defeats || '-';
        }
    }
    
    // Mettre à jour les cartes d'équipe si on est sur la page loisirs.html
    else if (window.location.pathname.includes('loisirs.html')) {
        // Équipe Loisirs
        const loisirsMatches = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(1) .stat-number');
        const loisirsVictories = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(2) .stat-number');
        const loisirsDefeats = document.querySelector('.team-overview-card:nth-child(1) .stat:nth-child(3) .stat-number');
        if (loisirsMatches && loisirsVictories && loisirsDefeats) {
            loisirsMatches.textContent = stats['loisirs'].matches || '-';
            loisirsVictories.textContent = stats['loisirs'].victories || '-';
            loisirsDefeats.textContent = stats['loisirs'].defeats || '-';
        }
    }
    
    // Mettre à jour les statistiques dans le modal aussi
    if (window.teamsData) {
        Object.keys(stats).forEach(teamKey => {
            if (window.teamsData[teamKey]) {
                window.teamsData[teamKey].stats.wins = stats[teamKey].victories;
                window.teamsData[teamKey].stats.losses = stats[teamKey].defeats;
                window.teamsData[teamKey].stats.matches = stats[teamKey].matches;
                window.teamsData[teamKey].stats.points = stats[teamKey].victories * 3;
            }
        });
    }
}

// Charger les stats au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu pour s'assurer que XLSX est chargé
    setTimeout(() => {
        updateStatsDisplay();
    }, 100);
    
    // Rafraîchir les stats toutes les 30 secondes
    setInterval(updateStatsDisplay, 30000);
});