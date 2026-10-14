import { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'en' ? 'hi' : 'en');
  };

  const translations = {
    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.diagnose': 'Crop Doctor',
      'nav.mandi': 'Mandi Rates',
      'nav.weather': 'Weather',
      'nav.schemes': 'Government Schemes',
      'nav.login': 'Sign In',
      'nav.logout': 'Sign Out',
      'brandName': 'KisanVaani',
      'tagline': 'Voice of the Farmer',
      
      // Hero Section
      'hero.badge': '✨ AI-Powered Agricultural Intelligence',
      'hero.title': 'Empowering Farmers with Real-Time AI',
      'hero.subtitle': 'Instantly diagnose crop diseases, track live APMC mandi prices, and discover your government scheme eligibility in seconds.',
      'hero.startDiagnose': 'Run AI Crop Doctor',
      'hero.exploreMandi': 'Explore Live Mandi Rates →',

      // Feature Cards
      'card.doctor.title': 'Crop Doctor',
      'card.doctor.desc': 'Upload photo of diseased crop leaf and receive instant AI diagnosis and pesticide prescriptions.',
      'card.mandi.title': 'Mandi Rates',
      'card.mandi.desc': 'Live APMC commodity rates and mandi prices straight from government channels.',
      'card.weather.title': 'Weather',
      'card.weather.desc': 'Localized 10-day agricultural forecasts, rain probability, and crop preservation tips.',
      'card.schemes.title': 'Government Schemes',
      'card.schemes.desc': 'Search PM-KISAN schemes, subsidies, and government agricultural loans using AI.'
    },
    hi: {
      // Navbar
      'nav.home': 'होम',
      'nav.diagnose': 'फसल डॉक्टर',
      'nav.mandi': 'मंडी भाव',
      'nav.weather': 'मौसम',
      'nav.schemes': 'सरकारी योजनाएं',
      'nav.login': 'लॉग इन',
      'nav.logout': 'लॉग आउट',
      'brandName': 'किसानवाणी',
      'tagline': 'किसान की आवाज़',
      
      // Hero Section
      'hero.badge': '✨ एआई-संचालित कृषि बुद्धिमत्ता',
      'hero.title': 'रीयल-टाइम एआई के साथ किसानों का सशक्तिकरण',
      'hero.subtitle': 'फसलों की बीमारियों का तुरंत निदान करें, लाइव एपीएमसी मंडी की कीमतों को ट्रैक करें, और सेकंडों में अपनी सरकारी योजना पात्रता का पता लगाएं।',
      'hero.startDiagnose': 'एआई फसल डॉक्टर चलाएं',
      'hero.exploreMandi': 'लाइव मंडी भाव देखें →',

      // Feature Cards
      'card.doctor.title': 'फसल डॉक्टर',
      'card.doctor.desc': 'बीमार फसल के पत्ते की फोटो अपलोड करें और तुरंत एआई निदान और कीटनाशक नुस्खे प्राप्त करें।',
      'card.mandi.title': 'मंडी भाव',
      'card.mandi.desc': 'सरकारी चैनलों से सीधे लाइव एपीएमसी कमोडिटी दरें और मंडी की कीमतें।',
      'card.weather.title': 'मौसम',
      'card.weather.desc': 'स्थानीय 10-दिवसीय कृषि पूर्वानुमान, बारिश की संभावना और फसल संरक्षण युक्तियाँ।',
      'card.schemes.title': 'सरकारी योजनाएं',
      'card.schemes.desc': 'एआई का उपयोग करके पीएम-किसान योजनाओं, सब्सिडी और सरकारी कृषि ऋणों की खोज करें।'
    }
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);