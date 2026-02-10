// Main Application with Translation Support
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const getLocationBtn = document.getElementById('get-location-btn');
    const useDefaultBtn = document.getElementById('use-default-btn');
    const findServicesBtn = document.getElementById('find-services-btn');
    const categorySelect = document.getElementById('category-select');
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = document.getElementById('distance-value');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    const mapContainer = document.getElementById('map');
    const serviceModal = document.getElementById('service-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Map Elements
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const locateMeBtn = document.getElementById('locate-me');
    const resetViewBtn = document.getElementById('reset-view');
    
    // App State
    let userLocation = {
        lat: 36.8065,  // Tunis, Tunisia
        lon: 10.1815
    };
    let currentServices = [];
    let map = null;
    let userMarker = null;
    let serviceMarkers = [];
    
    // Initialize Map
    initMap();
    
    // Initialize App
    initApp();
    
    // Initialize Translations
    initTranslations();
    
    function initMap() {
        // Initialize Leaflet map centered on Tunisia
        map = L.map('map').setView([36.8065, 10.1815], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Add scale control
        L.control.scale().addTo(map);
        
        // Add initial user marker
        updateUserMarker();
        
        // Add map control events
        zoomInBtn.addEventListener('click', () => map.zoomIn());
        zoomOutBtn.addEventListener('click', () => map.zoomOut());
        locateMeBtn.addEventListener('click', centerMapOnUser);
        resetViewBtn.addEventListener('click', resetMapView);
    }
    
    function updateUserMarker() {
        // Remove existing user marker
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        
        // Create new user marker with custom icon
        const userIcon = L.divIcon({
            className: 'marker-icon user-marker',
            html: '<i class="fas fa-user"></i>',
            iconSize: [30, 30]
        });
        
        userMarker = L.marker([userLocation.lat, userLocation.lon], {
            icon: userIcon,
            title: t('your_location', 'Your Location')
        }).addTo(map);
        
        // Add popup to user marker
        userMarker.bindPopup(`
            <div style="text-align: center;">
                <h3>${t('your_location', 'Your Location')}</h3>
                <p>${t('latitude', 'Latitude')}: ${userLocation.lat.toFixed(6)}</p>
                <p>${t('longitude', 'Longitude')}: ${userLocation.lon.toFixed(6)}</p>
            </div>
        `);
    }
    
    function centerMapOnUser() {
        if (userMarker) {
            map.setView([userLocation.lat, userLocation.lon], 15);
            userMarker.openPopup();
        }
    }
    
    function resetMapView() {
        map.setView([36.8065, 10.1815], 12);
    }
    
    function initApp() {
        // Set up event listeners
        getLocationBtn.addEventListener('click', getUserLocation);
        useDefaultBtn.addEventListener('click', useDefaultLocation);
        findServicesBtn.addEventListener('click', findServices);
        distanceSlider.addEventListener('input', updateDistanceValue);
        closeModal.addEventListener('click', () => {
            serviceModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === serviceModal) {
                serviceModal.style.display = 'none';
            }
        });
        
        // Set default location in inputs
        latitudeInput.value = userLocation.lat;
        longitudeInput.value = userLocation.lon;
        
        // Update distance value display
        updateDistanceValue();
        
        // Center map on default location
        map.setView([userLocation.lat, userLocation.lon], 12);
        
        // Update input placeholders based on language
        updateInputPlaceholders();
    }
    
    function initTranslations() {
        // Update map control titles when language changes
        updateMapControlTitles();
        
        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            updateMapControlTitles();
            updateInputPlaceholders();
            updateEmptyStateMessages();
            updateResultsCount();
            updateUserMarkerPopup();
        });
    }
    
    function updateMapControlTitles() {
        if (zoomInBtn) zoomInBtn.title = t('zoom_in', 'Zoom In');
        if (zoomOutBtn) zoomOutBtn.title = t('zoom_out', 'Zoom Out');
        if (locateMeBtn) locateMeBtn.title = t('locate_me', 'Locate Me');
        if (resetViewBtn) resetViewBtn.title = t('reset_view', 'Reset View');
    }
    
    function updateInputPlaceholders() {
        // Update input placeholders based on current language
        const lang = window.translator ? window.translator.getCurrentLanguage() : 'ar';
        
        if (lang === 'ar') {
            latitudeInput.placeholder = 'مثال: 36.8065';
            longitudeInput.placeholder = 'مثال: 10.1815';
        } else if (lang === 'fr') {
            latitudeInput.placeholder = 'Exemple: 36.8065';
            longitudeInput.placeholder = 'Exemple: 10.1815';
        } else {
            latitudeInput.placeholder = 'Example: 36.8065';
            longitudeInput.placeholder = 'Example: 10.1815';
        }
    }
    
    function updateEmptyStateMessages() {
        // Update empty state messages in results container
        const emptyState = resultsContainer.querySelector('.empty-state');
        if (emptyState && emptyState.querySelector('p')) {
            const p = emptyState.querySelector('p');
            if (p.getAttribute('data-translate') === 'results_will_appear') {
                p.textContent = t('results_will_appear', 'Search results will appear here');
            }
        }
    }
    
    function updateUserMarkerPopup() {
        if (userMarker) {
            userMarker.getPopup().setContent(`
                <div style="text-align: center;">
                    <h3>${t('your_location', 'Your Location')}</h3>
                    <p>${t('latitude', 'Latitude')}: ${userLocation.lat.toFixed(6)}</p>
                    <p>${t('longitude', 'Longitude')}: ${userLocation.lon.toFixed(6)}</p>
                </div>
            `);
        }
    }
    
    function updateDistanceValue() {
        distanceValue.textContent = distanceSlider.value;
    }
    
    function getUserLocation() {
        if (!navigator.geolocation) {
            showMessage('browser_no_geolocation', 'error');
            return;
        }
        
        getLocationBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('getting_location', 'Getting location...')}`;
        getLocationBtn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation.lat = position.coords.latitude;
                userLocation.lon = position.coords.longitude;
                
                // Update input fields
                latitudeInput.value = userLocation.lat.toFixed(6);
                longitudeInput.value = userLocation.lon.toFixed(6);
                
                showMessage('location_success', 'success');
                getLocationBtn.innerHTML = `<i class="fas fa-location-crosshairs"></i> ${t('use_my_location', 'Use My Location')}`;
                getLocationBtn.disabled = false;
                
                // Update user marker on map
                updateUserMarker();
                centerMapOnUser();
                
                // Auto-search for services
                findServices();
            },
            (error) => {
                let errorKey = 'location_error';
                let errorMessage = t('location_error', 'Unable to determine your location. ');
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += t('permission_denied', 'Permission denied.');
                        errorKey = 'permission_denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += t('position_unavailable', 'Position unavailable.');
                        errorKey = 'position_unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage += t('timeout', 'Request timeout.');
                        errorKey = 'timeout';
                        break;
                    default:
                        errorMessage += t('unknown_error', 'Unknown error.');
                        errorKey = 'unknown_error';
                }
                
                showMessage(errorKey, 'error');
                getLocationBtn.innerHTML = `<i class="fas fa-location-crosshairs"></i> ${t('use_my_location', 'Use My Location')}`;
                getLocationBtn.disabled = false;
            }
        );
    }
    
    function useDefaultLocation() {
        // Set default to Tunis, Tunisia
        userLocation.lat = 36.8065;
        userLocation.lon = 10.1815;
        
        latitudeInput.value = userLocation.lat;
        longitudeInput.value = userLocation.lon;
        
        showMessage('using_default_location', 'info');
        
        // Update user marker
        updateUserMarker();
        centerMapOnUser();
        
        // Auto-search for services
        findServices();
    }
    
    function findServices() {
        // Get user location from inputs
        const lat = parseFloat(latitudeInput.value);
        const lon = parseFloat(longitudeInput.value);
        
        if (isNaN(lat) || isNaN(lon)) {
            showMessage('invalid_coordinates', 'error');
            return;
        }
        
        userLocation.lat = lat;
        userLocation.lon = lon;
        
        const category = categorySelect.value;
        const maxDistance = distanceSlider.value;
        
        // Show loading state
        findServicesBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('searching', 'Searching...')}`;
        findServicesBtn.disabled = true;
        
        // Update user marker position
        updateUserMarker();
        
        // Make API request
        fetch(`/api/services?lat=${lat}&lon=${lon}&category=${category}&max_distance=${maxDistance}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentServices = data.services;
                    displayServices(currentServices);
                    displayServicesOnMap(currentServices);
                    updateResultsCount();
                    
                    // Zoom to fit all markers if we have services
                    if (currentServices.length > 0) {
                        zoomToFitMarkers();
                    }
                } else {
                    showMessage('search_error', 'error');
                    resultsContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle fa-3x"></i>
                            <p>${t('no_services_found', 'No services found. Try adjusting your search.')}</p>
                        </div>`;
                    clearServiceMarkers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('fetch_error', 'error');
            })
            .finally(() => {
                findServicesBtn.innerHTML = `<i class="fas fa-search"></i> ${t('find_nearby_services', 'Find Nearby Services')}`;
                findServicesBtn.disabled = false;
            });
    }
    
    function updateResultsCount() {
        const count = currentServices.length;
        const countSpan = resultsCount.querySelector('span:first-child');
        const textSpan = resultsCount.querySelector('span:last-child');
        
        if (countSpan) countSpan.textContent = count;
        if (textSpan) textSpan.textContent = ` ${t('services_found', 'services found')}`;
    }
    
    function displayServices(services) {
        if (services.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-slash fa-3x"></i>
                    <p>${t('no_services_in_range', 'No services found within the specified distance. Try increasing the search radius.')}</p>
                </div>`;
            return;
        }
        
        resultsContainer.innerHTML = '';
        
        services.forEach(service => {
            const serviceCard = createServiceCard(service);
            resultsContainer.appendChild(serviceCard);
        });
    }
    
    function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = `service-card ${service.category}`;
        card.dataset.id = service.id;
        
        // Get category display name based on language
        const categoryNames = {
            'transporter': t('transport_services', 'Transport Service'),
            'doctor': t('medical_services', 'Medical Service'),
            'pharmacy': t('pharmacies', 'Pharmacy'),
            'mechanic': t('car_repair', 'Car Repair'),
            'restaurant': t('restaurants', 'Restaurant'),
            'technician': t('tech_services', 'Technical Service')
        };
        
        const categoryName = categoryNames[service.category] || t('service', 'Service');
        
        // Get subcategory display name
        const subcategoryNames = {
            'taxi': t('taxi', 'Taxi'),
            'delivery': t('delivery', 'Delivery'),
            'moving': t('moving', 'Moving'),
            'ride_sharing': t('ride_sharing', 'Ride Sharing'),
            'general': t('general_doctor', 'General Doctor'),
            'dentist': t('dentist', 'Dentist'),
            'pediatrician': t('pediatrician', 'Pediatrician'),
            'cardiologist': t('cardiologist', 'Cardiologist'),
            'drugstore': t('drugstore', 'Drugstore'),
            'auto': t('auto_repair', 'Auto Repair'),
            'dining': t('dining', 'Dining'),
            'computer': t('computer_repair', 'Computer Repair')
        };
        
        const subcategoryName = subcategoryNames[service.subcategory] || service.subcategory;
        
        // Format phone number
        const phoneFormatted = formatPhoneNumber(service.phone);
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-name">${service.name}</div>
                <div class="service-distance">${service.distance} ${t('km', 'km')}</div>
            </div>
            <div class="service-category">${categoryName} - ${subcategoryName}</div>
            <div class="service-address">
                <i class="fas fa-map-pin"></i>
                <span>${service.address}</span>
            </div>
            <div class="service-phone">
                <i class="fas fa-phone"></i>
                <span>${phoneFormatted}</span>
            </div>
            <div class="service-rating">
                <i class="fas fa-star"></i> ${service.rating}/5
            </div>
        `;
        
        // Add click event to show details and highlight on map
        card.addEventListener('click', () => {
            showServiceDetails(service);
            highlightServiceOnMap(service.id);
        });
        
        return card;
    }
    
    function formatPhoneNumber(phone) {
        // Format phone number based on language direction
        const lang = window.translator ? window.translator.getCurrentLanguage() : 'ar';
        
        if (lang === 'ar') {
            // RTL format
            return phone.replace(/(\+\d{1,3})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        } else {
            // LTR format
            return phone.replace(/(\+\d{1,3})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        }
    }
    
    function displayServicesOnMap(services) {
        // Clear existing service markers
        clearServiceMarkers();
        
        if (services.length === 0) {
            return;
        }
        
        // Define marker icons for each category
        const iconClasses = {
            'transporter': 'transporter-marker',
            'doctor': 'doctor-marker',
            'pharmacy': 'pharmacy-marker',
            'mechanic': 'mechanic-marker',
            'restaurant': 'restaurant-marker',
            'technician': 'technician-marker'
        };
        
        // Define icons for each category
        const iconHTMLs = {
            'transporter': '<i class="fas fa-car"></i>',
            'doctor': '<i class="fas fa-user-md"></i>',
            'pharmacy': '<i class="fas fa-pills"></i>',
            'mechanic': '<i class="fas fa-wrench"></i>',
            'restaurant': '<i class="fas fa-utensils"></i>',
            'technician': '<i class="fas fa-laptop"></i>'
        };
        
        services.forEach(service => {
            // Create custom icon for each service
            const iconClass = iconClasses[service.category] || 'other-marker';
            const iconHTML = iconHTMLs[service.category] || '<i class="fas fa-map-marker"></i>';
            
            const serviceIcon = L.divIcon({
                className: `marker-icon ${iconClass}`,
                html: iconHTML,
                iconSize: [30, 30]
            });
            
            // Create marker
            const marker = L.marker([service.latitude, service.longitude], {
                icon: serviceIcon,
                title: service.name
            }).addTo(map);
            
            // Create popup content with proper text direction
            const lang = window.translator ? window.translator.getCurrentLanguage() : 'ar';
            const textDirection = lang === 'ar' ? 'rtl' : 'ltr';
            const textAlign = lang === 'ar' ? 'right' : 'left';
            
            const popupContent = `
                <div style="text-align: ${textAlign}; direction: ${textDirection}">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${service.name}</h3>
                    <div class="popup-distance" style="background: #3498db; color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem; display: inline-block; margin-bottom: 10px;">
                        ${service.distance} ${t('km', 'km')}
                    </div>
                    <p style="margin: 5px 0;"><strong>${t('address', 'Address')}:</strong> ${service.address}</p>
                    <p style="margin: 5px 0;"><strong>${t('phone', 'Phone')}:</strong> <span class="popup-phone">${service.phone}</span></p>
                    <p style="margin: 5px 0;"><strong>${t('rating', 'Rating')}:</strong> ${service.rating}/5</p>
                    <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #7f8c8d;">${service.description}</p>
                    <button onclick="showServiceDetailsFromMap(${service.id})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer; width: 100%;">
                        <i class="fas fa-info-circle"></i> ${t('more_details', 'More Details')}
                    </button>
                </div>
            `;
            
            // Bind popup to marker
            marker.bindPopup(popupContent);
            
            // Add click event to marker
            marker.on('click', function() {
                showServiceDetails(service);
            });
            
            // Store marker reference
            serviceMarkers.push({
                id: service.id,
                marker: marker
            });
        });
        
        // Fit map bounds to show all markers and user location
        zoomToFitMarkers();
    }
    
    function clearServiceMarkers() {
        serviceMarkers.forEach(item => {
            map.removeLayer(item.marker);
        });
        serviceMarkers = [];
    }
    
    function zoomToFitMarkers() {
        if (serviceMarkers.length === 0 && !userMarker) {
            return;
        }
        
        const bounds = L.latLngBounds();
        
        // Add user location to bounds
        bounds.extend([userLocation.lat, userLocation.lon]);
        
        // Add all service markers to bounds
        serviceMarkers.forEach(item => {
            bounds.extend(item.marker.getLatLng());
        });
        
        // Fit map to bounds with padding
        map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15
        });
    }
    
    function highlightServiceOnMap(serviceId) {
        // Remove highlight from all markers
        serviceMarkers.forEach(item => {
            item.marker.setZIndexOffset(0);
        });
        
        // Find and highlight the selected service
        const selectedService = serviceMarkers.find(item => item.id === serviceId);
        if (selectedService) {
            selectedService.marker.setZIndexOffset(1000);
            selectedService.marker.openPopup();
            
            // Pan to the marker with offset
            const markerLatLng = selectedService.marker.getLatLng();
            map.panTo([markerLatLng.lat, markerLatLng.lng], {
                animate: true,
                duration: 1
            });
        }
    }
    
    function showServiceDetails(service) {
        const modalBody = document.getElementById('modal-body');
        
        // Get category display name
        const categoryNames = {
            'transporter': t('transport_services', 'Transport Service'),
            'doctor': t('medical_services', 'Medical Service'),
            'pharmacy': t('pharmacies', 'Pharmacy'),
            'mechanic': t('car_repair', 'Car Repair'),
            'restaurant': t('restaurants', 'Restaurant'),
            'technician': t('tech_services', 'Technical Service')
        };
        
        const categoryName = categoryNames[service.category] || t('service', 'Service');
        
        // Get subcategory display name
        const subcategoryNames = {
            'taxi': t('taxi', 'Taxi'),
            'delivery': t('delivery', 'Delivery'),
            'moving': t('moving', 'Moving'),
            'ride_sharing': t('ride_sharing', 'Ride Sharing'),
            'general': t('general_doctor', 'General Doctor'),
            'dentist': t('dentist', 'Dentist'),
            'pediatrician': t('pediatrician', 'Pediatrician'),
            'cardiologist': t('cardiologist', 'Cardiologist'),
            'drugstore': t('drugstore', 'Drugstore'),
            'auto': t('auto_repair', 'Auto Repair'),
            'dining': t('dining', 'Dining'),
            'computer': t('computer_repair', 'Computer Repair')
        };
        
        const subcategoryName = subcategoryNames[service.subcategory] || service.subcategory;
        
        // Format phone number
        const phoneFormatted = formatPhoneNumber(service.phone);
        
        // Set modal direction based on language
        const lang = window.translator ? window.translator.getCurrentLanguage() : 'ar';
        const modalDirection = lang === 'ar' ? 'rtl' : 'ltr';
        const modalTextAlign = lang === 'ar' ? 'right' : 'left';
        
        modalBody.setAttribute('dir', modalDirection);
        modalBody.style.textAlign = modalTextAlign;
        
        modalBody.innerHTML = `
            <h2 class="modal-service-name">${service.name}</h2>
            <div class="modal-service-category">${categoryName} - ${subcategoryName}</div>
            
            <div class="modal-detail">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>${t('address', 'Address')}:</strong> ${service.address}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>${t('phone', 'Phone')}:</strong> ${phoneFormatted}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-ruler"></i>
                <div>
                    <strong>${t('distance', 'Distance')}:</strong> ${service.distance} ${t('km_from_you', 'km from you')}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-star"></i>
                <div>
                    <strong>${t('rating', 'Rating')}:</strong> ${service.rating}/5
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>${t('description', 'Description')}:</strong> ${service.description}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-map"></i>
                <div>
                    <strong>${t('coordinates', 'Coordinates')}:</strong> ${service.latitude.toFixed(6)}, ${service.longitude.toFixed(6)}
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="centerOnServiceOnMap(${service.id})" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px; cursor: pointer;">
                    <i class="fas fa-map-marker-alt"></i> ${t('view_on_map', 'View on Map')}
                </button>
                <button onclick="showRouteToService(${service.id})" style="background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px; cursor: pointer;">
                    <i class="fas fa-route"></i> ${t('show_route', 'Show Route')}
                </button>
            </div>
        `;
        
        serviceModal.style.display = 'block';
        
        // Add global functions for buttons
        window.centerOnServiceOnMap = function(serviceId) {
            highlightServiceOnMap(serviceId);
            serviceModal.style.display = 'none';
        };
        
        window.showRouteToService = function(serviceId) {
            const service = currentServices.find(s => s.id === serviceId);
            if (service) {
                // Open Google Maps with directions
                const origin = `${userLocation.lat},${userLocation.lon}`;
                const destination = `${service.latitude},${service.longitude}`;
                window.open(`https://www.google.com/maps/dir/${origin}/${destination}`, '_blank');
            }
        };
        
        // Also add the function called from map popups
        window.showServiceDetailsFromMap = function(serviceId) {
            const service = currentServices.find(s => s.id === serviceId);
            if (service) {
                showServiceDetails(service);
            }
        };
    }
    
    function showMessage(messageKey, type) {
        // Get translated message
        let message = t(messageKey, messageKey);
        
        // If it's still a key (not found), use default messages
        if (message === messageKey) {
            switch(messageKey) {
                case 'location_success':
                    message = t('location_success', 'Your location has been determined successfully!');
                    break;
                case 'using_default_location':
                    message = t('using_default_location', 'Using default Tunisia location');
                    break;
                case 'invalid_coordinates':
                    message = t('invalid_coordinates', 'Please enter valid coordinates');
                    break;
                case 'browser_no_geolocation':
                    message = t('browser_no_geolocation', 'Browser does not support geolocation');
                    break;
                case 'location_error':
                    message = t('location_error', 'Unable to determine your location');
                    break;
                case 'permission_denied':
                    message = t('permission_denied', 'Permission denied');
                    break;
                case 'position_unavailable':
                    message = t('position_unavailable', 'Position unavailable');
                    break;
                case 'timeout':
                    message = t('timeout', 'Request timeout');
                    break;
                case 'unknown_error':
                    message = t('unknown_error', 'Unknown error');
                    break;
                case 'search_error':
                    message = t('search_error', 'Error searching for services');
                    break;
                case 'fetch_error':
                    message = t('fetch_error', 'Failed to fetch services. Please try again.');
                    break;
                default:
                    message = messageKey;
            }
        }
        
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Style based on type
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            maxWidth: '300px',
            textAlign: 'right',
            direction: 'rtl'
        };
        
        // Adjust position based on language
        const lang = window.translator ? window.translator.getCurrentLanguage() : 'ar';
        if (lang !== 'ar') {
            styles.right = 'auto';
            styles.left = '20px';
            styles.textAlign = 'left';
            styles.direction = 'ltr';
        }
        
        if (type === 'success') {
            styles.backgroundColor = '#2ecc71';
        } else if (type === 'error') {
            styles.backgroundColor = '#e74c3c';
        } else {
            styles.backgroundColor = '#3498db';
        }
        
        Object.assign(messageEl.style, styles);
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }
    
    // Helper function to get translation
    function t(key, defaultValue = '') {
        if (window.translator && typeof window.translator.translate === 'function') {
            return window.translator.translate(key, defaultValue);
        }
        return defaultValue || key;
    }
    
    // Make t function available globally
    window.t = t;
    
    // Dispatch language change event when translator changes language
    if (window.translator && window.translator.changeLanguage) {
        const originalChangeLanguage = window.translator.changeLanguage;
        window.translator.changeLanguage = function(lang) {
            originalChangeLanguage.call(this, lang);
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            }));
        };
    }
});
