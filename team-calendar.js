// Gestionnaire de calendrier spécifique pour une équipe
class TeamCalendar {
    constructor(teamFilter) {
        this.teamFilter = teamFilter; // 'masculines', 'feminines', ou nom d'équipe spécifique
        this.matches = [];
        this.excelFile = 'matchs.xlsx';
    }

    // Charger et filtrer les matchs pour cette équipe
    async loadTeamMatches() {
        try {
            const response = await fetch(this.excelFile);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            let allMatches = [];
            
            workbook.SheetNames.forEach(sheetName => {
                // Filtrer les onglets selon le filtre d'équipe
                if (!this.shouldIncludeSheet(sheetName)) return;
                
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
            this.renderTeamCalendar();
        } catch (error) {
            console.error('Erreur lors du chargement du fichier Excel:', error);
            this.showErrorMessage();
        }
    }

    // Déterminer si on doit inclure un onglet selon le filtre
    shouldIncludeSheet(sheetName) {
        const name = sheetName.toLowerCase();
        
        if (this.teamFilter === 'masculines') {
            return !name.includes('feminine') && !name.includes('feminin');
        }
        
        if (this.teamFilter === 'feminines') {
            return name.includes('feminine') || name.includes('feminin');
        }
        
        // Filtre spécifique (ex: "Senior 1")
        return name.includes(this.teamFilter.toLowerCase());
    }

    // Méthodes utilitaires (reprises de calendar-manager)
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

    // Afficher le calendrier de l'équipe
    renderTeamCalendar() {
        const container = document.getElementById('team-calendar-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.matches.length === 0) {
            container.innerHTML = `
                <div class="no-matches">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Aucun match programmé</h3>
                    <p>Les matchs apparaîtront ici dès qu'ils seront ajoutés au calendrier.</p>
                </div>
            `;
            return;
        }

        // Séparer les matchs par équipe
        const matchesByTeam = this.groupMatchesByTeam();
        
        Object.keys(matchesByTeam).sort().forEach(teamName => {
            const teamSection = this.createTeamSection(teamName, matchesByTeam[teamName]);
            container.appendChild(teamSection);
        });
    }

    // Grouper les matchs par équipe
    groupMatchesByTeam() {
        const grouped = {};
        
        this.matches.forEach(match => {
            if (!grouped[match.equipe]) {
                grouped[match.equipe] = [];
            }
            grouped[match.equipe].push(match);
        });
        
        return grouped;
    }

    // Créer une section pour une équipe
    createTeamSection(teamName, matches) {
        const section = document.createElement('div');
        section.className = 'team-calendar-section';
        
        // En-tête de l'équipe
        const header = document.createElement('div');
        header.className = 'team-section-header';
        
        const icon = teamName.includes('Féminine') ? 'fa-venus' : 'fa-mars';
        const division = matches[0]?.division || '';
        
        header.innerHTML = `
            <h3><i class="fas ${icon}"></i> ${teamName}</h3>
            ${division ? `<span class="division-badge">${division}</span>` : ''}
        `;
        
        section.appendChild(header);
        
        // Liste des matchs
        const matchesList = document.createElement('div');
        matchesList.className = 'team-matches-list';
        
        matches.forEach(match => {
            const matchItem = this.createTeamMatchItem(match);
            matchesList.appendChild(matchItem);
        });
        
        section.appendChild(matchesList);
        
        return section;
    }

    // Créer un élément de match pour une équipe
    createTeamMatchItem(match) {
        const item = document.createElement('div');
        const isHome = match.lieu.toLowerCase() === 'domicile';
        const isPast = match.date < new Date();
        const hasResult = match.scoreNous !== null && match.scoreAdversaire !== null;
        
        item.className = `team-match-item ${isHome ? 'home' : 'away'} ${isPast && !hasResult ? 'past' : ''}`;
        
        const day = match.date.getDate();
        const month = match.date.toLocaleDateString('fr-FR', { month: 'short' });
        
        // Logo
        let logoHTML = '';
        if (match.logo) {
            const logoPath = match.logo.startsWith('http') ? match.logo : `public/logos/${match.logo}`;
            logoHTML = `
                <div class="team-match-logo">
                    <img src="${logoPath}" alt="${match.adversaire}" onerror="this.style.display='none'">
                </div>
            `;
        }
        
        // Résultat
        let resultHTML = '';
        if (hasResult) {
            const isWin = match.scoreNous > match.scoreAdversaire;
            const resultClass = isWin ? 'win' : (match.scoreNous < match.scoreAdversaire ? 'loss' : 'draw');
            
            resultHTML = `
                <div class="team-match-result ${resultClass}">
                    ${match.scoreNous} - ${match.scoreAdversaire}
                </div>
            `;
        }
        
        // Type de match
        const typeClass = this.getTypeClass(match.type);
        const typeIcon = this.getTypeIcon(match.type);
        
        item.innerHTML = `
            <div class="team-match-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="team-match-info">
                ${logoHTML}
                <div class="team-match-details">
                    <div class="opponent-name">${match.adversaire}</div>
                    <div class="match-meta">
                        <span class="time"><i class="fas fa-clock"></i> ${match.heure}</span>
                        <span class="location"><i class="fas fa-${isHome ? 'home' : 'plane'}"></i> ${match.lieu}</span>
                        <span class="match-type ${typeClass}"><i class="fas ${typeIcon}"></i> ${match.type}</span>
                    </div>
                </div>
                ${resultHTML}
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
        const container = document.getElementById('team-calendar-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="team-calendar-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger le calendrier de l'équipe.</p>
            </div>
        `;
    }
}

// Initialiser selon la page
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('team-calendar-container');
    if (!container) return;
    
    // Déterminer le filtre selon la page
    let teamFilter = 'all';
    const path = window.location.pathname;
    
    if (path.includes('masculines.html')) {
        teamFilter = 'masculines';
    } else if (path.includes('feminines.html')) {
        teamFilter = 'feminines';
    } else if (path.includes('senior-m-elite.html')) {
        teamFilter = 'Senior 1';
    } else if (path.includes('senior-m-depart.html')) {
        teamFilter = 'Senior 2';
    }
    
    const teamCalendar = new TeamCalendar(teamFilter);
    teamCalendar.loadTeamMatches();
});