// Widget calendrier pour la page d'accueil
class HomeCalendarWidget {
    constructor() {
        this.matches = [];
        this.excelFile = 'matchs.xlsx';
    }

    // Charger le fichier Excel (même logique que calendar-manager)
    async loadExcelFile() {
        try {
            const response = await fetch(this.excelFile);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            let allMatches = [];
            
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                
                const teamName = this.formatTeamName(sheetName);
                const division = this.getDivisionByTeam(teamName);
                
                data.forEach(row => {
                    row['Equipe'] = teamName;
                    row['Division'] = division;
                });
                
                allMatches = allMatches.concat(data);
            });
            
            this.matches = this.processExcelData(allMatches);
            this.renderUpcomingMatches();
        } catch (error) {
            console.error('Erreur lors du chargement du fichier Excel:', error);
            this.showErrorMessage();
        }
    }

    // Méthodes utilitaires (mêmes que calendar-manager)
    formatTeamName(sheetName) {
        if (sheetName.toLowerCase().includes('feminine') || sheetName.toLowerCase().includes('feminin')) {
            return 'Senior Féminine';
        }
        return sheetName;
    }

    getDivisionByTeam(teamName) {
        if (teamName.includes('Pré-National')) return 'Pré-National';
        if (teamName.includes('Excellence')) return 'Excellence';
        if (teamName.includes('Honneur')) return 'Honneur';
        if (teamName === 'Senior Féminine') return 'Pré-National';
        return '';
    }

    processExcelData(data) {
        return data.map(row => {
            const dateStr = row['Date'];
            const date = this.parseDate(dateStr);
            
            return {
                equipe: row['Equipe'] || '',
                date: date,
                heure: this.parseTime(row['Heure']),
                lieu: row['Lieu'] || 'Domicile',
                adversaire: row['Adversaire'] || '',
                logo: row['Logo'] || null,
                scoreNous: row['Score Nous'] || null,
                scoreAdversaire: row['Score Adversaire'] || null,
                division: row['Division'] || '',
                type: row['Type'] || row['Journée'] || 'Championnat'
            };
        }).sort((a, b) => a.date - b.date);
    }

    parseDate(dateStr) {
        if (!dateStr) return new Date();
        
        if (typeof dateStr === 'number') {
            return new Date((dateStr - 25569) * 86400 * 1000);
        }
        
        if (typeof dateStr === 'string') {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
        
        return new Date(dateStr);
    }

    // Parser l'heure depuis Excel
    parseTime(timeValue) {
        if (!timeValue) return '';
        
        // Si c'est un nombre décimal (format Excel)
        if (typeof timeValue === 'number') {
            // Convertir le nombre décimal en heures et minutes
            const totalMinutes = Math.round(timeValue * 24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        // Si c'est déjà une chaîne, la retourner telle quelle
        return timeValue.toString();
    }

    // Obtenir les matchs de la semaine à venir
    getUpcomingWeekMatches() {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return this.matches.filter(match => {
            return match.date >= today && match.date <= nextWeek;
        }).slice(0, 5); // Limiter à 5 matchs max
    }

    // Afficher les matchs à venir
    renderUpcomingMatches() {
        const container = document.getElementById('upcoming-matches-widget');
        if (!container) return;
        
        const upcomingMatches = this.getUpcomingWeekMatches();
        
        if (upcomingMatches.length === 0) {
            container.innerHTML = `
                <div class="no-upcoming-matches">
                    <i class="fas fa-calendar-times"></i>
                    <p>Aucun match prévu cette semaine</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        upcomingMatches.forEach(match => {
            const matchElement = this.createUpcomingMatchItem(match);
            container.appendChild(matchElement);
        });
    }

    // Créer un élément de match pour l'accueil (version compacte)
    createUpcomingMatchItem(match) {
        const item = document.createElement('div');
        item.className = 'upcoming-match-item';
        
        const isHome = match.lieu.toLowerCase() === 'domicile';
        const day = match.date.getDate();
        const month = match.date.toLocaleDateString('fr-FR', { month: 'short' });
        const dayName = match.date.toLocaleDateString('fr-FR', { weekday: 'short' });
        
        // Logo HTML
        let logoHTML = '';
        if (match.logo) {
            const logoPath = match.logo.startsWith('http') ? match.logo : `public/logos/${match.logo}`;
            logoHTML = `<img src="${logoPath}" alt="${match.adversaire}" class="opponent-logo" onerror="this.style.display='none'">`;
        }
        
        // Type de match avec icône
        const typeClass = this.getTypeClass(match.type);
        const typeIcon = this.getTypeIcon(match.type);
        
        item.innerHTML = `
            <div class="match-date-compact">
                <div class="date-info">
                    <span class="day-name">${dayName}</span>
                    <span class="day-number">${day}</span>
                    <span class="month-name">${month}</span>
                </div>
            </div>
            <div class="match-content">
                <div class="match-header">
                    <span class="team-name">${match.equipe}</span>
                    <span class="match-type-compact ${typeClass}">
                        <i class="fas ${typeIcon}"></i> ${match.type}
                    </span>
                </div>
                <div class="match-teams-compact">
                    ${logoHTML}
                    <div class="teams-info">
                        ${isHome ? 
                            `<span class="home-indicator">🏠</span> vs <strong>${match.adversaire}</strong>` :
                            `<span class="away-indicator">✈️</span> @ <strong>${match.adversaire}</strong>`
                        }
                    </div>
                </div>
                <div class="match-time">
                    <i class="fas fa-clock"></i> ${match.heure}
                </div>
            </div>
        `;
        
        return item;
    }

    // Méthodes utilitaires pour les types
    getTypeClass(type) {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('coupe')) return 'type-coupe';
        if (typeLower.includes('amical')) return 'type-amicale';
        if (typeLower.includes('tournoi')) return 'type-tournoi';
        return 'type-championnat';
    }
    
    getTypeIcon(type) {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('coupe')) return 'fa-trophy';
        if (typeLower.includes('amical')) return 'fa-handshake';
        if (typeLower.includes('tournoi')) return 'fa-medal';
        return 'fa-calendar-week';
    }

    // Afficher un message d'erreur
    showErrorMessage() {
        const container = document.getElementById('upcoming-matches-widget');
        if (!container) return;
        
        container.innerHTML = `
            <div class="widget-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Impossible de charger les matchs</p>
            </div>
        `;
    }
}

// Initialiser le widget sur la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcoming-matches-widget')) {
        const homeWidget = new HomeCalendarWidget();
        homeWidget.loadExcelFile();
    }
});