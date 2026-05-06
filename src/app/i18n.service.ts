import { Injectable } from '@angular/core';

type SupportedLanguage = 'en' | 'hi';

const DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    findHelpers: 'Find Helpers',
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
  },
  hi: {
    findHelpers: 'हेल्पर खोजें',
    dashboard: 'डैशबोर्ड',
    bookings: 'बुकिंग्स',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private language: SupportedLanguage = (localStorage.getItem('careNestLang') as SupportedLanguage) || 'en';

  setLanguage(language: SupportedLanguage): void {
    this.language = language;
    localStorage.setItem('careNestLang', language);
  }

  getLanguage(): SupportedLanguage {
    return this.language;
  }

  t(key: string): string {
    return DICTIONARY[this.language][key] || key;
  }
}
