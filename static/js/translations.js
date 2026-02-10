// Translation system for Nearby Services Tunisia
class TranslationSystem {
    constructor() {
        this.currentLang = 'ar'; // Default language
        this.translations = {
            'ar': {
                // Header
                'title': 'خدمات قريبة - تونس',
                'subtitle': 'ابحث عن خدمات النقل، الأطباء، والخدمات الأخرى القريبة من موقعك',
                
                // Location section
                'location': 'موقعك',
                'location_instruction': 'اضغط على الزر لاستخدام موقعك أو أدخل الإحداثيات يدوياً.',
                'latitude': 'خط العرض:',
                'longitude': 'خط الطول:',
                'use_my_location': 'استخدام موقعي',
                'use_tunisia': 'استخدام تونس',
                
                // Filters section
                'filters': 'التصنيف',
                'service_type': 'نوع الخدمة:',
                'all_services': 'جميع الخدمات',
                'transport_services': 'خدمات النقل',
                'medical_services': 'أطباء وخدمات طبية',
                'pharmacies': 'صيدليات',
                'car_repair': 'تصليح السيارات',
                'restaurants': 'مطاعم',
                'tech_services': 'خدمات تقنية',
                'max_distance': 'المسافة القصوى:',
                'km': 'كم',
                'find_nearby_services': 'ابحث عن الخدمات القريبة',
                
                // Instructions
                'how_to_use': 'كيفية الاستخدام',
                'step_1': 'اسمح بالوصول إلى موقعك أو أدخل الإحداثيات',
                'step_2': 'اختر نوع الخدمة المطلوبة',
                'step_3': 'حدد المسافة القصوى',
                'step_4': 'اضغط على "ابحث عن الخدمات القريبة"',
                'step_5': 'شاهد النتائج على الخريطة والقائمة',
                
                // Results section
                'nearby_services': 'الخدمات القريبة',
                'services_found': 'خدمات وجدت',
                'results_will_appear': 'ستظهر نتائج البحث هنا',
                'no_services_found': 'لم يتم العثور على خدمات. حاول تعديل بحثك.',
                
                // Map section
                'map': 'الخريطة',
                'doctors': 'أطباء',
                'mechanics': 'ميكانيكي',
                
                // Footer
                'copyright': 'خدمات قريبة - تونس © 2023 | مبرمج بـ Flask و JavaScript',
                
                // Modal
                'address': 'العنوان',
                'phone': 'الهاتف',
                'distance': 'المسافة',
                'rating': 'التقييم',
                'description': 'الوصف',
                'coordinates': 'الإحداثيات',
                'view_on_map': 'عرض على الخريطة',
                'show_route': 'عرض المسار',
                
                // Messages
                'location_success': 'تم تحديد موقعك بنجاح!',
                'location_error': 'تعذر تحديد موقعك.',
                'searching': 'جاري البحث...',
                'no_services_in_range': 'لم يتم العثور على خدمات ضمن المسافة المحددة. حاول زيادة دائرة البحث.',
                
                // Map controls
                'zoom_in': 'تكبير',
                'zoom_out': 'تصغير',
                'locate_me': 'تحديد موقعي',
                'reset_view': 'عرض افتراضي'
            },
            'en': {
                // Header
                'title': 'Nearby Services - Tunisia',
                'subtitle': 'Find transport, doctors, and other services near your location',
                
                // Location section
                'location': 'Your Location',
                'location_instruction': 'Click the button to use your location or enter coordinates manually.',
                'latitude': 'Latitude:',
                'longitude': 'Longitude:',
                'use_my_location': 'Use My Location',
                'use_tunisia': 'Use Tunisia',
                
                // Filters section
                'filters': 'Filters',
                'service_type': 'Service Type:',
                'all_services': 'All Services',
                'transport_services': 'Transport Services',
                'medical_services': 'Doctors & Medical',
                'pharmacies': 'Pharmacies',
                'car_repair': 'Car Repair',
                'restaurants': 'Restaurants',
                'tech_services': 'Technical Services',
                'max_distance': 'Max Distance:',
                'km': 'km',
                'find_nearby_services': 'Find Nearby Services',
                
                // Instructions
                'how_to_use': 'How to Use',
                'step_1': 'Allow access to your location or enter coordinates',
                'step_2': 'Choose the type of service required',
                'step_3': 'Set the maximum distance',
                'step_4': 'Click "Find Nearby Services"',
                'step_5': 'View results on the map and list',
                
                // Results section
                'nearby_services': 'Nearby Services',
                'services_found': 'services found',
                'results_will_appear': 'Search results will appear here',
                'no_services_found': 'No services found. Try adjusting your search.',
                
                // Map section
                'map': 'Map',
                'doctors': 'Doctors',
                'mechanics': 'Mechanics',
                
                // Footer
                'copyright': 'Nearby Services - Tunisia © 2023 | Built with Flask and JavaScript',
                
                // Modal
                'address': 'Address',
                'phone': 'Phone',
                'distance': 'Distance',
                'rating': 'Rating',
                'description': 'Description',
                'coordinates': 'Coordinates',
                'view_on_map': 'View on Map',
                'show_route': 'Show Route',
                
                // Messages
                'location_success': 'Your location has been determined successfully!',
                'location_error': 'Unable to determine your location.',
                'searching': 'Searching...',
                'no_services_in_range': 'No services found within the specified distance. Try increasing the search radius.',
                
                // Map controls
                'zoom_in': 'Zoom In',
                'zoom_out': 'Zoom Out',
                'locate_me': 'Locate Me',
                'reset_view': 'Reset View'
            },
            'fr': {
                // Header
                'title': 'Services à Proximité - Tunisie',
                'subtitle': 'Trouvez des services de transport, médecins et autres services près de votre emplacement',
                
                // Location section
                'location': 'Votre Emplacement',
                'location_instruction': 'Cliquez sur le bouton pour utiliser votre emplacement ou entrez les coordonnées manuellement.',
                'latitude': 'Latitude:',
                'longitude': 'Longitude:',
                'use_my_location': 'Utiliser Ma Position',
                'use_tunisia': 'Utiliser Tunisie',
                
                // Filters section
                'filters': 'Filtres',
                'service_type': 'Type de Service:',
                'all_services': 'Tous les Services',
                'transport_services': 'Services de Transport',
                'medical_services': 'Médecins & Médical',
                'pharmacies': 'Pharmacies',
                'car_repair': 'Réparation Voitures',
                'restaurants': 'Restaurants',
                'tech_services': 'Services Techniques',
                'max_distance': 'Distance Max:',
                'km': 'km',
                'find_nearby_services': 'Trouver Services à Proximité',
                
                // Instructions
                'how_to_use': 'Comment Utiliser',
                'step_1': 'Autorisez l\'accès à votre emplacement ou entrez les coordonnées',
                'step_2': 'Choisissez le type de service requis',
                'step_3': 'Définissez la distance maximale',
                'step_4': 'Cliquez sur "Trouver Services à Proximité"',
                'step_5': 'Affichez les résultats sur la carte et la liste',
                
                // Results section
                'nearby_services': 'Services à Proximité',
                'services_found': 'services trouvés',
                'results_will_appear': 'Les résultats de recherche apparaîtront ici',
                'no_services_found': 'Aucun service trouvé. Essayez d\'ajuster votre recherche.',
                
                // Map section
                'map': 'Carte',
                'doctors': 'Médecins',
                'mechanics': 'Mécaniciens',
                
                // Footer
                'copyright': 'Services à Proximité - Tunisie © 2023 | Développé avec Flask et JavaScript',
                
                // Modal
                'address': 'Adresse',
                'phone': 'Téléphone',
                'distance': 'Distance',
                'rating': 'Évaluation',
                'description': 'Description',
                'coordinates': 'Coordonnées',
                'view_on_map': 'Voir sur la Carte',
                'show_route': 'Afficher l\'Itinéraire',
                
                // Messages
                'location_success': 'Votre position a été déterminée avec succès !',
                'location_error': 'Impossible de déterminer votre position.',
                'searching': 'Recherche en cours...',
                'no_services_in_range': 'Aucun service trouvé dans la distance spécifiée. Essayez d\'augmenter le rayon de recherche.',
                
                // Map controls
                'zoom_in': 'Zoomer',
                'zoom_out': 'Dézoomer',
                'locate_me': 'Me Localiser',
                'reset_view': 'Vue par Défaut'
            }
        };
        
        // Language display names
        this.langNames = {
            'ar': 'العربية',
            'en': 'English',
            'fr': 'Français'
        };
        
        this.init();
    }
    
    init() {
        // Try to load saved language from localStorage
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('ar')) {
                this.currentLang = 'ar';
            } else if (browserLang.startsWith('fr')) {
                this.currentLang = 'fr';
            } else {
                this.currentLang = 'en';
            }
        }
        
        // Set initial language
        this.updateLanguage();
        
        // Setup language dropdown
        this.setupDropdown();
    }
    
    setupDropdown() {
        const langBtn = document.getElementById('lang-btn');
        const langList = document.getElementById('lang-list');
        const currentLangSpan = document.getElementById('current-lang');
        
        // Update current language display
        currentLangSpan.textContent = this.langNames[this.currentLang];
        
        // Toggle dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langList.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langList.classList.remove('show');
        });
        
        // Handle language selection
        const langLinks = langList.querySelectorAll('a');
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                this.changeLanguage(lang);
                langList.classList.remove('show');
            });
        });
    }
    
    changeLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferred_language', lang);
            this.updateLanguage();
            
            // Update current language display
            document.getElementById('current-lang').textContent = this.langNames[lang];
            
            // Update HTML direction for RTL languages
            if (lang === 'ar') {
                document.body.style.direction = 'rtl';
                document.body.style.textAlign = 'right';
            } else {
                document.body.style.direction = 'ltr';
                document.body.style.textAlign = 'left';
            }
            
            // Show confirmation message
        }
    }
    
    updateLanguage() {
        // Update all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                // Handle different types of elements
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[this.currentLang][key];
                } else if (element.tagName === 'OPTION') {
                    element.textContent = this.translations[this.currentLang][key];
                } else {
                    element.textContent = this.translations[this.currentLang][key];
                }
            }
        });
        
        // Update title tag
        document.title = this.translations[this.currentLang]['title'] || 'Nearby Services Tunisia';
        
        // Update map control titles
        this.updateMapControls();
        
        // Update any dynamic text in the app (like search button text)
        this.updateDynamicText();
    }
    
    updateMapControls() {
        const mapControls = {
            'zoom-in': this.translations[this.currentLang]['zoom_in'] || 'Zoom In',
            'zoom-out': this.translations[this.currentLang]['zoom_out'] || 'Zoom Out',
            'locate-me': this.translations[this.currentLang]['locate_me'] || 'Locate Me',
            'reset-view': this.translations[this.currentLang]['reset_view'] || 'Reset View'
        };
        
        for (const [id, title] of Object.entries(mapControls)) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.setAttribute('title', title);
            }
        }
    }
    
    updateDynamicText() {
        // This function can be extended to update any dynamically generated text
        const searchBtn = document.getElementById('find-services-btn');
        if (searchBtn) {
            const span = searchBtn.querySelector('span[data-translate="find_nearby_services"]');
            if (span && this.translations[this.currentLang]['find_nearby_services']) {
                span.textContent = this.translations[this.currentLang]['find_nearby_services'];
            }
        }
    }
    
    translate(key, defaultValue = '') {
        return this.translations[this.currentLang][key] || defaultValue || key;
    }
    
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    getLanguageName(langCode) {
        return this.langNames[langCode] || langCode;
    }
    
    showMessage(message, type = 'info') {
        // You can integrate this with your existing showMessage function in app.js
        if (typeof window.showMessage === 'function') {
            window.showMessage(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
}

// Initialize translation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new TranslationSystem();
});

// Helper function to translate text in JavaScript
function t(key, defaultValue = '') {
    if (window.translator) {
        return window.translator.translate(key, defaultValue);
    }
    return defaultValue || key;
}
