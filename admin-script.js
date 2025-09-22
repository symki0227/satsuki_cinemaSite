// Work Management System
class WorkManager {
    constructor() {
        this.works = this.loadWorks();
        this.currentWorkId = null;
        this.init();
    }

    init() {
        this.renderWorks();
        this.updateStats();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('work-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search and filter
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterWorks();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterWorks();
        });

        // Delete confirmation
        document.getElementById('confirm-delete').addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteWork();
        });
    }

    // Save works
    saveWorks() {
        localStorage.setItem('portfolio-works', JSON.stringify(this.works));
    }

    // Load works
    loadWorks() {
        const saved = localStorage.getItem('portfolio-works');
        if (saved) {
            // Normalize saved items to ensure YouTube URL only is enough
            const parsed = JSON.parse(saved);
            return parsed.map(w => this.normalizeWork(w));
        }
        // Default work data (using placeholder images)
        return [
            {
                id: 1,
                title: 'Work Title 1',
                year: 2024,
                category: 'Short Film',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work1',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work1',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work1'
            },
            {
                id: 2,
                title: 'Work Title 2',
                year: 2024,
                category: 'Documentary',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work2',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work2',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work2'
            },
            {
                id: 3,
                title: 'Work Title 3',
                year: 2024,
                category: 'Music Video',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work3',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work3',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work3'
            },
            {
                id: 4,
                title: 'Featured Work 1',
                year: 2024,
                category: 'Commercial',
                description: 'This is a featured work for slideshow',
                featured: true,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Featured1',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Featured1',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Featured1'
            },
            {
                id: 5,
                title: 'Featured Work 2',
                year: 2024,
                category: 'Animation',
                description: 'This is another featured work for slideshow',
                featured: true,
                video: 'https://via.placeholder.com/800x450/4CAF50/ffffff?text=Featured2',
                thumbnail: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Featured2',
                poster: 'https://via.placeholder.com/800x450/4CAF50/ffffff?text=Featured2'
            },
            {
                id: 6,
                title: 'Work Title 4',
                year: 2023,
                category: 'Commercial',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work4',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work4',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work4'
            },
            {
                id: 7,
                title: 'Work Title 5',
                year: 2023,
                category: 'Animation',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work5',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work5',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work5'
            },
            {
                id: 8,
                title: 'Work Title 6',
                year: 2023,
                category: 'Experimental',
                description: 'Work description goes here',
                featured: false,
                video: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work6',
                thumbnail: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Work6',
                poster: 'https://via.placeholder.com/800x450/ff6b9d/ffffff?text=Work6'
            }
        ];
    }

    // Ensure work has embed/thumbnail derived from youtube field
    normalizeWork(work) {
        const cloned = { ...work };
        if (cloned.youtube) {
            const embed = this.getYouTubeEmbedUrl(cloned.youtube);
            const thumb = this.getYouTubeThumbnail(cloned.youtube);
            if (embed) cloned.video = embed;
            if (!cloned.thumbnail) cloned.thumbnail = thumb;
            if (!cloned.poster) cloned.poster = thumb;
        }
        return cloned;
    }

    // Render works
    renderWorks(worksToRender = null) {
        const worksGrid = document.getElementById('works-grid');
        const works = worksToRender || this.works;

        if (works.length === 0) {
            worksGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-video"></i>
                    <h3>No works found</h3>
                    <p>Please add new works</p>
                </div>
            `;
            return;
        }

        worksGrid.innerHTML = works.map(work => {
            let thumbnailElement = '';
            if (work.video && work.video.includes('youtube.com/embed/')) {
                thumbnailElement = `
                    <img src="${work.thumbnail}" alt="${work.title}" style="width: 100%; height: 100%; object-fit: cover;">
                `;
            } else if (work.video && work.video.includes('placeholder')) {
                thumbnailElement = `
                    <img src="${work.thumbnail}" alt="${work.title}" style="width: 100%; height: 100%; object-fit: cover;">
                `;
            } else {
                thumbnailElement = `
                    <video muted>
                        <source src="${work.video}" type="video/mp4">
                        <img src="${work.thumbnail}" alt="${work.title}">
                    </video>
                `;
            }
            
            return `
                <div class="work-card fade-in">
                    ${work.featured ? '<div class="work-featured">Slideshow</div>' : ''}
                    <div class="work-thumbnail" onclick="workManager.previewWork(${work.id})">
                        ${thumbnailElement}
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="work-info">
                        <h3 class="work-title">${work.title}</h3>
                        <div class="work-meta">
                            <span>${work.year}</span>
                            <span class="work-category">${work.category}</span>
                        </div>
                        <p class="work-description">${work.description}</p>
                        <div class="work-actions">
                            <button class="btn btn-sm btn-secondary" onclick="workManager.editWork(${work.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="workManager.confirmDelete(${work.id})" type="button">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Animation
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    // Update statistics
    updateStats() {
        const totalWorks = this.works.length;
        const featuredWorks = this.works.filter(work => work.featured).length;
        const currentYear = new Date().getFullYear();
        const recentWorks = this.works.filter(work => work.year === currentYear).length;

        document.getElementById('total-works').textContent = totalWorks;
        document.getElementById('featured-works').textContent = featuredWorks;
        document.getElementById('recent-works').textContent = recentWorks;
    }

    // Filter works
    filterWorks() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;

        const filteredWorks = this.works.filter(work => {
            const matchesSearch = work.title.toLowerCase().includes(searchTerm) ||
                                work.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || work.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        this.renderWorks(filteredWorks);
    }

    // Open add work modal
    openAddModal() {
        this.currentWorkId = null;
        document.getElementById('modal-title').textContent = 'Add New Work';
        document.getElementById('submit-btn').textContent = 'Add';
        document.getElementById('work-form').reset();
        document.getElementById('work-modal').classList.add('active');
    }

    // Open edit work modal
    editWork(id) {
        const work = this.works.find(w => w.id === id);
        if (!work) return;

        this.currentWorkId = id;
        document.getElementById('modal-title').textContent = 'Edit Work';
        document.getElementById('submit-btn').textContent = 'Update';
        
        // Set form values
        document.getElementById('work-title').value = work.title;
        document.getElementById('work-year').value = work.year;
        document.getElementById('work-category').value = work.category;
        document.getElementById('work-description').value = work.description;
        document.getElementById('work-featured').checked = work.featured;
        document.getElementById('work-youtube').value = work.youtube || '';
        
        document.getElementById('work-modal').classList.add('active');
    }

    // Handle form submission
    handleFormSubmit() {
        const formData = new FormData(document.getElementById('work-form'));
        
        const workData = {
            title: formData.get('title'),
            year: parseInt(formData.get('year')),
            category: formData.get('category'),
            description: formData.get('description'),
            featured: formData.get('featured') === 'on',
            youtube: formData.get('youtube')
        };

        // Validation
        if (!workData.title || !workData.year || !workData.category) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }

        if (!workData.youtube) {
            this.showNotification('Please enter YouTube link', 'error');
            return;
        }

        // YouTube link validation
        if (!this.isValidYouTubeUrl(workData.youtube)) {
            this.showNotification('Please enter a valid YouTube link', 'error');
            return;
        }

        // File processing
        const thumbnailFile = document.getElementById('work-thumbnail').files[0];
        const posterFile = document.getElementById('work-poster').files[0];

        if (this.currentWorkId) {
            // Edit
            const workIndex = this.works.findIndex(w => w.id === this.currentWorkId);
            if (workIndex !== -1) {
                this.works[workIndex] = this.normalizeWork({
                    ...this.works[workIndex],
                    ...workData,
                    video: this.getYouTubeEmbedUrl(workData.youtube),
                    thumbnail: thumbnailFile ? this.handleFileUpload(thumbnailFile, 'thumbnail') : this.getYouTubeThumbnail(workData.youtube),
                    poster: posterFile ? this.handleFileUpload(posterFile, 'poster') : this.getYouTubeThumbnail(workData.youtube)
                });
                this.showNotification('Work updated successfully', 'success');
            }
        } else {
            // Add new
            const newId = Math.max(...this.works.map(w => w.id), 0) + 1;
            this.works.push(this.normalizeWork({
                id: newId,
                ...workData,
                video: this.getYouTubeEmbedUrl(workData.youtube),
                thumbnail: thumbnailFile ? this.handleFileUpload(thumbnailFile, 'thumbnail') : this.getYouTubeThumbnail(workData.youtube),
                poster: posterFile ? this.handleFileUpload(posterFile, 'poster') : this.getYouTubeThumbnail(workData.youtube)
            }));
            this.showNotification('Work added successfully', 'success');
        }

        this.saveWorks();
        this.renderWorks();
        this.updateStats();
        this.closeModal();
    }

    // Handle file upload (simplified version)
    handleFileUpload(file, type) {
        // In actual implementation, upload file to server
        // Here we return local file path
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        return `${type}s/work-${timestamp}.${extension}`;
    }

    // Validate YouTube URL
    isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=[\w-]+(&[\w=&-]+)?)|youtu\.be\/[\w-]+(\?.*)?|youtube\.com\/embed\/[\w-]+(\?.*)?)$/;
        return youtubeRegex.test(url);
    }

    // Convert YouTube URL to embed URL
    getYouTubeEmbedUrl(url) {
        try {
            const u = new URL(url, location.origin);
            // youtu.be/ID
            if (u.hostname.includes('youtu.be')) {
                const id = u.pathname.replace('/', '');
                return `https://www.youtube.com/embed/${id}`;
            }
            // youtube.com/watch?v=ID
            if (u.pathname === '/watch') {
                const id = u.searchParams.get('v');
                return id ? `https://www.youtube.com/embed/${id}` : '';
            }
            // youtube.com/shorts/ID
            if (u.pathname.startsWith('/shorts/')) {
                const id = u.pathname.split('/shorts/')[1].split('/')[0];
                return id ? `https://www.youtube.com/embed/${id}` : '';
            }
            // already embed
            if (u.pathname.startsWith('/embed/')) {
                return `https://www.youtube.com${u.pathname}`;
            }
        } catch (_) {}
        return '';
    }

    // Get YouTube thumbnail URL
    getYouTubeThumbnail(url) {
        try {
            const embed = this.getYouTubeEmbedUrl(url);
            const id = embed.split('/embed/')[1]?.split('?')[0];
            return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
        } catch (_) {
            return '';
        }
    }

    // Preview work
    previewWork(id) {
        const work = this.works.find(w => w.id === id);
        if (!work) return;

        const previewVideo = document.getElementById('preview-video');
        const previewInfo = document.getElementById('preview-info');

        if (work.video.includes('youtube.com/embed/')) {
            previewVideo.innerHTML = `
                <iframe 
                    width="100%" 
                    height="315" 
                    src="${work.video}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else {
            previewVideo.innerHTML = `
                <video controls>
                    <source src="${work.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        }

        previewInfo.innerHTML = `
            <h3>${work.title}</h3>
            <p><strong>Year:</strong> ${work.year}</p>
            <p><strong>Category:</strong> ${work.category}</p>
            <p><strong>Description:</strong> ${work.description}</p>
            <p><strong>Slideshow:</strong> ${work.featured ? 'Yes' : 'No'}</p>
        `;

        document.getElementById('preview-modal').classList.add('active');
    }

    // Confirm delete
    confirmDelete(id) {
        console.log('Confirming deletion for work ID:', id);
        const work = this.works.find(w => w.id === id);
        if (work) {
            console.log('Work to delete:', work.title);
            this.currentWorkId = id;
            document.getElementById('delete-modal').classList.add('active');
        } else {
            console.error('Work not found for ID:', id);
            this.showNotification('Work not found', 'error');
        }
    }

    // Delete work
    deleteWork() {
        if (this.currentWorkId) {
            const workToDelete = this.works.find(w => w.id === this.currentWorkId);
            if (workToDelete) {
                this.works = this.works.filter(w => w.id !== this.currentWorkId);
                this.saveWorks();
                this.renderWorks();
                this.updateStats();
                this.updatePortfolioSite(); // Update portfolio site after deletion
                this.showNotification(`"${workToDelete.title}" deleted successfully`, 'success');
                console.log('Work deleted:', workToDelete.title);
            } else {
                this.showNotification('Work not found', 'error');
            }
        } else {
            this.showNotification('No work selected for deletion', 'error');
        }
        this.closeDeleteModal();
        this.currentWorkId = null; // Reset current work ID
    }

    // Close modals
    closeModal() {
        document.getElementById('work-modal').classList.remove('active');
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').classList.remove('active');
    }

    closePreviewModal() {
        document.getElementById('preview-modal').classList.remove('active');
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Generate portfolio data for portfolio site
    generatePortfolioData() {
        const featuredWorks = this.works.filter(work => work.featured);
        const allWorks = this.works;

        console.log('Current work data:', this.works);
        console.log('Featured works:', featuredWorks);
        console.log('All works:', allWorks);

        return {
            slideshow: featuredWorks,
            works: allWorks
        };
    }

    // Update portfolio site
    updatePortfolioSite() {
        console.log('🔄 Updating portfolio site...');
        
        // Save works data to localStorage (for portfolio site use)
        localStorage.setItem('portfolio-works', JSON.stringify(this.works));
        console.log('✅ Works data saved to localStorage');
        
        // Generate and save other portfolio data
        const data = this.generatePortfolioData();
        localStorage.setItem('portfolio-data', JSON.stringify(data));
        console.log('✅ Portfolio data saved to localStorage');
        
        // Set update flag
        localStorage.setItem('portfolio-updated', 'true');
        
        // Send message to portfolio site if it's open
        this.notifyPortfolioSite();
        
        // Update portfolio site HTML file directly
        this.updatePortfolioHTML(data);
        
        this.showNotification('Portfolio site updated successfully!', 'success');
    }

    // Notify portfolio site of updates
    notifyPortfolioSite() {
        // Notify if portfolio site is open
        if (window.opener && !window.opener.closed) {
            try {
                console.log('📡 Sending update message to portfolio site...');
                window.opener.postMessage({
                    type: 'portfolio-update',
                    data: this.works
                }, '*');
                console.log('✅ Message sent to portfolio site');
            } catch (e) {
                console.log('❌ Failed to communicate with portfolio site', e);
            }
        } else {
            console.log('ℹ️ Portfolio site is not open');
        }
    }

    // Update portfolio site HTML directly
    updatePortfolioHTML(data) {
        // Update slideshow section
        const slideshowHTML = data.slideshow.map((work, index) => {
            let videoElement = '';
            if (work.video && work.video.includes('youtube.com/embed/')) {
                videoElement = `
                    <iframe 
                        src="${work.video}" 
                        class="hero-video"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            } else if (work.video && work.video.includes('placeholder')) {
                videoElement = `
                    <img src="${work.video}" alt="${work.title}" class="hero-video">
                `;
            } else {
                videoElement = `
                    <video autoplay muted loop class="hero-video">
                        <source src="${work.video}" type="video/mp4">
                        <img src="${work.poster}" alt="${work.title}">
                    </video>
                `;
            }
            
            return `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <div class="slide-content">
                        ${videoElement}
                        <div class="slide-overlay">
                            <h1 class="slide-title">${work.title}</h1>
                            <p class="slide-description">${work.description}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update works section
        const worksHTML = data.works.map(work => {
            let thumbnailElement = '';
            if (work.video && work.video.includes('youtube.com/embed/')) {
                thumbnailElement = `
                    <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail-img">
                `;
            } else if (work.video && work.video.includes('placeholder')) {
                thumbnailElement = `
                    <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail-img">
                `;
            } else {
                thumbnailElement = `
                    <video muted class="work-video">
                        <source src="${work.video}" type="video/mp4">
                        <img src="${work.thumbnail}" alt="${work.title}">
                    </video>
                `;
            }
            
            return `
                <div class="work-card" onclick="openWork(${work.id})">
                    <div class="work-thumbnail">
                        ${thumbnailElement}
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p>${work.year}</p>
                        <span class="work-category">${work.category}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Update indicators section
        const indicatorsHTML = data.slideshow.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" onclick="currentSlide(${index + 1})"></span>
        `).join('');

        // Generate update data for HTML file
        const updateData = {
            slideshowHTML: slideshowHTML,
            worksHTML: worksHTML,
            indicatorsHTML: indicatorsHTML,
            totalSlides: data.slideshow.length
        };

        // Save update data to localStorage
        localStorage.setItem('portfolio-update', JSON.stringify(updateData));
        
        // Update immediately if portfolio site is open
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'portfolio-update',
                    data: updateData
                }, '*');
            } catch (e) {
                console.log('Failed to communicate with portfolio site');
            }
        }
    }
}

// Global variables
let workManager;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    workManager = new WorkManager();
});

// Modal functions
function openAddModal() {
    workManager.openAddModal();
}

function closeModal() {
    workManager.closeModal();
}

function closeDeleteModal() {
    workManager.closeDeleteModal();
}

function closePreviewModal() {
    workManager.closePreviewModal();
}

// Portfolio site update function
function updatePortfolioSite() {
    workManager.updatePortfolioSite();
}

// Force reload function
function forceReloadPortfolio() {
    const data = workManager.generatePortfolioData();
    localStorage.setItem('portfolio-data', JSON.stringify(data));
    localStorage.setItem('portfolio-updated', 'true');
    
    // Force reload if portfolio site is open
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.location.reload();
            workManager.showNotification('Portfolio site reloaded', 'success');
        } catch (e) {
            workManager.showNotification('Failed to reload portfolio site', 'error');
        }
    } else {
        workManager.showNotification('Data updated. Please reload the portfolio site.', 'success');
    }
}

// Test delete function (for debugging)
function testDelete() {
    console.log('Current works:', workManager.works);
    console.log('Total works:', workManager.works.length);
    if (workManager.works.length > 0) {
        const firstWork = workManager.works[0];
        console.log('Testing delete with first work:', firstWork.title);
        workManager.confirmDelete(firstWork.id);
    } else {
        console.log('No works to delete');
    }
}

// Console welcome message
console.log('%c🎬 Welcome to Work Management System!', 'color: #e91e63; font-size: 20px; font-weight: bold;');
console.log('%cYou can add, edit, and delete works.', 'color: #666; font-size: 14px;');
console.log('%cPortfolio site updates are also available!', 'color: #e91e63; font-size: 14px;');