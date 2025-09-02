class AlbumManager {
    constructor() {
        this.albums = this.loadAlbums();
        this.currentAlbum = null;
        this.editingAlbumId = null;
        this.init();
    }

    init() {
        console.log('Albums chargés:', this.albums.length);
        console.log('Albums:', this.albums);
        this.renderManageAlbums();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Bouton créer album
        const addAlbumBtn = document.querySelector('.add-album-btn');
        addAlbumBtn?.addEventListener('click', () => this.showCreateModal());

        // Fermer modals
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Clic en dehors du modal
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });

        // Formulaires
        const albumForm = document.getElementById('album-form');
        const editForm = document.getElementById('edit-album-form');
        
        albumForm?.addEventListener('submit', (e) => this.handleCreateAlbum(e));
        editForm?.addEventListener('submit', (e) => this.handleEditAlbum(e));

        // Preview des fichiers
        const coverInput = document.getElementById('album-cover');
        const photosInput = document.getElementById('album-photos');
        const addPhotosInput = document.getElementById('add-photos');
        
        coverInput?.addEventListener('change', (e) => this.previewCover(e));
        photosInput?.addEventListener('change', (e) => this.previewPhotos(e));
        addPhotosInput?.addEventListener('change', (e) => this.previewAddPhotos(e));
        
        // Éditeur de couverture
        const changeCoverInput = document.getElementById('change-cover');
        changeCoverInput?.addEventListener('change', (e) => this.setupCoverEditor(e));
        
        // Contrôles de positionnement
        const positionX = document.getElementById('position-x');
        const positionY = document.getElementById('position-y');
        const zoom = document.getElementById('zoom');
        
        positionX?.addEventListener('input', () => this.updateCoverPreview());
        positionY?.addEventListener('input', () => this.updateCoverPreview());
        zoom?.addEventListener('input', () => this.updateCoverPreview());
    }

    showCreateModal() {
        const modal = document.getElementById('album-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.resetForm();
        this.resetCoverEditor();
    }

    resetForm() {
        document.getElementById('album-form')?.reset();
        document.getElementById('edit-album-form')?.reset();
        document.getElementById('cover-preview').innerHTML = '';
        document.getElementById('photos-preview').innerHTML = '';
        document.getElementById('add-photos-preview').innerHTML = '';
    }

    resetCoverEditor() {
        const editor = document.getElementById('cover-editor');
        if (editor) {
            editor.style.display = 'none';
            this.newCoverFile = null;
            this.originalCoverData = null;
        }
    }

    previewCover(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('cover-preview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `
                    <div class="preview-item">
                        <img src="${e.target.result}" alt="Preview">
                        <span class="preview-name">${file.name}</span>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    previewPhotos(event) {
        const files = Array.from(event.target.files);
        const preview = document.getElementById('photos-preview');
        
        if (files.length > 0) {
            preview.innerHTML = '';
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <span class="preview-name">${file.name}</span>
                    `;
                    preview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    async handleCreateAlbum(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const coverFile = formData.get('cover');
        const photoFiles = formData.getAll('photos');

        if (!title || !coverFile) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            // Convertir les fichiers en base64 pour le stockage local
            const coverBase64 = await this.fileToBase64(coverFile);
            const photosBase64 = await Promise.all(
                photoFiles.map(file => this.fileToBase64(file))
            );

            const album = {
                id: Date.now().toString(),
                title,
                cover: {
                    data: coverBase64,
                    name: coverFile.name
                },
                photos: photosBase64.map((data, index) => ({
                    data,
                    name: photoFiles[index].name
                })),
                createdAt: new Date().toISOString()
            };

            this.albums.push(album);
            if (this.saveAlbums()) {
                this.renderManageAlbums();
                this.closeModals();
                // Forcer la mise à jour de la page photos si elle est ouverte
                window.dispatchEvent(new Event('storage'));
            }

            // Notification de succès
            this.showNotification('Album créé avec succès !', 'success');

        } catch (error) {
            console.error('Erreur lors de la création de l\'album:', error);
            this.showNotification('Erreur lors de la création de l\'album', 'error');
        }
    }

    fileToBase64(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Calculer les nouvelles dimensions
                        let { width, height } = img;
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Redimensionner l'image
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convertir en base64 compressé
                        const compressedData = canvas.toDataURL('image/jpeg', quality);
                        resolve(compressedData);
                    } catch (error) {
                        console.error('Erreur compression:', error);
                        // Fallback: retourner l'image originale
                        resolve(e.target.result);
                    }
                };
                
                img.onerror = (error) => {
                    console.error('Erreur chargement image:', error);
                    // Fallback: retourner l'image originale
                    resolve(e.target.result);
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    renderManageAlbums() {
        const grid = document.getElementById('manage-albums-grid');
        if (!grid) return;

        if (this.albums.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Aucun album pour le moment</h3>
                    <p>Créez votre premier album en cliquant sur le bouton ci-dessus</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.albums.map(album => `
            <div class="manage-album-card" data-album-id="${album.id}">
                <div class="album-cover-container">
                    <img src="${album.cover.data}" alt="${album.title}" class="album-cover">
                    <div class="album-overlay">
                        <div class="album-info">
                            <h3>${album.title}</h3>
                            <p>${album.photos.length} photo${album.photos.length > 1 ? 's' : ''}</p>
                        </div>
                        <div class="album-actions">
                            <button class="album-btn edit-btn" onclick="albumManager.editAlbum('${album.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="album-btn delete-btn" onclick="albumManager.deleteAlbum('${album.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
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

    editAlbum(albumId) {
        const album = this.albums.find(a => a.id === albumId);
        if (!album) return;

        this.editingAlbumId = albumId;
        
        // Remplir le formulaire d'édition
        document.getElementById('edit-album-title').value = album.title;
        
        // Afficher les photos actuelles
        const currentGrid = document.getElementById('current-photos-grid');
        currentGrid.innerHTML = album.photos.map((photo, index) => `
            <div class="current-photo-item">
                <img src="${photo.data}" alt="${photo.name}">
                <button class="remove-photo-btn" onclick="albumManager.removePhoto(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Afficher le modal d'édition
        const modal = document.getElementById('edit-album-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    deleteAlbum(albumId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
            this.albums = this.albums.filter(album => album.id !== albumId);
            if (this.saveAlbums()) {
                this.renderManageAlbums();
                this.showNotification('Album supprimé', 'success');
            }
        }
    }

    removePhoto(photoIndex) {
        if (!this.editingAlbumId) return;
        
        const album = this.albums.find(a => a.id === this.editingAlbumId);
        if (!album) return;
        
        album.photos.splice(photoIndex, 1);
        this.saveAlbums();
        
        // Rerendre les photos actuelles
        const currentGrid = document.getElementById('current-photos-grid');
        currentGrid.innerHTML = album.photos.map((photo, index) => `
            <div class="current-photo-item">
                <img src="${photo.data}" alt="${photo.name}">
                <button class="remove-photo-btn" onclick="albumManager.removePhoto(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    async handleEditAlbum(event) {
        event.preventDefault();
        
        if (!this.editingAlbumId) return;
        
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const newPhotoFiles = formData.getAll('photos');
        
        const album = this.albums.find(a => a.id === this.editingAlbumId);
        if (!album) return;
        
        try {
            // Mettre à jour le titre
            album.title = title;
            
            // Changer la couverture si une nouvelle est sélectionnée
            if (this.newCoverFile) {
                const newCoverData = await this.getCroppedCover();
                if (newCoverData) {
                    album.cover = {
                        data: newCoverData,
                        name: this.newCoverFile.name
                    };
                }
            }
            
            // Ajouter les nouvelles photos
            if (newPhotoFiles.length > 0) {
                const newPhotosBase64 = await Promise.all(
                    newPhotoFiles.map(file => this.fileToBase64(file))
                );
                
                const newPhotos = newPhotosBase64.map((data, index) => ({
                    data,
                    name: newPhotoFiles[index].name
                }));
                
                album.photos.push(...newPhotos);
            }
            
            this.saveAlbums();
            this.renderManageAlbums();
            this.closeModals();
            this.showNotification('Album modifié avec succès !', 'success');
            
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            this.showNotification('Erreur lors de la modification', 'error');
        }
    }

    previewAddPhotos(event) {
        const files = Array.from(event.target.files);
        const preview = document.getElementById('add-photos-preview');
        
        if (files.length > 0) {
            preview.innerHTML = '';
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <span class="preview-name">${file.name}</span>
                    `;
                    preview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    setupCoverEditor(event) {
        const file = event.target.files[0];
        if (!file) return;

        const editor = document.getElementById('cover-editor');
        const img = document.getElementById('cover-preview-img');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                editor.style.display = 'block';
                this.resetCoverControls();
                this.newCoverFile = file;
                this.originalCoverData = e.target.result;
            };
        };
        reader.readAsDataURL(file);
    }

    resetCoverControls() {
        document.getElementById('position-x').value = 50;
        document.getElementById('position-y').value = 50;
        document.getElementById('zoom').value = 100;
        this.updateCoverPreview();
    }

    updateCoverPreview() {
        const img = document.getElementById('cover-preview-img');
        const posX = document.getElementById('position-x').value;
        const posY = document.getElementById('position-y').value;
        const zoom = document.getElementById('zoom').value;
        
        if (!img) return;
        
        const scale = zoom / 100;
        const translateX = (posX - 50) * 2;
        const translateY = (posY - 50) * 2;
        
        img.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
        img.style.transformOrigin = 'center center';
    }

    async getCroppedCover() {
        if (!this.newCoverFile || !this.originalCoverData) return null;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        return new Promise((resolve) => {
            img.onload = () => {
                // Utiliser les mêmes dimensions que l'affichage final
                const containerSize = 200;
                canvas.width = containerSize;
                canvas.height = containerSize;
                
                // Reproduire exactement la transformation CSS
                const posX = document.getElementById('position-x').value;
                const posY = document.getElementById('position-y').value;
                const zoom = document.getElementById('zoom').value;
                
                const scale = zoom / 100;
                const translateX = (posX - 50) * 2;
                const translateY = (posY - 50) * 2;
                
                // Appliquer la transformation
                ctx.save();
                ctx.translate(containerSize/2, containerSize/2);
                ctx.scale(scale, scale);
                ctx.translate(translateX * containerSize / 200, translateY * containerSize / 200);
                ctx.translate(-containerSize/2, -containerSize/2);
                
                // Dessiner l'image pour qu'elle remplisse le container
                const aspectRatio = img.width / img.height;
                let drawWidth, drawHeight, drawX, drawY;
                
                if (aspectRatio > 1) {
                    // Image plus large que haute
                    drawHeight = containerSize;
                    drawWidth = containerSize * aspectRatio;
                    drawX = (containerSize - drawWidth) / 2;
                    drawY = 0;
                } else {
                    // Image plus haute que large
                    drawWidth = containerSize;
                    drawHeight = containerSize / aspectRatio;
                    drawX = 0;
                    drawY = (containerSize - drawHeight) / 2;
                }
                
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                ctx.restore();
                
                const croppedData = canvas.toDataURL('image/jpeg', 0.8);
                resolve(croppedData);
            };
            img.src = this.originalCoverData;
        });
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

    loadAlbums() {
        try {
            const stored = localStorage.getItem('vbc-photo-albums');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des albums:', error);
            return [];
        }
    }

    saveAlbums() {
        try {
            const data = JSON.stringify(this.albums);
            const sizeInMB = new Blob([data]).size / (1024 * 1024);
            
            console.log(`Taille des données: ${sizeInMB.toFixed(2)} MB`);
            
            if (sizeInMB > 4) {
                this.showNotification('Données trop volumineuses. Réduisez le nombre de photos.', 'error');
                return false;
            }
            
            localStorage.setItem('vbc-photo-albums', data);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.showNotification('Espace de stockage insuffisant. Supprimez des albums ou réduisez la taille des photos.', 'error');
            } else {
                console.error('Erreur lors de la sauvegarde des albums:', error);
                this.showNotification('Erreur de sauvegarde', 'error');
            }
            return false;
        }
    }

    showNotification(message, type = 'info') {
        // Créer notification si elle n'existe pas
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        notification.className = `notification ${type} show`;
        notification.textContent = message;

        // Auto-hide après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialiser le gestionnaire d'albums
let albumManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📸 Initialisation du gestionnaire d\'albums photos');
    albumManager = new AlbumManager();
});