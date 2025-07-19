export type Language = 'en' | 'bn';

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  appDescription: string;
  
  // Search
  searchPlaceholder: string;
  useCurrentLocation: string;
  recentSearches: string;
  
  // Weather Card
  feelsLike: string;
  humidity: string;
  wind: string;
  pressure: string;
  visibility: string;
  sunrise: string;
  sunset: string;
  
  // Weather Descriptions
  clearSkies: string;
  partlyCloudy: string;
  cloudy: string;
  lightRain: string;
  rainy: string;
  lightDrizzle: string;
  snowy: string;
  misty: string;
  pleasantWeather: string;
  
  // Temperature Feelings
  warmAndPleasant: string;
  comfortable: string;
  mildAndNice: string;
  coolAndRefreshing: string;
  crispAndInvigorating: string;
  coolAndCozy: string;
  
  // Comfort Levels
  dryAndComfortable: string;
  veryComfortable: string;
  pleasantHumidity: string;
  bitHumidButManageable: string;
  
  // Wind Descriptions
  calmAndPeaceful: string;
  lightBreeze: string;
  gentleBreeze: string;
  moderateBreeze: string;
  freshBreeze: string;
  
  // Settings
  settings: string;
  appearance: string;
  lightMode: string;
  darkMode: string;
  autoMode: string;
  temperatureUnit: string;
  celsius: string;
  fahrenheit: string;
  language: string;
  notifications: string;
  getWeatherAlerts: string;
  autoLocation: string;
  useCurrentLocationDesc: string;
  resetToDefaults: string;
  resetConfirm: string;
  cancel: string;
  reset: string;
  
  // Map
  interactiveWeatherMap: string;
  searchLocation: string;
  recentLocations: string;
  yourLocation: string;
  weatherLocation: string;
  clickAnywhere: string;
  
  // Loading and Errors
  gettingWeather: string;
  weatherUpdateNeeded: string;
  tryAgain: string;
  greatWeatherAway: string;
  
  // Footer
  brightSideWeather: string;
  weatherDataBy: string;
  designedWith: string;
  
  // Welcome
  readyToExplore: string;
  searchOrUseLocation: string;
  everyDayBeauty: string;
  perfectTimeOutdoors: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: "Pleasant Weather",
    appSubtitle: "Discover beautiful weather conditions around the world",
    appDescription: "Focusing on the bright side of weather",
    
    // Search
    searchPlaceholder: "Discover weather in your favorite places...",
    useCurrentLocation: "Use current location",
    recentSearches: "Recent Searches",
    
    // Weather Card
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    
    // Weather Descriptions
    clearSkies: "Perfect sunny weather",
    partlyCloudy: "Pleasant with some clouds",
    cloudy: "Comfortable overcast day",
    lightRain: "Refreshing light showers",
    rainy: "Cozy rainy weather",
    lightDrizzle: "Gentle mist in the air",
    snowy: "Beautiful winter weather",
    misty: "Atmospheric and serene",
    pleasantWeather: "Nice conditions outside",
    
    // Temperature Feelings
    warmAndPleasant: "Warm and pleasant",
    comfortable: "Comfortable",
    mildAndNice: "Mild and nice",
    coolAndRefreshing: "Cool and refreshing",
    crispAndInvigorating: "Crisp and invigorating",
    coolAndCozy: "Cool and cozy",
    
    // Comfort Levels
    dryAndComfortable: "Dry and comfortable",
    veryComfortable: "Very comfortable",
    pleasantHumidity: "Pleasant humidity",
    bitHumidButManageable: "A bit humid but manageable",
    
    // Wind Descriptions
    calmAndPeaceful: "Calm and peaceful",
    lightBreeze: "Light breeze",
    gentleBreeze: "Gentle breeze",
    moderateBreeze: "Moderate breeze",
    freshBreeze: "Fresh breeze",
    
    // Settings
    settings: "Settings",
    appearance: "Appearance",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    autoMode: "Auto (System)",
    temperatureUnit: "Temperature Unit",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    language: "Language",
    notifications: "Notifications",
    getWeatherAlerts: "Get weather alerts",
    autoLocation: "Auto Location",
    useCurrentLocationDesc: "Use current location",
    resetToDefaults: "Reset to Defaults",
    resetConfirm: "Reset all settings to default values?",
    cancel: "Cancel",
    reset: "Reset",
    
    // Map
    interactiveWeatherMap: "Interactive Weather Map",
    searchLocation: "Search for a city or location...",
    recentLocations: "Recent Locations:",
    yourLocation: "Your Location",
    weatherLocation: "Weather Location",
    clickAnywhere: "Search, click, or use current location",
    
    // Loading and Errors
    gettingWeather: "Getting your weather forecast...",
    weatherUpdateNeeded: "Oops! Weather Update Needed",
    tryAgain: "Try Again",
    greatWeatherAway: "Great weather is just a moment away!",
    
    // Footer
    brightSideWeather: "Bringing you the bright side of weather",
    weatherDataBy: "Weather data by OpenWeatherMap",
    designedWith: "Designed with ☀️ and optimism",
    
    // Welcome
    readyToExplore: "Ready to Explore Pleasant Weather?",
    searchOrUseLocation: "Search for any city or use your current location to discover beautiful weather conditions",
    everyDayBeauty: "Every day has its own beauty",
    perfectTimeOutdoors: "Perfect time to enjoy the beautiful outdoors! ☀️"
  },
  
  bn: {
    // Header
    appTitle: "মনোরম আবহাওয়া",
    appSubtitle: "বিশ্বজুড়ে সুন্দর আবহাওয়ার অবস্থা আবিষ্কার করুন",
    appDescription: "আবহাওয়ার উজ্জ্বল দিকে মনোনিবেশ",
    
    // Search
    searchPlaceholder: "আপনার প্রিয় স্থানের আবহাওয়া আবিষ্কার করুন...",
    useCurrentLocation: "বর্তমান অবস্থান ব্যবহার করুন",
    recentSearches: "সাম্প্রতিক অনুসন্ধান",
    
    // Weather Card
    feelsLike: "অনুভূত হয়",
    humidity: "আর্দ্রতা",
    wind: "বাতাস",
    pressure: "চাপ",
    visibility: "দৃশ্যমানতা",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    
    // Weather Descriptions
    clearSkies: "নিখুঁত রৌদ্রোজ্জ্বল আবহাওয়া",
    partlyCloudy: "কিছু মেঘসহ মনোরম",
    cloudy: "আরামদায়ক মেঘাচ্ছন্ন দিন",
    lightRain: "সতেজকারী হালকা বৃষ্টি",
    rainy: "আরামদায়ক বৃষ্টির আবহাওয়া",
    lightDrizzle: "বাতাসে মৃদু কুয়াশা",
    snowy: "সুন্দর শীতের আবহাওয়া",
    misty: "বায়ুমণ্ডলীয় এবং নির্মল",
    pleasantWeather: "বাইরে চমৎকার অবস্থা",
    
    // Temperature Feelings
    warmAndPleasant: "উষ্ণ এবং মনোরম",
    comfortable: "আরামদায়ক",
    mildAndNice: "মৃদু এবং চমৎকার",
    coolAndRefreshing: "শীতল এবং সতেজকারী",
    crispAndInvigorating: "তাজা এবং উদ্দীপক",
    coolAndCozy: "শীতল এবং আরামদায়ক",
    
    // Comfort Levels
    dryAndComfortable: "শুষ্ক এবং আরামদায়ক",
    veryComfortable: "অত্যন্ত আরামদায়ক",
    pleasantHumidity: "মনোরম আর্দ্রতা",
    bitHumidButManageable: "কিছুটা আর্দ্র কিন্তু সহনীয়",
    
    // Wind Descriptions
    calmAndPeaceful: "শান্ত এবং নিরিবিলি",
    lightBreeze: "হালকা বাতাস",
    gentleBreeze: "মৃদু বাতাস",
    moderateBreeze: "মাঝারি বাতাস",
    freshBreeze: "তাজা বাতাস",
    
    // Settings
    settings: "সেটিংস",
    appearance: "চেহারা",
    lightMode: "হালকা মোড",
    darkMode: "অন্ধকার মোড",
    autoMode: "স্বয়ংক্রিয় (সিস্টেম)",
    temperatureUnit: "তাপমাত্রার একক",
    celsius: "সেলসিয়াস (°C)",
    fahrenheit: "ফারেনহাইট (°F)",
    language: "ভাষা",
    notifications: "বিজ্ঞপ্তি",
    getWeatherAlerts: "আবহাওয়া সতর্কতা পান",
    autoLocation: "স্বয়ংক্রিয় অবস্থান",
    useCurrentLocationDesc: "বর্তমান অবস্থান ব্যবহার করুন",
    resetToDefaults: "ডিফল্টে রিসেট করুন",
    resetConfirm: "সমস্ত সেটিংস ডিফল্ট মানে রিসেট করবেন?",
    cancel: "বাতিল",
    reset: "রিসেট",
    
    // Map
    interactiveWeatherMap: "ইন্টারঅ্যাক্টিভ আবহাওয়া মানচিত্র",
    searchLocation: "একটি শহর বা অবস্থান অনুসন্ধান করুন...",
    recentLocations: "সাম্প্রতিক অবস্থান:",
    yourLocation: "আপনার অবস্থান",
    weatherLocation: "আবহাওয়া অবস্থান",
    clickAnywhere: "অনুসন্ধান, ক্লিক, বা বর্তমান অবস্থান ব্যবহার করুন",
    
    // Loading and Errors
    gettingWeather: "আপনার আবহাওয়ার পূর্বাভাস পাওয়া হচ্ছে...",
    weatherUpdateNeeded: "ওহো! আবহাওয়া আপডেট প্রয়োজন",
    tryAgain: "আবার চেষ্টা করুন",
    greatWeatherAway: "দুর্দান্ত আবহাওয়া মাত্র এক মুহূর্ত দূরে!",
    
    // Footer
    brightSideWeather: "আবহাওয়ার উজ্জ্বল দিক নিয়ে আসছি",
    weatherDataBy: "OpenWeatherMap দ্বারা আবহাওয়ার তথ্য",
    designedWith: "☀️ এবং আশাবাদ দিয়ে ডিজাইন করা",
    
    // Welcome
    readyToExplore: "মনোরম আবহাওয়া অন্বেষণ করতে প্রস্তুত?",
    searchOrUseLocation: "সুন্দর আবহাওয়ার অবস্থা আবিষ্কার করতে যেকোনো শহর অনুসন্ধান করুন বা আপনার বর্তমান অবস্থান ব্যবহার করুন",
    everyDayBeauty: "প্রতিটি দিনের নিজস্ব সৌন্দর্য রয়েছে",
    perfectTimeOutdoors: "সুন্দর বাইরের পরিবেশ উপভোগ করার নিখুঁত সময়! ☀️"
  }
};

export const useTranslation = (language: Language) => {
  return translations[language];
};