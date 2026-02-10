// Main Application
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
            title: 'موقعك'
        }).addTo(map);
        
        // Add popup to user marker
        userMarker.bindPopup(`
            <div style="text-align: center;">
                <h3>موقعك</h3>
                <p>خط العرض: ${userLocation.lat.toFixed(6)}</p>
                <p>خط الطول: ${userLocation.lon.toFixed(6)}</p>
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
    }
    
    function updateDistanceValue() {
        distanceValue.textContent = distanceSlider.value;
    }
    
    function getUserLocation() {
        if (!navigator.geolocation) {
            showMessage('المتصفح لا يدعم تحديد الموقع', 'error');
            return;
        }
        
        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد الموقع...';
        getLocationBtn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation.lat = position.coords.latitude;
                userLocation.lon = position.coords.longitude;
                
                // Update input fields
                latitudeInput.value = userLocation.lat.toFixed(6);
                longitudeInput.value = userLocation.lon.toFixed(6);
                
                showMessage('تم تحديد موقعك بنجاح!', 'success');
                getLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> استخدام موقعي';
                getLocationBtn.disabled = false;
                
                // Update user marker on map
                updateUserMarker();
                centerMapOnUser();
                
                // Auto-search for services
                findServices();
            },
            (error) => {
                let errorMessage = 'تعذر تحديد موقعك. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'تم رفض الإذن.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'الموقع غير متوفر.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'انتهت مهلة الطلب.';
                        break;
                    default:
                        errorMessage += 'خطأ غير معروف.';
                }
                
                showMessage(errorMessage, 'error');
                getLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> استخدام موقعي';
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
        
        showMessage('تم استخدام تونس كموقع افتراضي', 'info');
        
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
            showMessage('الرجاء إدخال إحداثيات صحيحة', 'error');
            return;
        }
        
        userLocation.lat = lat;
        userLocation.lon = lon;
        
        const category = categorySelect.value;
        const maxDistance = distanceSlider.value;
        
        // Show loading state
        findServicesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري البحث...';
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
                    resultsCount.textContent = `${currentServices.length} خدمات وجدت`;
                    
                    // Zoom to fit all markers if we have services
                    if (currentServices.length > 0) {
                        zoomToFitMarkers();
                    }
                } else {
                    showMessage('خطأ: ' + data.error, 'error');
                    resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle fa-3x"></i><p>لم يتم العثور على خدمات. حاول تعديل بحثك.</p></div>';
                    resultsCount.textContent = '0 خدمات وجدت';
                    clearServiceMarkers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('فشل في جلب الخدمات. الرجاء المحاولة مرة أخرى.', 'error');
            })
            .finally(() => {
                findServicesBtn.innerHTML = '<i class="fas fa-search"></i> ابحث عن الخدمات القريبة';
                findServicesBtn.disabled = false;
            });
    }
    
    function displayServices(services) {
        if (services.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-slash fa-3x"></i><p>لم يتم العثور على خدمات ضمن المسافة المحددة. حاول زيادة دائرة البحث.</p></div>';
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
        
        // Get category display name
        const categoryNames = {
            'transporter': 'خدمة نقل',
            'doctor': 'خدمة طبية',
            'pharmacy': 'صيدلية',
            'mechanic': 'تصليح سيارات',
            'restaurant': 'مطعم',
            'technician': 'خدمة تقنية'
        };
        
        const categoryName = categoryNames[service.category] || 'خدمة';
        
        // Get subcategory display name
        const subcategoryNames = {
            'taxi': 'تاكسي',
            'delivery': 'توصيل',
            'moving': 'نقل عفش',
            'ride_sharing': 'نقل مشترك',
            'general': 'طبيب عام',
            'dentist': 'طبيب أسنان',
            'pediatrician': 'طبيب أطفال',
            'cardiologist': 'طبيب قلب',
            'drugstore': 'صيدلية',
            'auto': 'تصليح سيارات',
            'dining': 'مطعم',
            'computer': 'تصليح حواسيب'
        };
        
        const subcategoryName = subcategoryNames[service.subcategory] || service.subcategory;
        
        // Format phone number
        const phoneFormatted = service.phone.replace(/(\+\d{1,3})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-name">${service.name}</div>
                <div class="service-distance">${service.distance} كم</div>
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
            
            // Create popup content
            const popupContent = `
                <div style="text-align: right; direction: rtl;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${service.name}</h3>
                    <div class="popup-distance" style="background: #3498db; color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem; display: inline-block; margin-bottom: 10px;">
                        ${service.distance} كم
                    </div>
                    <p style="margin: 5px 0;"><strong>العنوان:</strong> ${service.address}</p>
                    <p style="margin: 5px 0;"><strong>الهاتف:</strong> <span class="popup-phone">${service.phone}</span></p>
                    <p style="margin: 5px 0;"><strong>التقييم:</strong> ${service.rating}/5</p>
                    <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #7f8c8d;">${service.description}</p>
                    <button onclick="showServiceDetailsModal(${service.id})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer; width: 100%;">
                        <i class="fas fa-info-circle"></i> المزيد من التفاصيل
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
            'transporter': 'خدمة نقل',
            'doctor': 'خدمة طبية',
            'pharmacy': 'صيدلية',
            'mechanic': 'تصليح سيارات',
            'restaurant': 'مطعم',
            'technician': 'خدمة تقنية'
        };
        
        const categoryName = categoryNames[service.category] || 'خدمة';
        
        // Get subcategory display name
        const subcategoryNames = {
            'taxi': 'تاكسي',
            'delivery': 'توصيل',
            'moving': 'نقل عفش',
            'ride_sharing': 'نقل مشترك',
            'general': 'طبيب عام',
            'dentist': 'طبيب أسنان',
            'pediatrician': 'طبيب أطفال',
            'cardiologist': 'طبيب قلب',
            'drugstore': 'صيدلية',
            'auto': 'تصليح سيارات',
            'dining': 'مطعم',
            'computer': 'تصليح حواسيب'
        };
        
        const subcategoryName = subcategoryNames[service.subcategory] || service.subcategory;
        
        // Format phone number
        const phoneFormatted = service.phone.replace(/(\+\d{1,3})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        
        modalBody.innerHTML = `
            <h2 class="modal-service-name">${service.name}</h2>
            <div class="modal-service-category">${categoryName} - ${subcategoryName}</div>
            
            <div class="modal-detail">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>العنوان:</strong> ${service.address}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>الهاتف:</strong> ${phoneFormatted}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-ruler"></i>
                <div>
                    <strong>المسافة:</strong> ${service.distance} كم من موقعك
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-star"></i>
                <div>
                    <strong>التقييم:</strong> ${service.rating}/5
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>الوصف:</strong> ${service.description}
                </div>
            </div>
            
            <div class="modal-detail">
                <i class="fas fa-map"></i>
                <div>
                    <strong>الإحداثيات:</strong> ${service.latitude.toFixed(6)}, ${service.longitude.toFixed(6)}
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="centerOnServiceOnMap(${service.id})" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px; cursor: pointer;">
                    <i class="fas fa-map-marker-alt"></i> عرض على الخريطة
                </button>
                <button onclick="showRouteToService(${service.id})" style="background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px; cursor: pointer;">
                    <i class="fas fa-route"></i> عرض المسار
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
    }
    
    function showMessage(message, type) {
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
});