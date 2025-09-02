// Gestionnaire de calendrier pour VBC Mundolsheim
class CalendarManager {
    constructor() {
        this.matches = [];
        this.filteredMatches = [];
        this.currentFilter = 'all';
        this.excelFile = 'matchs.xlsx';
    }

    // Charger le fichier Excel
    async loadExcelFile() {
        console.log('🔄 Début du chargement du fichier Excel:', this.excelFile);
        try {
            const response = await fetch(this.excelFile);
            console.log('📡 Réponse fetch reçue:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            console.log('📦 ArrayBuffer obtenu, taille:', arrayBuffer.byteLength, 'bytes');
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            console.log('✅ Fichier Excel chargé, onglets trouvés:', workbook.SheetNames);
            
            // Lire toutes les feuilles et combiner les données
            let allMatches = [];
            
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                
                // Ajouter le nom de l'équipe à chaque match basé sur le nom de l'onglet
                const teamName = this.formatTeamName(sheetName);
                const division = this.getDivisionByTeam(teamName);
                
                data.forEach(row => {
                    row['Equipe'] = teamName;
                    row['Division'] = division;
                });
                
                allMatches = allMatches.concat(data);
            });
            
            console.log(`📊 Total de ${allMatches.length} matchs trouvés dans le fichier`);
            this.matches = this.processExcelData(allMatches);
            console.log(`✅ ${this.matches.length} matchs traités et triés`);
            this.filteredMatches = [...this.matches];
            this.renderCalendar();
            this.initFilters();
            
            return Promise.resolve();
        } catch (error) {
            console.error('Erreur lors du chargement du fichier Excel:', error);
            // Afficher un message d'erreur à l'utilisateur
            this.showErrorMessage(error);
            return Promise.reject(error);
        }
    }
    
    // Formater le nom de l'équipe depuis le nom de l'onglet
    formatTeamName(sheetName) {
        // Convertir "Senior Feminine" en "Senior Féminine"
        if (sheetName.toLowerCase().includes('feminine') || sheetName.toLowerCase().includes('feminin')) {
            return 'Senior Féminine';
        }
        // Simplifier les noms d'équipes masculines si nécessaire
        // "Senior 1 Pré-National" peut rester tel quel ou être simplifié
        return sheetName;
    }
    
    // Obtenir la division par équipe
    getDivisionByTeam(teamName) {
        // La division est déjà dans le nom pour les équipes masculines
        if (teamName.includes('Pré-National')) return 'Pré-National';
        if (teamName.includes('Excellence')) return 'Excellence';
        if (teamName.includes('Honneur')) return 'Honneur';
        if (teamName === 'Senior Féminine') return 'Pré-National';
        
        return '';
    }

    // Traiter les données Excel
    processExcelData(data) {
        console.log('🔧 Début du traitement des données Excel');
        const processed = data.map((row, index) => {
            // Convertir la date Excel en objet Date JavaScript
            const dateStr = row['Date'];
            const date = this.parseDate(dateStr);
            
            const match = {
                equipe: row['Equipe'] || '',
                date: date,
                heure: this.parseTime(row['Heure']),
                lieu: row['Lieu'] || 'Domicile',
                adversaire: row['Adversaire'] || '',
                logo: row['Logo'] || null,
                scoreNous: row['Score Nous'] || null,
                scoreAdversaire: row['Score Adversaire'] || null,
                division: row['Division'] || '',
                type: row['Type'] || row['Journée'] || 'Championnat' // Support ancien format aussi
            };
            
            console.log(`Match ${index + 1}: ${match.equipe} vs ${match.adversaire} le ${match.date.toLocaleDateString('fr-FR')} à ${match.heure}`);
            return match;
        });
        
        // Trier par date
        const sorted = processed.sort((a, b) => {
            const diff = a.date - b.date;
            console.log(`Comparaison: ${a.date.toLocaleDateString('fr-FR')} vs ${b.date.toLocaleDateString('fr-FR')} = ${diff}`);
            return diff;
        });
        
        console.log('✅ Données triées chronologiquement');
        return sorted;
    }

    // Parser une date depuis Excel
    parseDate(dateStr) {
        if (!dateStr) {
            console.warn('⚠️ Date vide reçue, utilisation de la date actuelle');
            return new Date();
        }
        
        // Si c'est un nombre (date Excel)
        if (typeof dateStr === 'number') {
            // Méthode standard pour convertir une date Excel
            // Excel compte les jours depuis le 30 décembre 1899 (avec le bug du 29/02/1900)
            // 25569 = nombre de jours entre 30/12/1899 et 01/01/1970 (Unix epoch)
            const date = new Date((dateStr - 25569) * 86400 * 1000);
            
            console.log(`📅 Date Excel ${dateStr} convertie en: ${date.toLocaleDateString('fr-FR')}`);
            return date;
        }
        
        // Si c'est une chaîne de caractères
        if (typeof dateStr === 'string') {
            // Format DD/MM/YYYY
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const date = new Date(parts[2], parts[1] - 1, parts[0]);
                console.log(`📅 Date string "${dateStr}" convertie en: ${date.toLocaleDateString('fr-FR')}`);
                return date;
            }
        }
        
        const date = new Date(dateStr);
        console.log(`📅 Date directe "${dateStr}" convertie en: ${date.toLocaleDateString('fr-FR')}`);
        return date;
    }

    // Parser l'heure depuis Excel
    parseTime(timeValue) {
        if (!timeValue) {
            console.warn('⚠️ Heure vide reçue');
            return '';
        }
        
        // Si c'est un nombre décimal (format Excel)
        if (typeof timeValue === 'number') {
            // Convertir le nombre décimal en heures et minutes
            const totalMinutes = Math.round(timeValue * 24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            console.log(`⏰ Heure Excel ${timeValue} convertie en: ${time}`);
            return time;
        }
        
        // Si c'est déjà une chaîne, la retourner telle quelle
        console.log(`⏰ Heure string reçue: ${timeValue}`);
        return timeValue.toString();
    }

    // Filtrer les matchs par équipe
    filterByTeam(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredMatches = [...this.matches];
        } else if (filter === 'masculines') {
            // Toutes les équipes masculines
            this.filteredMatches = this.matches.filter(match => {
                const teamName = match.equipe.toLowerCase();
                return !teamName.includes('fémin') && !teamName.includes('fille') && 
                       !teamName.includes('f18') && !teamName.includes('f21');
            });
        } else if (filter === 'feminines') {
            // Toutes les équipes féminines
            this.filteredMatches = this.matches.filter(match => {
                const teamName = match.equipe.toLowerCase();
                return teamName.includes('fémin') || teamName.includes('fille') || 
                       teamName.includes('f18') || teamName.includes('f21');
            });
        } else {
            // Filtre spécifique par nom d'équipe
            this.filteredMatches = this.matches.filter(match => 
                match.equipe.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        this.renderCalendar();
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
        
        // Utiliser toujours l'affichage chronologique
        this.renderChronologicalCalendar(container);
    }
    
    // Affichage chronologique (tous les matchs mélangés par date)
    renderChronologicalCalendar(container) {
        const structure = document.createElement('div');
        structure.className = 'chronological-calendar';
        
        const title = document.createElement('h2');
        title.className = 'chronological-title';
        
        // Titre dynamique selon le filtre
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
    
    // Tous les affichages utilisent maintenant le format chronologique
    renderTeamBasedCalendar(container) {
        this.renderChronologicalCalendar(container);
    }
    
    // Extraire le numéro d'équipe (1, 2, 3, etc.)
    extractTeamNumber(teamName) {
        const match = teamName.match(/\b(\d+)\b/);
        return match ? parseInt(match[1]) : null;
    }

    // Grouper les matchs par équipe
    groupMatchesByTeam(matches) {
        const grouped = {};
        
        matches.forEach(match => {
            if (!grouped[match.equipe]) {
                grouped[match.equipe] = [];
            }
            grouped[match.equipe].push(match);
        });
        
        return grouped;
    }

    // Créer une colonne pour une équipe
    createTeamColumn(teamName, matches, gender = 'masculine') {
        const column = document.createElement('div');
        column.className = 'calendar-column';
        
        // En-tête de l'équipe
        const header = document.createElement('div');
        header.className = 'calendar-title';
        
        // Déterminer l'icône selon le genre
        const icon = gender === 'feminine' ? 'fa-venus' : 'fa-mars';
        
        // Formater le nom de l'équipe pour l'affichage
        let displayName = teamName;
        // Le nom est déjà bien formaté depuis l'Excel
        
        header.innerHTML = `
            <i class="fas ${icon}"></i>
            <h3>${displayName}</h3>
            <span class="level-badge">${matches[0]?.division || ''}</span>
        `;
        
        column.appendChild(header);
        
        // Liste des matchs
        const matchesList = document.createElement('div');
        matchesList.className = 'calendar-matches';
        
        matches.forEach(match => {
            const matchItem = this.createMatchItem(match);
            matchesList.appendChild(matchItem);
        });
        
        column.appendChild(matchesList);
        
        return column;
    }

    // Créer un élément de match (utilise le même style chronologique)
    createMatchItem(match) {
        return this.createChronologicalMatchItem(match);
    }
    
    // Créer un élément de match chronologique
    createChronologicalMatchItem(match) {
        const item = document.createElement('div');
        const isHome = match.lieu.toLowerCase() === 'domicile';
        const isPast = match.date < new Date();
        const hasResult = match.scoreNous !== null && match.scoreAdversaire !== null;
        
        item.className = `chronological-match-item ${isHome ? 'home' : 'away'} ${isPast && !hasResult ? 'past' : ''}`;
        
        // Formater la date
        const day = match.date.getDate();
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const month = monthNames[match.date.getMonth()];
        const dayName = match.date.toLocaleDateString('fr-FR', { weekday: 'long' });
        
        // Logo HTML - toujours afficher le logo de l'équipe adverse
        let logoHTML = '';
        if (match.logo) {
            const logoPath = match.logo.startsWith('http') ? match.logo : `public/logos/${match.logo}`;
            logoHTML = `
                <div class="chronological-logo">
                    <img src="${logoPath}" alt="${match.adversaire}" onerror="this.style.display='none'">
                </div>
            `;
        } else {
            // Logo par défaut générique pour les équipes sans logo
            logoHTML = `
                <div class="chronological-logo">
                    <div class="default-logo">${match.adversaire.substring(0, 2).toUpperCase()}</div>
                </div>
            `;
        }
        
        // Résultat HTML
        let resultHTML = '';
        if (hasResult) {
            const isWin = match.scoreNous > match.scoreAdversaire;
            const resultClass = isWin ? 'win' : (match.scoreNous < match.scoreAdversaire ? 'loss' : 'draw');
            
            resultHTML = `
                <div class="chronological-result ${resultClass}">
                    <span class="score">${match.scoreNous} - ${match.scoreAdversaire}</span>
                </div>
            `;
        }
        
        // Type de match
        const typeClass = this.getTypeClass(match.type);
        const typeIcon = this.getTypeIcon(match.type);
        
        item.innerHTML = `
            <div class="chronological-date">
                <span class="day-name">${dayName}</span>
                <span class="day-number">${day}</span>
                <span class="month-name">${month}</span>
            </div>
            <div class="chronological-info">
                ${logoHTML}
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
                        <span class="match-type ${typeClass}"><i class="fas ${typeIcon}"></i> ${match.type}</span>
                    </div>
                </div>
                ${resultHTML}
            </div>
        `;
        
        return item;
    }

    // Obtenir la classe CSS selon le type de match
    getTypeClass(type) {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('coupe')) return 'type-coupe';
        if (typeLower.includes('amical')) return 'type-amicale';
        if (typeLower.includes('tournoi')) return 'type-tournoi';
        return 'type-championnat';
    }
    
    // Obtenir l'icône selon le type de match
    getTypeIcon(type) {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('coupe')) return 'fa-trophy';
        if (typeLower.includes('amical')) return 'fa-handshake';
        if (typeLower.includes('tournoi')) return 'fa-medal';
        return 'fa-calendar-week';
    }
    
    // Afficher un message d'erreur
    showErrorMessage(error) {
        const container = document.getElementById('calendar-container');
        if (!container) return;
        
        let errorDetails = 'Le fichier des matchs n\'a pas pu être chargé.';
        if (error) {
            if (error.message.includes('404')) {
                errorDetails = 'Le fichier "matchs.xlsx" n\'a pas été trouvé. Vérifiez qu\'il est bien dans le répertoire racine.';
            } else if (error.message.includes('Failed to fetch')) {
                errorDetails = 'Impossible de charger le fichier. Assurez-vous que le serveur web est démarré.';
            } else {
                errorDetails = `Erreur: ${error.message}`;
            }
        }
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>${errorDetails}</p>
                <button onclick="calendarManager.loadExcelFile()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
            </div>
        `;
    }

    // Initialiser les filtres
    initFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        // Créer les filtres dynamiquement basés sur les équipes disponibles
        const uniqueTeams = [...new Set(this.matches.map(match => match.equipe))];
        
        let filterButtons = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                    <i class="fas fa-globe"></i> Toutes les équipes
                </button>
        `;
        
        // Ajouter des filtres pour chaque équipe
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
        
        // Insérer les filtres avant le conteneur de calendrier
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
                // Retirer la classe active de tous les boutons
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');
                // Appliquer le filtre
                this.filterByTeam(btn.dataset.filter);
            });
        });
    }
}

// Initialiser le gestionnaire au chargement de la page
let calendarManager;

// Initialiser immédiatement puisque le script est chargé après DOMContentLoaded
console.log('🚀 Initialisation CalendarManager');
calendarManager = new CalendarManager();

// Charger le fichier Excel
console.log('📁 Tentative de chargement du fichier Excel');
calendarManager.loadExcelFile().catch(error => {
    console.error('💥 Erreur fatale lors du chargement:', error);
});