// env-loader.js
// Load environment variables from .env file (hanya untuk development)
// Untuk production, gunakan backend API proxy

class EnvLoader {
    constructor() {
        this.config = null;
    }

    async loadEnv() {
        if (this.config) return this.config;
        
        try {
            // Untuk production, sebaiknya config disimpan di backend
            // dan diambil via API dengan autentikasi khusus
            
            // Cara 1: Dari file .env (development only)
            // Cara 2: Dari sessionStorage yang sudah di-set oleh admin saat setup
            // Cara 3: Dari backend API endpoint yang aman
            
            const envFromStorage = sessionStorage.getItem('psas_firebase_config');
            if (envFromStorage) {
                this.config = JSON.parse(envFromStorage);
                return this.config;
            }
            
            // Fallback: Baca dari window.env (jika di-inject dari server)
            if (window._env_ && window._env_.FIREBASE_CONFIG) {
                this.config = window._env_.FIREBASE_CONFIG;
                return this.config;
            }
            
            throw new Error('Konfigurasi Firebase tidak ditemukan');
            
        } catch (error) {
            console.error('Gagal load environment:', error);
            return null;
        }
    }
    
    getConfig() {
        return this.config;
    }
    
    async getFirebaseConfig() {
        const config = await this.loadEnv();
        if (!config) return null;
        
        return {
            apiKey: config.apiKey || config.VITE_FIREBASE_API_KEY,
            authDomain: config.authDomain || config.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: config.projectId || config.VITE_FIREBASE_PROJECT_ID,
            storageBucket: config.storageBucket || config.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: config.messagingSenderId || config.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: config.appId || config.VITE_FIREBASE_APP_ID
        };
    }
}

// Singleton instance
const envLoader = new EnvLoader();
window.envLoader = envLoader;