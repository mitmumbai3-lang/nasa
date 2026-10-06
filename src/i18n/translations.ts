// i18n translations for English, Español, Français, हिन्दी, Kiswahili

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'hi' | 'sw';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  fieldSetup: string;
  priorities: string;
  climateContext: string;
  rotationResults: string;
  actionPlan: string;
  methodology: string;
  aboutNasa: string;
  demoRegions: string;
  fieldLocation: string;
  useMyLocation: string;
  drawingField: string;
  fieldSize: string;
  irrigation: string;
  irrigationNone: string;
  irrigationLimited: string;
  irrigationFull: string;
  currentCrop: string;
  cropHistory: string;
  soilProperties: string;
  texture: string;
  organicCarbon: string;
  ph: string;
  waterHoldingCapacity: string;
  overrideSoil: string;
  saveSoil: string;
  cancel: string;
  waterSavings: string;
  soilHealth: string;
  incomeStability: string;
  droughtResilience: string;
  lowInputCost: string;
  laborEase: string;
  scenarioBaseline: string;
  scenarioHotter: string;
  scenarioDrier: string;
  scenarioHotDry: string;
  whyThisRotation: string;
  compareRotations: string;
  printExport: string;
  seasonalCalendar: string;
  nasaDataSource: string;
  liveNasa: string;
  benchmarkNasa: string;
  offlineMode: string;
  overallScore: string;
  topPick: string;
  somChange: string;
  waterSaved: string;
  nitrogenFixed: string;
  droughtShield: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'RotaSense',
    tagline: 'Climate-Resilient Crop Rotation Planning Powered by NASA Earth Data',
    fieldSetup: '1. Field Setup',
    priorities: '2. Farmer Priorities',
    climateContext: '3. NASA Climate Dashboard',
    rotationResults: '4. Recommended Rotations',
    actionPlan: '5. Action Plan & Calendar',
    methodology: 'Methodology',
    aboutNasa: 'About NASA Data',
    demoRegions: 'Quick Demo Regions',
    fieldLocation: 'Field Location & Satellite Map',
    useMyLocation: 'Use My GPS Location',
    drawingField: 'Click map to place field pin or draw boundary',
    fieldSize: 'Field Size',
    irrigation: 'Irrigation Access',
    irrigationNone: 'Rainfed (No Irrigation)',
    irrigationLimited: 'Limited / Supplemental',
    irrigationFull: 'Full Irrigation Access',
    currentCrop: 'Current Crop',
    cropHistory: 'Previous 3 Seasons (Optional)',
    soilProperties: 'Soil Properties (ISRIC SoilGrids Auto-Detected)',
    texture: 'Soil Texture',
    organicCarbon: 'Soil Organic Carbon (SOC)',
    ph: 'Soil pH',
    waterHoldingCapacity: 'Water Holding Capacity',
    overrideSoil: 'Edit Soil Details',
    saveSoil: 'Save Soil Overrides',
    cancel: 'Cancel',
    waterSavings: 'Water Savings & Conservation',
    soilHealth: 'Soil Health & Regeneration',
    incomeStability: 'Income & Market Stability',
    droughtResilience: 'Drought & Heat Resilience',
    lowInputCost: 'Low Input & Fertilizer Costs',
    laborEase: 'Manageable Labor & Operations',
    scenarioBaseline: 'Current Normal',
    scenarioHotter: 'Hotter (+2°C)',
    scenarioDrier: 'Drier (-15% Rain)',
    scenarioHotDry: 'Hotter & Drier (+2°C, -15%)',
    whyThisRotation: 'Why this rotation?',
    compareRotations: 'Side-by-Side Comparison',
    printExport: 'Print / Export PDF Plan',
    seasonalCalendar: 'Seasonal Crop Operations Calendar',
    nasaDataSource: 'Data Provenance',
    liveNasa: 'Live NASA & ISRIC Satellite Data',
    benchmarkNasa: 'NASA Climatology Benchmark Archive',
    offlineMode: 'Offline Field Cache Active',
    overallScore: 'Resilience Score',
    topPick: 'Top Recommendation',
    somChange: 'Projected Organic Matter',
    waterSaved: 'Annual Water Conserved',
    nitrogenFixed: 'Biological Nitrogen Fixed',
    droughtShield: 'Drought Survival Index',
  },
  es: {
    appName: 'RotaSense',
    tagline: 'Planificación de rotación de cultivos con datos satelitales de la NASA',
    fieldSetup: '1. Configuración de Parcela',
    priorities: '2. Prioridades del Agricultor',
    climateContext: '3. Panel Climático de la NASA',
    rotationResults: '4. Rotaciones Recomendadas',
    actionPlan: '5. Plan de Acción y Calendario',
    methodology: 'Metodología',
    aboutNasa: 'Datos de la NASA',
    demoRegions: 'Regiones de Demostración',
    fieldLocation: 'Ubicación y Mapa Satelital',
    useMyLocation: 'Usar Mi Ubicación GPS',
    drawingField: 'Toque el mapa para fijar la parcela',
    fieldSize: 'Tamaño del Campo',
    irrigation: 'Acceso a Riego',
    irrigationNone: 'Secano (Sin Riego)',
    irrigationLimited: 'Riego Suplementario',
    irrigationFull: 'Riego Completo',
    currentCrop: 'Cultivo Actual',
    cropHistory: 'Últimas 3 Temporadas',
    soilProperties: 'Propiedades del Suelo (ISRIC SoilGrids)',
    texture: 'Textura del Suelo',
    organicCarbon: 'Carbono Orgánico del Suelo (COS)',
    ph: 'pH del Suelo',
    waterHoldingCapacity: 'Retención de Agua',
    overrideSoil: 'Editar Suelo',
    saveSoil: 'Guardar Suelo',
    cancel: 'Cancelar',
    waterSavings: 'Ahorro y Conservación de Agua',
    soilHealth: 'Salud y Regeneración del Suelo',
    incomeStability: 'Estabilidad de Ingresos',
    droughtResilience: 'Resiliencia a Sequía y Calor',
    lowInputCost: 'Bajos Costos de Fertilizantes',
    laborEase: 'Manejo Sencillo de Mano de Obra',
    scenarioBaseline: 'Normal Actual',
    scenarioHotter: 'Más Cálido (+2°C)',
    scenarioDrier: 'Más Seco (-15% Lluvia)',
    scenarioHotDry: 'Cálido y Seco (+2°C, -15%)',
    whyThisRotation: '¿Por qué esta rotación?',
    compareRotations: 'Comparación Lado a Lado',
    printExport: 'Imprimir / Exportar PDF',
    seasonalCalendar: 'Calendario de Operaciones',
    nasaDataSource: 'Origen de Datos',
    liveNasa: 'Datos Satelitales en Vivo NASA e ISRIC',
    benchmarkNasa: 'Archivo de Referencia Climática NASA',
    offlineMode: 'Caché de Campo Fuera de Línea',
    overallScore: 'Puntuación de Resiliencia',
    topPick: 'Mejor Opción',
    somChange: 'Materia Orgánica Proyectada',
    waterSaved: 'Agua Ahorrada Anualmente',
    nitrogenFixed: 'Nitrógeno Biológico Fijado',
    droughtShield: 'Índice de Supervivencia a Sequía',
  },
  fr: {
    appName: 'RotaSense',
    tagline: 'Planification de rotation des cultures basée sur les données d’observation de la NASA',
    fieldSetup: '1. Configuration du Champ',
    priorities: '2. Priorités Agricoles',
    climateContext: '3. Tableau Climatique NASA',
    rotationResults: '4. Rotations Recommandées',
    actionPlan: '5. Plan d’Action & Calendrier',
    methodology: 'Méthodologie',
    aboutNasa: 'À propos des Données NASA',
    demoRegions: 'Régions de Démonstration',
    fieldLocation: 'Localisation & Carte Satellite',
    useMyLocation: 'Utiliser Ma Position GPS',
    drawingField: 'Touchez la carte pour placer la parcelle',
    fieldSize: 'Superficie',
    irrigation: 'Accès à l’Irrigation',
    irrigationNone: 'Pluvial (Aucune)',
    irrigationLimited: 'Irrigation Limitée',
    irrigationFull: 'Irrigation Complète',
    currentCrop: 'Culture Actuelle',
    cropHistory: '3 Dernières Saisons',
    soilProperties: 'Propriétés du Sol (ISRIC SoilGrids)',
    texture: 'Texture du Sol',
    organicCarbon: 'Carbone Organique du Sol (COS)',
    ph: 'pH du Sol',
    waterHoldingCapacity: 'Capacité de Rétention d’Eau',
    overrideSoil: 'Modifier le Sol',
    saveSoil: 'Enregistrer le Sol',
    cancel: 'Annuler',
    waterSavings: 'Économie et Gestion de l’Eau',
    soilHealth: 'Santé et Régénération du Sol',
    incomeStability: 'Stabilité des Revenus',
    droughtResilience: 'Résilience Sécheresse & Chaleur',
    lowInputCost: 'Faible Coût d’Intrants',
    laborEase: 'Facilité de Travail',
    scenarioBaseline: 'Normal Actuel',
    scenarioHotter: 'Plus Chaud (+2°C)',
    scenarioDrier: 'Plus Sec (-15% Pluie)',
    scenarioHotDry: 'Chaud et Sec (+2°C, -15%)',
    whyThisRotation: 'Pourquoi cette rotation ?',
    compareRotations: 'Comparaison Côte à Côte',
    printExport: 'Imprimer / Exporter PDF',
    seasonalCalendar: 'Calendrier des Opérations',
    nasaDataSource: 'Provenance des Données',
    liveNasa: 'Données Satellites NASA & ISRIC en Direct',
    benchmarkNasa: 'Archive Climatologique NASA',
    offlineMode: 'Mode Hors Ligne Actif',
    overallScore: 'Score de Résilience',
    topPick: 'Premier Choix',
    somChange: 'Matière Organique Projetée',
    waterSaved: 'Eau Économisée par An',
    nitrogenFixed: 'Azote Biologique Fixé',
    droughtShield: 'Indice de Résistance Sécheresse',
  },
  hi: {
    appName: 'RotaSense',
    tagline: 'नासा उपग्रह डेटा आधारित जलवायु-सहिष्णु फसल चक्र प्रणाली',
    fieldSetup: '1. खेत का विवरण',
    priorities: '2. किसान की प्राथमिकताएं',
    climateContext: '3. नासा जलवायु डैशबोर्ड',
    rotationResults: '4. अनुशंसित फसल चक्र',
    actionPlan: '5. कार्य योजना और कैलेंडर',
    methodology: 'कार्यप्रणाली',
    aboutNasa: 'नासा डेटा के बारे में',
    demoRegions: 'डेमो क्षेत्र चुनें',
    fieldLocation: 'खेत का स्थान और नक्शा',
    useMyLocation: 'मेरा जीपीएस स्थान उपयोग करें',
    drawingField: 'खेत पिन करने के लिए नक्शे पर टैप करें',
    fieldSize: 'खेत का आकार (हेक्टेयर)',
    irrigation: 'सिंचाई की सुविधा',
    irrigationNone: 'बारिश पर निर्भर (कोई सिंचाई नहीं)',
    irrigationLimited: 'सीमित / पूरक सिंचाई',
    irrigationFull: 'पूर्ण सिंचाई उपलब्ध',
    currentCrop: 'वर्तमान फसल',
    cropHistory: 'पिछले 3 मौसम (वैकल्पिक)',
    soilProperties: 'मिट्टी की विशेषताएं (ISRIC सॉइल-ग्रिड्स)',
    texture: 'मिट्टी की बनावट',
    organicCarbon: 'जैविक कार्बन (SOC)',
    ph: 'मिट्टी का पीएच (pH)',
    waterHoldingCapacity: 'जल धारण क्षमता',
    overrideSoil: 'मिट्टी बदलें',
    saveSoil: 'सुरक्षित करें',
    cancel: 'रद्द करें',
    waterSavings: 'पानी की बचत और संरक्षण',
    soilHealth: 'मिट्टी का स्वास्थ्य और पोषण',
    incomeStability: 'आय और बाजार स्थिरता',
    droughtResilience: 'सूखा और गर्मी सहनशीलता',
    lowInputCost: 'कम खाद और कीटनाशक लागत',
    laborEase: 'श्रम और कामकाज में सुगमता',
    scenarioBaseline: 'वर्तमान सामान्य',
    scenarioHotter: 'अधिक गर्म (+2°C)',
    scenarioDrier: 'कम बारिश (-15%)',
    scenarioHotDry: 'गर्म और सूखा (+2°C, -15%)',
    whyThisRotation: 'यह फसल चक्र क्यों चुनें?',
    compareRotations: 'तुलना करें',
    printExport: 'प्रिंट / पीडीएफ योजना',
    seasonalCalendar: 'मौसमी कृषि कैलेंडर',
    nasaDataSource: 'डेटा स्रोत',
    liveNasa: 'लाइव नासा और ISRIC उपग्रह डेटा',
    benchmarkNasa: 'नासा जलवायु संग्रह डेटा',
    offlineMode: 'ऑफ़लाइन कैश सक्रिय',
    overallScore: 'सहनशीलता स्कोर',
    topPick: 'सर्वश्रेष्ठ अनुशंसा',
    somChange: 'प्रत्याशित जैविक कार्बन',
    waterSaved: 'वार्षिक जल बचत',
    nitrogenFixed: 'प्राकृतिक नाइट्रोजन संचय',
    droughtShield: 'सूखा जीवन रक्षा सूचकांक',
  },
  sw: {
    appName: 'RotaSense',
    tagline: 'Upangaji wa mzunguko wa mazao unaotegemea data za setilaiti za NASA',
    fieldSetup: '1. Mpangilio wa Shamba',
    priorities: '2. Vipaumbele vya Mkulima',
    climateContext: '3. Dashibodi ya Hali ya Hewa ya NASA',
    rotationResults: '4. Mzunguko wa Mazao Uliopendekezwa',
    actionPlan: '5. Mpango Kazi na Kalenda',
    methodology: 'Mbinu Zilizotumika',
    aboutNasa: 'Kuhusu Data za NASA',
    demoRegions: 'Maeneo ya Mfano',
    fieldLocation: 'Mahali pa Shamba na Ramani',
    useMyLocation: 'Tumia GPS Yangu',
    drawingField: 'Gusa ramani kuweka alama ya shamba',
    fieldSize: 'Ukubwa wa Shamba',
    irrigation: 'Upatikanaji wa Maji ya Umwagiliaji',
    irrigationNone: 'Mvua Pekee (Bila Umwagiliaji)',
    irrigationLimited: 'Maji Kidogo ya Ziada',
    irrigationFull: 'Umwagiliaji Kamili',
    currentCrop: 'Zao la Sasa',
    cropHistory: 'Misimu 3 Iliyopita',
    soilProperties: 'Sifa za Udongo (ISRIC SoilGrids)',
    texture: 'Aina ya Udongo',
    organicCarbon: 'Kaboni Hai ya Udongo (SOC)',
    ph: 'Kiwango cha Asidi (pH)',
    waterHoldingCapacity: 'Uwezo wa Kushikilia Maji',
    overrideSoil: 'Badilisha Sifa za Udongo',
    saveSoil: 'Hifadhi',
    cancel: 'Ghairi',
    waterSavings: 'Uhifadhi na Uokoaji wa Maji',
    soilHealth: 'Afya na Rutuba ya Udongo',
    incomeStability: 'Uthabiti wa Mapato',
    droughtResilience: 'Kuhimili Ukame na Joto Kali',
    lowInputCost: 'Gharama Ndogo za Mbolea na Pembejeo',
    laborEase: 'Urahisi wa Kazi ya Shambani',
    scenarioBaseline: 'Hali ya Kawaida ya Sasa',
    scenarioHotter: 'Joto Kali Zaidi (+2°C)',
    scenarioDrier: 'Mvua Chache (-15%)',
    scenarioHotDry: 'Joto na Ukame (+2°C, -15%)',
    whyThisRotation: 'Kwa nini mzunguko huu?',
    compareRotations: 'Linganisha Sambamba',
    printExport: 'Chapisha / Pakua Mpango',
    seasonalCalendar: 'Kalenda ya Shughuli za Kilimo',
    nasaDataSource: 'Chanzo cha Data',
    liveNasa: 'Data za Moja kwa Moja za NASA na ISRIC',
    benchmarkNasa: 'Data za Marejeleo za NASA',
    offlineMode: 'Hali ya Nje ya Mtandao Inafanya Kazi',
    overallScore: 'Alama ya Ustahimilivu',
    topPick: 'Pendekezo Bora',
    somChange: 'Ongezeko la Rutuba ya Udongo',
    waterSaved: 'Maji Yaliyookolewa kwa Mwaka',
    nitrogenFixed: 'Nitrojeni ya Asili Iliyoongezwa',
    droughtShield: 'Kipimo cha Kuhimili Ukame',
  },
};
