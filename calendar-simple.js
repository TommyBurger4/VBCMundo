// Calendrier simple sans dépendance XLSX
class SimpleCalendarManager {
    constructor() {
        this.matches = [];
        this.filteredMatches = [];
        this.currentFilter = 'all';
        this.initializeWithStaticData();
    }

    // Données statiques de test (à remplacer par vos vraies données)
    initializeWithStaticData() {
        this.matches = [
            // Équipe Masculine
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 6, 27), heure: '20:00', lieu: 'Domicile', adversaire: 'AS Strasbourg', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 7, 3), heure: '19:30', lieu: 'Extérieur', adversaire: 'RC Haguenau', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 7, 10), heure: '20:00', lieu: 'Domicile', adversaire: 'VB Sélestat', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 7, 17), heure: '20:30', lieu: 'Extérieur', adversaire: 'Mulhouse VB', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 7, 24), heure: '20:00', lieu: 'Domicile', adversaire: 'Illkirch VB', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior 1 Pré-National', date: new Date(2024, 7, 31), heure: '19:00', lieu: 'Extérieur', adversaire: 'Obernai VS', division: 'Pré-National', type: 'Championnat' },
            
            // Équipe Féminine
            { equipe: 'Senior Féminine', date: new Date(2024, 6, 28), heure: '15:30', lieu: 'Extérieur', adversaire: 'RC Colmar', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior Féminine', date: new Date(2024, 7, 4), heure: '16:00', lieu: 'Domicile', adversaire: 'Strasbourg UC', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior Féminine', date: new Date(2024, 7, 11), heure: '18:00', lieu: 'Extérieur', adversaire: 'Haguenau VB', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior Féminine', date: new Date(2024, 7, 18), heure: '16:00', lieu: 'Domicile', adversaire: 'Sélestat VB', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior Féminine', date: new Date(2024, 7, 25), heure: '16:00', lieu: 'Domicile', adversaire: 'Mulhouse AS', division: 'Pré-National', type: 'Championnat' },
            { equipe: 'Senior Féminine', date: new Date(2024, 8, 1), heure: '17:00', lieu: 'Extérieur', adversaire: 'Illkirch GV', division: 'Pré-National', type: 'Championnat' }
        ];

        // Trier chronologiquement
        this.matches.sort((a, b) => a.date - b.date);
        this.filteredMatches = [...this.matches];
        
        this.renderCalendar();
        this.initFilters();
    }

    // Filtrer les matchs par équipe
    filterByTeam(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredMatches = [...this.matches];
        } else if (filter === 'masculines') {
            this.filteredMatches = this.matches.filter(match => {
                const teamName = match.equipe.toLowerCase();
                return !teamName.includes('fémin');
            });
        } else if (filter === 'feminines') {
            this.filteredMatches = this.matches.filter(match => {
                const teamName = match.equipe.toLowerCase();
                return teamName.includes('fémin');
            });
        } else {
            this.filteredMatches = this.matches.filter(match => 
                match.equipe.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        this.renderCalendar();
        this.updateActiveFilter(filter);
    }

    // Mettre à jour le bouton actif
    updateActiveFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }

    // Afficher le calendrier
    renderCalendar() {
        const container = document.getElementById('calendar-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.filteredMatches.length === 0) {
            container.innerHTML = `
                <div class="no-matches">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Aucun match trouvé</h3>
                    <p>Aucun match ne correspond au filtre sélectionné.</p>
                </div>
            `;
            return;
        }
        
        this.renderChronologicalCalendar(container);
    }
    
    // Affichage chronologique
    renderChronologicalCalendar(container) {
        const structure = document.createElement('div');
        structure.className = 'chronological-calendar';
        
        const title = document.createElement('h2');
        title.className = 'chronological-title';
        
        let titleText = '';
        if (this.currentFilter === 'all') {
            titleText = '<i class="fas fa-clock"></i> Tous les matchs par ordre chronologique';
        } else if (this.currentFilter === 'masculines') {
            titleText = '<i class="fas fa-mars"></i> Équipes Masculines - Ordre chronologique';
        } else if (this.currentFilter === 'feminines') {
            titleText = '<i class="fas fa-venus"></i> Équipes Féminines - Ordre chronologique';
        } else {
            titleText = `<i class="fas fa-volleyball-ball"></i> ${this.currentFilter} - Ordre chronologique`;
        }
        
        title.innerHTML = titleText;
        structure.appendChild(title);
        
        const matchesList = document.createElement('div');
        matchesList.className = 'chronological-matches-list';
        
        // Trier tous les matchs par date
        const sortedMatches = [...this.filteredMatches].sort((a, b) => a.date - b.date);
        
        sortedMatches.forEach(match => {
            const matchItem = this.createChronologicalMatchItem(match);
            matchesList.appendChild(matchItem);
        });
        
        structure.appendChild(matchesList);
        container.appendChild(structure);
    }

    // Créer un élément de match chronologique
    createChronologicalMatchItem(match) {
        const item = document.createElement('div');
        const isHome = match.lieu.toLowerCase() === 'domicile';
        const isPast = match.date < new Date();
        
        item.className = `chronological-match-item ${isHome ? 'home' : 'away'} ${isPast ? 'past' : ''}`;
        
        const day = match.date.getDate();
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const month = monthNames[match.date.getMonth()];
        const dayName = match.date.toLocaleDateString('fr-FR', { weekday: 'long' });
        
        item.innerHTML = `
            <div class="chronological-date">
                <span class="day-name">${dayName}</span>
                <span class="day-number">${day}</span>
                <span class="month-name">${month}</span>
            </div>
            <div class="chronological-info">
                <div class="chronological-details">
                    <div class="team-indicator">
                        <span class="team-badge">${match.equipe}</span>
                    </div>
                    <div class="match-teams-chrono">
                        ${isHome ? 
                            `<span class="home-team">VBC Mundolsheim</span>
                             <span class="vs">vs</span>
                             <span class="away-team">${match.adversaire}</span>` :
                            `<span class="home-team">${match.adversaire}</span>
                             <span class="vs">vs</span>
                             <span class="away-team">VBC Mundolsheim</span>`
                        }
                    </div>
                    <div class="chronological-meta">
                        <span class="time"><i class="fas fa-clock"></i> ${match.heure}</span>
                        <span class="location"><i class="fas fa-${isHome ? 'home' : 'plane'}"></i> ${match.lieu}</span>
                        <span class="match-type"><i class="fas fa-calendar-week"></i> ${match.type}</span>
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }

    // Initialiser les filtres
    initFilters() {
        const uniqueTeams = [...new Set(this.matches.map(match => match.equipe))];
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        let filterButtons = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                    <i class="fas fa-globe"></i> Toutes les équipes
                </button>
        `;
        
        uniqueTeams.sort().forEach(team => {
            const icon = team.includes('Féminine') ? 'fa-venus' : 'fa-mars';
            filterButtons += `
                <button class="filter-btn" data-filter="${team}">
                    <i class="fas ${icon}"></i> ${team}
                </button>
            `;
        });
        
        filterButtons += '</div>';
        filterContainer.innerHTML = filterButtons;
        
        const calendarSection = document.querySelector('.calendar-section .container');
        if (calendarSection) {
            const header = calendarSection.querySelector('.calendar-header');
            if (header) {
                header.insertAdjacentElement('afterend', filterContainer);
            }
        }
        
        // Ajouter les écouteurs d'événements
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByTeam(btn.dataset.filter);
            });
        });
    }
}

// Initialiser le gestionnaire simple
let simpleCalendarManager;

document.addEventListener('DOMContentLoaded', () => {
    simpleCalendarManager = new SimpleCalendarManager();
});