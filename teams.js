// Données des équipes
const teamsData = {
    'senior-m-prenat': {
        title: 'Senior Masculin Pré-Nationale',
        level: 'Pré-Nationale',
        description: 'Notre équipe phare évoluant au plus haut niveau régional',
        coach: 'Jean-Luc Moreau',
        assistant: 'Pierre Dubois',
        training: 'Mardi et Jeudi 20h-22h, Samedi 16h-18h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Martin', prenom: 'Lucas', age: 28, taille: '1m95', poste: 'Attaquant', numero: 4 },
            { nom: 'Dubois', prenom: 'Pierre', age: 25, taille: '2m02', poste: 'Central', numero: 12 },
            { nom: 'Leroy', prenom: 'Antoine', age: 30, taille: '1m88', poste: 'Passeur', numero: 7 },
            { nom: 'Moreau', prenom: 'Julien', age: 26, taille: '1m92', poste: 'Réceptionneur', numero: 1 },
            { nom: 'Garnier', prenom: 'Thomas', age: 24, taille: '1m98', poste: 'Attaquant', numero: 15 },
            { nom: 'Roux', prenom: 'Maxime', age: 27, taille: '2m05', poste: 'Central', numero: 3 },
            { nom: 'Bernard', prenom: 'Fabien', age: 29, taille: '1m90', poste: 'Libéro', numero: 2 },
            { nom: 'Laurent', prenom: 'Kevin', age: 23, taille: '1m94', poste: 'Attaquant', numero: 8 },
            { nom: 'Rousseau', prenom: 'Damien', age: 31, taille: '2m00', poste: 'Central', numero: 11 },
            { nom: 'Vincent', prenom: 'Sebastien', age: 26, taille: '1m85', poste: 'Passeur', numero: 6 },
            { nom: 'Michel', prenom: 'Alexandre', age: 25, taille: '1m93', poste: 'Réceptionneur', numero: 9 },
            { nom: 'Petit', prenom: 'Nicolas', age: 27, taille: '1m91', poste: 'Attaquant', numero: 10 }
        ],
        achievements: [
            'Champion Départemental 2024',
            '8 années consécutives en Pré-Nationale',
            'Finaliste Coupe d\'Alsace 2023',
            'Meilleure attaque du championnat 2024'
        ],
        stats: {
            matches: 24,
            wins: 19,
            losses: 5,
            points: 57
        }
    },
    'senior-m-depart': {
        title: 'Senior Masculin Départemental',
        level: 'Départemental',
        description: 'Équipe compétitive au niveau départemental avec de belles ambitions',
        coach: 'Pierre Dubois',
        assistant: 'Marc Schmidt',
        training: 'Mardi et Jeudi 18h-20h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Lefebvre', prenom: 'Nicolas', age: 29, taille: '1m90', poste: 'Attaquant', numero: 4 },
            { nom: 'Simon', prenom: 'François', age: 31, taille: '1m96', poste: 'Central', numero: 12 },
            { nom: 'Michel', prenom: 'David', age: 26, taille: '1m85', poste: 'Passeur', numero: 7 },
            { nom: 'Girard', prenom: 'Alexandre', age: 28, taille: '1m89', poste: 'Libéro', numero: 1 },
            { nom: 'Petit', prenom: 'Benjamin', age: 25, taille: '1m93', poste: 'Attaquant', numero: 15 },
            { nom: 'Blanc', prenom: 'Christophe', age: 30, taille: '2m01', poste: 'Central', numero: 3 },
            { nom: 'Muller', prenom: 'Thomas', age: 24, taille: '1m87', poste: 'Réceptionneur', numero: 8 },
            { nom: 'Weber', prenom: 'Mathieu', age: 27, taille: '1m91', poste: 'Attaquant', numero: 11 },
            { nom: 'Fischer', prenom: 'Julien', age: 26, taille: '1m88', poste: 'Passeur', numero: 6 },
            { nom: 'Meyer', prenom: 'Antoine', age: 23, taille: '1m94', poste: 'Central', numero: 9 }
        ],
        achievements: [
            '3ème place Championnat 2024',
            'Qualification Coupe d\'Alsace 2024',
            'Meilleure progression de la saison',
            'Équipe la plus fair-play 2023'
        ],
        stats: {
            matches: 22,
            wins: 15,
            losses: 7,
            points: 45
        }
    },
    'm18-depart': {
        title: 'M18 Départemental',
        level: 'Jeunes - Départemental',
        description: 'Nos jeunes talents de demain se préparent déjà pour les seniors',
        coach: 'Marc Schmidt',
        assistant: 'Lucas Martin',
        training: 'Mercredi 18h-20h, Samedi 14h-16h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Rousseau', prenom: 'Théo', age: 17, taille: '1m88', poste: 'Attaquant', numero: 4 },
            { nom: 'Vincent', prenom: 'Hugo', age: 16, taille: '1m92', poste: 'Central', numero: 12 },
            { nom: 'Muller', prenom: 'Léo', age: 17, taille: '1m82', poste: 'Passeur', numero: 7 },
            { nom: 'Blanc', prenom: 'Nathan', age: 16, taille: '1m85', poste: 'Réceptionneur', numero: 1 },
            { nom: 'Guerin', prenom: 'Mathis', age: 17, taille: '1m90', poste: 'Attaquant', numero: 15 },
            { nom: 'Schmidt', prenom: 'Lucas', age: 16, taille: '1m94', poste: 'Central', numero: 3 },
            { nom: 'Hoffman', prenom: 'Maxime', age: 17, taille: '1m79', poste: 'Libéro', numero: 2 },
            { nom: 'Wagner', prenom: 'Enzo', age: 16, taille: '1m86', poste: 'Attaquant', numero: 8 }
        ],
        achievements: [
            '2ème place Championnat 2024',
            'Finaliste Tournoi Régional U18',
            '4 joueurs sélectionnés en équipe départementale',
            'Meilleure formation jeune 2024'
        ],
        stats: {
            matches: 18,
            wins: 14,
            losses: 4,
            points: 42
        }
    },
    'senior-f-prenat': {
        title: 'Senior Féminin Pré-Nationale',
        level: 'Pré-Nationale',
        description: 'Notre équipe féminine de haut niveau',
        coach: 'Sophie Martin',
        assistant: 'Claire Dubois',
        training: 'Lundi et Mercredi 20h-22h, Vendredi 18h-20h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Dupont', prenom: 'Marie', age: 26, taille: '1m78', poste: 'Attaquante', numero: 4 },
            { nom: 'Bernard', prenom: 'Sarah', age: 24, taille: '1m85', poste: 'Centrale', numero: 12 },
            { nom: 'Petit', prenom: 'Emma', age: 28, taille: '1m70', poste: 'Passeuse', numero: 7 },
            { nom: 'Durand', prenom: 'Claire', age: 25, taille: '1m75', poste: 'Réceptionneuse', numero: 1 },
            { nom: 'Martin', prenom: 'Lisa', age: 27, taille: '1m80', poste: 'Attaquante', numero: 15 },
            { nom: 'Leroy', prenom: 'Jade', age: 23, taille: '1m88', poste: 'Centrale', numero: 3 },
            { nom: 'Rousseau', prenom: 'Amélie', age: 29, taille: '1m68', poste: 'Libéro', numero: 2 },
            { nom: 'Garcia', prenom: 'Laura', age: 24, taille: '1m76', poste: 'Attaquante', numero: 8 },
            { nom: 'Moreau', prenom: 'Chloé', age: 26, taille: '1m83', poste: 'Centrale', numero: 11 },
            { nom: 'Laurent', prenom: 'Mathilde', age: 25, taille: '1m72', poste: 'Passeuse', numero: 6 },
            { nom: 'Blanc', prenom: 'Julie', age: 27, taille: '1m77', poste: 'Réceptionneuse', numero: 9 },
            { nom: 'Vincent', prenom: 'Manon', age: 22, taille: '1m74', poste: 'Attaquante', numero: 10 }
        ],
        achievements: [
            'Championnes Départementales 2024',
            '6 années en Pré-Nationale',
            'Demi-finalistes Coupe d\'Alsace 2024',
            'Meilleure défense du championnat'
        ],
        stats: {
            matches: 24,
            wins: 18,
            losses: 6,
            points: 54
        }
    },
    'senior-f-depart': {
        title: 'Senior Féminin Départemental',
        level: 'Départemental',
        description: 'Équipe féminine compétitive et conviviale',
        coach: 'Claire Dubois',
        assistant: 'Marie Dupont',
        training: 'Mardi et Jeudi 18h-20h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Moreau', prenom: 'Léa', age: 29, taille: '1m72', poste: 'Attaquante', numero: 4 },
            { nom: 'Fournier', prenom: 'Camille', age: 26, taille: '1m82', poste: 'Centrale', numero: 12 },
            { nom: 'Girard', prenom: 'Manon', age: 30, taille: '1m68', poste: 'Passeuse', numero: 7 },
            { nom: 'Roux', prenom: 'Julie', age: 27, taille: '1m76', poste: 'Libéro', numero: 1 },
            { nom: 'Simon', prenom: 'Océane', age: 25, taille: '1m79', poste: 'Attaquante', numero: 15 },
            { nom: 'Lefevre', prenom: 'Anaïs', age: 24, taille: '1m84', poste: 'Centrale', numero: 3 },
            { nom: 'Michel', prenom: 'Céline', age: 28, taille: '1m73', poste: 'Réceptionneuse', numero: 8 },
            { nom: 'Weber', prenom: 'Pauline', age: 23, taille: '1m75', poste: 'Attaquante', numero: 11 },
            { nom: 'Fischer', prenom: 'Aurélie', age: 26, taille: '1m70', poste: 'Passeuse', numero: 6 },
            { nom: 'Meyer', prenom: 'Elodie', age: 25, taille: '1m78', poste: 'Réceptionneuse', numero: 9 }
        ],
        achievements: [
            '4ème place Championnat 2024',
            'Progression constante depuis 3 ans',
            'Équipe révélation 2023',
            'Fair-play award 2024'
        ],
        stats: {
            matches: 22,
            wins: 13,
            losses: 9,
            points: 39
        }
    },
    'f18-depart': {
        title: 'F18 Départemental',
        level: 'Jeunes - Départemental',
        description: 'Nos jeunes volleyeuses prometteuses',
        coach: 'Marie Dupont',
        assistant: 'Sophie Martin',
        training: 'Mercredi 16h-18h, Samedi 10h-12h',
        stadium: 'Gymnase Municipal - Mundolsheim',
        players: [
            { nom: 'Lefebvre', prenom: 'Chloé', age: 17, taille: '1m75', poste: 'Attaquante', numero: 4 },
            { nom: 'Michel', prenom: 'Inès', age: 16, taille: '1m83', poste: 'Centrale', numero: 12 },
            { nom: 'Garnier', prenom: 'Zoé', age: 17, taille: '1m69', poste: 'Passeuse', numero: 7 },
            { nom: 'Vincent', prenom: 'Lou', age: 16, taille: '1m72', poste: 'Réceptionneuse', numero: 1 },
            { nom: 'Rousseau', prenom: 'Maya', age: 17, taille: '1m77', poste: 'Attaquante', numero: 15 },
            { nom: 'Schmidt', prenom: 'Lola', age: 16, taille: '1m81', poste: 'Centrale', numero: 3 },
            { nom: 'Hoffman', prenom: 'Emma', age: 17, taille: '1m66', poste: 'Libéro', numero: 2 },
            { nom: 'Wagner', prenom: 'Léa', age: 16, taille: '1m74', poste: 'Attaquante', numero: 8 }
        ],
        achievements: [
            '3ème place Championnat 2024',
            'Qualification Tournoi Régional U18',
            '3 joueuses en équipe départementale',
            'Révélation féminine 2024'
        ],
        stats: {
            matches: 18,
            wins: 12,
            losses: 6,
            points: 36
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
                        <p><strong>Assistant :</strong> ${team.assistant}</p>
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
                
                <div class="achievements-section">
                    <h4><i class="fas fa-trophy"></i> Palmarès</h4>
                    <div class="achievements-list">
                        ${team.achievements.map(achievement => `
                            <span class="achievement-item">${achievement}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="players-section">
                <h4><i class="fas fa-users"></i> Effectif (${team.players.length} joueurs)</h4>
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