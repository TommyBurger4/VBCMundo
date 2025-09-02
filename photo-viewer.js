class PhotoViewer {
    constructor() {
        this.albums = this.loadAlbums();
        this.currentAlbum = null;
        this.init();
    }

    init() {
        console.log('PhotoViewer - Albums chargés:', this.albums.length);
        console.log('PhotoViewer - Albums:', this.albums);
        this.renderAlbums();
        this.setupEventListeners();
        
        // Écouter les changements de localStorage
        window.addEventListener('storage', () => {
            this.albums = this.loadAlbums();
            this.renderAlbums();
        });
    }

    setupEventListeners() {
        // Fermer modal de visualisation
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Clic en dehors du modal
        document.getElementById('album-view-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'album-view-modal') this.closeModal();
        });
    }

    loadAlbums() {
        try {
            const stored = localStorage.getItem('vbc-photo-albums');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des albums:', error);
            return [];
        }
    }

    renderAlbums() {
        const grid = document.getElementById('albums-grid');
        if (!grid) return;

        if (this.albums.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Aucun album pour le moment</h3>
                    <p>Aucun album disponible</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.albums.map(album => `
            <div class="album-card">
                <div class="album-cover-container" onclick="photoViewer.viewAlbum('${album.id}')">
                    <img src="${album.cover.data}" alt="${album.title}" class="album-cover">
                    <div class="album-overlay">
                        <div class="album-info">
                            <h3>${album.title}</h3>
                            <p>${album.photos.length} photo${album.photos.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
                <div class="album-meta">
                    <h4>${album.title}</h4>
                    <span class="photo-count">${album.photos.length} photo${album.photos.length > 1 ? 's' : ''}</span>
                </div>
            </div>
        `).join('');
    }

    viewAlbum(albumId) {
        const album = this.albums.find(a => a.id === albumId);
        if (!album) return;

        this.currentAlbum = album;
        const modal = document.getElementById('album-view-modal');
        const title = document.getElementById('album-view-title');
        const grid = document.getElementById('album-photos-grid');

        title.textContent = album.title;
        
        grid.innerHTML = album.photos.map((photo, index) => `
            <div class="album-photo-item">
                <img src="${photo.data}" alt="${photo.name}" onclick="photoViewer.openLightbox(${index})">
            </div>
        `).join('');

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('album-view-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    openLightbox(photoIndex) {
        if (!this.currentAlbum) return;
        
        // Créer lightbox si elle n'existe pas
        let lightbox = document.getElementById('photo-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'photo-lightbox';
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close"><i class="fas fa-times"></i></button>
                    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                    <img class="lightbox-image" src="" alt="">
                    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                    <div class="lightbox-counter"></div>
                </div>
            `;
            document.body.appendChild(lightbox);

            // Event listeners pour la lightbox
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });

            lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
                this.showLightboxPhoto(this.currentPhotoIndex - 1);
            });

            lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
                this.showLightboxPhoto(this.currentPhotoIndex + 1);
            });

            // Navigation au clavier
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') {
                        lightbox.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    } else if (e.key === 'ArrowLeft') {
                        this.showLightboxPhoto(this.currentPhotoIndex - 1);
                    } else if (e.key === 'ArrowRight') {
                        this.showLightboxPhoto(this.currentPhotoIndex + 1);
                    }
                }
            });
        }

        this.currentPhotoIndex = photoIndex;
        this.showLightboxPhoto(photoIndex);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    showLightboxPhoto(index) {
        if (!this.currentAlbum) return;
        
        const photos = this.currentAlbum.photos;
        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;
        
        this.currentPhotoIndex = index;
        
        const lightbox = document.getElementById('photo-lightbox');
        const img = lightbox.querySelector('.lightbox-image');
        const counter = lightbox.querySelector('.lightbox-counter');
        
        img.src = photos[index].data;
        img.alt = photos[index].name;
        counter.textContent = `${index + 1} / ${photos.length}`;
    }
}

// Initialiser le visualiseur de photos
let photoViewer;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📸 Initialisation du visualiseur d\'albums photos');
    photoViewer = new PhotoViewer();
});