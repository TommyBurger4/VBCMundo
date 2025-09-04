// Données des équipes
const teamsData = {
    'masculin-prenat': {
        title: 'Masculin Pré National',
        level: 'Pré National',
        description: 'Notre équipe phare évoluant au plus haut niveau régional',
        coach: 'À définir',
        assistant: 'À définir',
        training: 'Mardi et Jeudi 20h-22h, Samedi 10h-12h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Dupont', prenom: 'Thomas', age: 28, taille: '1m95', poste: 'Attaquant', numero: 4 },
            { nom: 'Martin', prenom: 'Lucas', age: 25, taille: '2m02', poste: 'Central', numero: 7 },
            { nom: 'Bernard', prenom: 'Antoine', age: 30, taille: '1m88', poste: 'Passeur', numero: 1 },
            { nom: 'Petit', prenom: 'Julien', age: 26, taille: '1m92', poste: 'Réceptionneur-Attaquant', numero: 10 },
            { nom: 'Durand', prenom: 'Maxime', age: 24, taille: '1m98', poste: 'Attaquant', numero: 15 },
            { nom: 'Leroy', prenom: 'Pierre', age: 27, taille: '2m05', poste: 'Central', numero: 3 },
            { nom: 'Moreau', prenom: 'Alexandre', age: 29, taille: '1m85', poste: 'Libéro', numero: 2 },
            { nom: 'Simon', prenom: 'Kevin', age: 23, taille: '1m94', poste: 'Opposé', numero: 8 },
            { nom: 'Michel', prenom: 'Damien', age: 31, taille: '2m00', poste: 'Central', numero: 11 },
            { nom: 'Rousseau', prenom: 'Nicolas', age: 26, taille: '1m87', poste: 'Passeur', numero: 6 },
            { nom: 'Vincent', prenom: 'Florian', age: 25, taille: '1m93', poste: 'Réceptionneur-Attaquant', numero: 9 },
            { nom: 'Muller', prenom: 'Sébastien', age: 27, taille: '1m91', poste: 'Attaquant', numero: 12 }
        ],
        achievements: [
            'Champion Départemental 2023',
            '3ème place Coupe d\'Alsace 2024',
            'Montée en Pré National 2022'
        ],
        stats: {
            matches: 8,
            wins: 5,
            losses: 3,
            points: 15
        }
    },
    'masculin-excellence': {
        title: 'Masculin Excellence',
        level: 'Excellence',
        description: 'Équipe compétitive au niveau Excellence',
        coach: 'À définir',
        assistant: 'À définir',
        training: 'À définir',
        stadium: 'Gymnase Municipal - Mundolsheim',
        image: 'public/Photo/Equipe/Equipe2.webp',
        players: [
            // Liste des joueurs à compléter
        ],
        achievements: [
            // Palmarès à compléter
        ],
        stats: {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        }
    },
    'masculin-honneur': {
        title: 'Masculin Honneur',
        level: 'Honneur',
        description: 'Équipe évoluant au niveau Honneur',
        coach: 'À définir',
        assistant: 'À définir',
        training: 'À définir',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            // Liste des joueurs à compléter
        ],
        achievements: [
            // Palmarès à compléter
        ],
        stats: {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        }
    },
    'feminin-regionale': {
        title: 'Féminin Régionale',
        level: 'Régionale',
        description: 'Notre équipe féminine évoluant au niveau régional',
        coach: 'À définir',
        assistant: 'À définir',
        training: 'À définir',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            // Liste des joueuses à compléter
        ],
        achievements: [
            // Palmarès à compléter
        ],
        stats: {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        }
    },
    'loisirs': {
        title: 'Équipe Loisirs',
        level: 'Loisirs',
        description: 'Équipe mixte pour le plaisir de jouer ensemble',
        coach: 'Auto-géré',
        assistant: '',
        training: 'À définir',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            // Liste des joueurs/joueuses à compléter
        ],
        achievements: [
            'Convivialité et bonne humeur garanties',
            'Participation aux tournois amicaux'
        ],
        stats: {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        }
    }
};

// Fonction pour afficher les détails d'une équipe dans le modal
function showTeamModal(teamId) {
    const team = teamsData[teamId];
    if (!team) return;

    const modal = document.getElementById('teamModal');
    const teamDetails = document.getElementById('teamDetails');

    teamDetails.innerHTML = `
        <div class="team-modal-header">
            <h2>${team.title}</h2>
            <div class="team-level-badge">${team.level}</div>
        </div>
        
        <div class="team-modal-content">
            <div class="team-info-section">
                <div class="team-info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-user-tie"></i> Encadrement</h4>
                        <p><strong>Entraîneur :</strong> ${team.coach}</p>
                        ${team.assistant ? `<p><strong>Assistant :</strong> ${team.assistant}</p>` : ''}
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-clock"></i> Entraînements</h4>
                        <p>${team.training}</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-map-marker-alt"></i> Lieu</h4>
                        <p>${team.stadium}</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-chart-bar"></i> Statistiques</h4>
                        <p><strong>Matchs :</strong> ${team.stats.matches}</p>
                        <p><strong>Victoires :</strong> ${team.stats.wins}</p>
                        <p><strong>Défaites :</strong> ${team.stats.losses}</p>
                        <p><strong>Points :</strong> ${team.stats.points}</p>
                    </div>
                </div>
                
                ${team.achievements && team.achievements.length > 0 ? `
                <div class="achievements-section">
                    <h4><i class="fas fa-trophy"></i> Palmarès</h4>
                    <div class="achievements-list">
                        ${team.achievements.map(achievement => `
                            <span class="achievement-item">${achievement}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            ${team.players && team.players.length > 0 ? `
            <div class="players-section">
                <h4><i class="fas fa-users"></i> Effectif (${team.players.length} ${team.players.length > 1 ? 'joueurs' : 'joueur'})</h4>
                <div class="players-grid">
                    ${team.players.map(player => `
                        <div class="player-card-detailed">
                            <div class="player-number">${player.numero}</div>
                            <div class="player-details">
                                <h5>${player.prenom} ${player.nom}</h5>
                                <div class="player-info-row">
                                    <span class="player-age">${player.age} ans</span>
                                    <span class="player-height">${player.taille}</span>
                                    <span class="player-position">${player.poste}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : `
            <div class="players-section">
                <h4><i class="fas fa-users"></i> Effectif</h4>
                <p>Les joueurs seront ajoutés prochainement.</p>
            </div>
            `}
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Gestion de la fermeture du modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('teamModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer en cliquant à côté du modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});