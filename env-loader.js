// env-loader.js — PSAS System
// Utility untuk load konfigurasi Firebase dari storage

class EnvLoader {
    constructor() {
        this._config = null;
    }

    getConfig() {
        if (this._config) return this._config;

        // Prioritas 1: sessionStorage (sesi aktif)
        let raw = sessionStorage.getItem('psas_firebase_config');
        // Prioritas 2: localStorage (permanen)
        if (!raw) raw = localStorage.getItem('psas_firebase_config');
        // Prioritas 3: window._env_ (inject dari server)
        if (!raw && window._env_?.FIREBASE_CONFIG) {
            this._config = window._env_.FIREBASE_CONFIG;
            return this._config;
        }

        if (!raw) return null;

        try {
            const parsed = JSON.parse(atob(raw));
            this._config = {
                apiKey:            parsed.apiKey            || parsed.VITE_FIREBASE_API_KEY,
                authDomain:        parsed.authDomain        || parsed.VITE_FIREBASE_AUTH_DOMAIN,
                projectId:         parsed.projectId         || parsed.VITE_FIREBASE_PROJECT_ID,
                storageBucket:     parsed.storageBucket     || parsed.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: parsed.messagingSenderId || parsed.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId:             parsed.appId             || parsed.VITE_FIREBASE_APP_ID,
            };
            return this._config;
        } catch (e) {
            console.error('[EnvLoader] Gagal parse config:', e);
            return null;
        }
    }

    clear() {
        this._config = null;
        localStorage.removeItem('psas_firebase_config');
        sessionStorage.removeItem('psas_firebase_config');
    }
}

// Singleton
const envLoader = new EnvLoader();
window.envLoader = envLoader;