import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const en: Dict = {
  "brand.tagline": "Student tools. Made simple.",
  "nav.home": "Home",
  "nav.mainTools": "Main Tools",
  "nav.moreTools": "More Tools",
  "nav.language": "Language",
  "nav.menu": "Menu",
  "section.mainTools": "Main Tools",
  "section.moreTools": "More Student Tools",
  "section.mainToolsDesc": "The two core grade tools.",
  "section.moreToolsDesc": "Handy extras for everyday studying.",
  "footer.credit": "© 2026 C4TOOLS — Created by Melad",
  "common.calculate": "Calculate",
  "common.reset": "Reset",
  "common.clearAll": "Clear All",
  "common.result": "Result",
  "common.back": "Back to all tools",
  "common.open": "Open",
  "common.add": "Add",
  "common.remove": "Remove",
  "common.start": "Start",
  "common.pause": "Pause",
  "common.total": "Total",
  "err.range0100": "Enter a number between 0 and 100.",
  "err.number": "Enter a valid number.",
  "err.weight": "Weight must be greater than 0 and at most 100.",
  "err.atLeastOne": "Add at least one valid entry.",
  "err.positive": "Enter a number greater than 0.",

  "tool.grade.name": "Grade Calculator",
  "tool.grade.desc": "Find out exactly what you need on your final exam.",
  "grade.current": "Current Grade",
  "grade.weight": "Final Exam Weight",
  "grade.desired": "Desired Final Grade",
  "grade.need": "You need {value}% on your final exam.",
  "grade.already": "You've already reached your target.",
  "grade.impossible": "This target isn't mathematically possible with this exam.",
  "grade.formula": "Required Exam Grade = (Target − Current × (1 − Weight)) ÷ Weight",

  "tool.average.name": "Grade Average Calculator",
  "tool.average.desc": "Add your subjects and get your overall average.",
  "average.subject": "Subject",
  "average.subjectName": "Subject name",
  "average.grade": "Grade",
  "average.addSubject": "Add Subject",
  "average.removeSubject": "Remove subject",
  "average.your": "Your Average: {value}%",
  "average.count": "{count} subjects counted",

  "tool.percentage.name": "Percentage Calculator",
  "tool.percentage.desc": "Percentages and percentage change.",
  "percentage.ofTitle": "What is X% of Y?",
  "percentage.percent": "Percentage",
  "percentage.value": "Value",
  "percentage.changeTitle": "Percentage change",
  "percentage.from": "From",
  "percentage.to": "To",
  "percentage.increase": "Increase of {value}%",
  "percentage.decrease": "Decrease of {value}%",
  "percentage.nochange": "No change",

  "tool.gpa.name": "GPA Calculator",
  "tool.gpa.desc": "Enter courses, grades and credits to get your GPA.",
  "gpa.course": "Course",
  "gpa.credits": "Credits",
  "gpa.points": "Grade points (0–4)",
  "gpa.addCourse": "Add Course",
  "gpa.your": "Your GPA: {value}",

  "tool.weighted.name": "Weighted Grade Calculator",
  "tool.weighted.desc": "Combine categories with different weights.",
  "weighted.category": "Category",
  "weighted.score": "Score",
  "weighted.weight": "Weight",
  "weighted.addCategory": "Add Category",
  "weighted.your": "Weighted grade: {value}%",
  "weighted.totalWeight": "Total weight: {value}%",

  "tool.target.name": "Target Grade Calculator",
  "tool.target.desc": "See the score you need on an upcoming assessment.",
  "target.assessmentWeight": "Assessment Weight",
  "target.need": "You need {value}% on this assessment.",

  "tool.whatif.name": "What-If Grade Calculator",
  "tool.whatif.desc": "Try hypothetical grades and see your new average.",
  "whatif.currentAverage": "Current average",
  "whatif.gradesSoFar": "Number of grades so far",
  "whatif.newGrade": "Hypothetical new grade",
  "whatif.result": "New average: {value}%",

  "tool.converter.name": "Grade Converter",
  "tool.converter.desc": "Turn a percentage into a letter grade.",
  "converter.percentage": "Percentage",
  "converter.letter": "Letter grade: {value}",
  "converter.scale": "Grading scale",

  "tool.studytimer.name": "Study Timer",
  "tool.studytimer.desc": "A simple countdown timer for focused study.",
  "timer.minutes": "Minutes",
  "timer.done": "Time's up!",

  "tool.pomodoro.name": "Pomodoro Timer",
  "tool.pomodoro.desc": "25 minutes of focus, 5 minutes of break.",
  "pomodoro.focus": "Focus",
  "pomodoro.break": "Break",
  "pomodoro.switch": "Switch mode",

  "tool.unit.name": "Unit Converter",
  "tool.unit.desc": "Common everyday conversions.",
  "unit.from": "From",
  "unit.to": "To",
  "unit.type": "Conversion",
  "unit.km_mi": "Kilometres ↔ Miles",
  "unit.kg_lb": "Kilograms ↔ Pounds",
  "unit.m_ft": "Metres ↔ Feet",
  "unit.c_f": "Celsius ↔ Fahrenheit",
  "unit.l_gal": "Litres ↔ Gallons",
  "unit.swap": "Swap direction",

  "tool.calculator.name": "Basic Calculator",
  "tool.calculator.desc": "A clean calculator for everyday arithmetic.",
};

const ar: Dict = {
  "brand.tagline": "أدوات للطلاب. ببساطة.",
  "nav.home": "الرئيسية",
  "nav.mainTools": "الأدوات الرئيسية",
  "nav.moreTools": "أدوات أخرى",
  "nav.language": "اللغة",
  "nav.menu": "القائمة",
  "section.mainTools": "الأدوات الرئيسية",
  "section.moreTools": "أدوات إضافية للطلاب",
  "section.mainToolsDesc": "أداتا الدرجات الأساسيتان.",
  "section.moreToolsDesc": "إضافات مفيدة للدراسة اليومية.",
  "footer.credit": "© 2026 C4TOOLS — من إنشاء ميلاد",
  "common.calculate": "احسب",
  "common.reset": "إعادة تعيين",
  "common.clearAll": "مسح الكل",
  "common.result": "النتيجة",
  "common.back": "العودة إلى كل الأدوات",
  "common.open": "فتح",
  "common.add": "إضافة",
  "common.remove": "حذف",
  "common.start": "ابدأ",
  "common.pause": "إيقاف مؤقت",
  "common.total": "المجموع",
  "err.range0100": "أدخل رقمًا بين 0 و100.",
  "err.number": "أدخل رقمًا صحيحًا.",
  "err.weight": "يجب أن يكون الوزن أكبر من 0 وحتى 100.",
  "err.atLeastOne": "أضف إدخالًا صالحًا واحدًا على الأقل.",
  "err.positive": "أدخل رقمًا أكبر من 0.",

  "tool.grade.name": "حاسبة الدرجات",
  "tool.grade.desc": "اعرف بالضبط ما تحتاجه في الامتحان النهائي.",
  "grade.current": "الدرجة الحالية",
  "grade.weight": "وزن الامتحان النهائي",
  "grade.desired": "الدرجة النهائية المطلوبة",
  "grade.need": "تحتاج إلى {value}% في امتحانك النهائي.",
  "grade.already": "لقد حققت هدفك بالفعل.",
  "grade.impossible": "هذا الهدف غير ممكن رياضيًا بهذا الامتحان.",
  "grade.formula": "الدرجة المطلوبة = (الهدف − الحالية × (1 − الوزن)) ÷ الوزن",

  "tool.average.name": "حاسبة معدل الدرجات",
  "tool.average.desc": "أضف موادك واحصل على معدلك العام.",
  "average.subject": "المادة",
  "average.subjectName": "اسم المادة",
  "average.grade": "الدرجة",
  "average.addSubject": "إضافة مادة",
  "average.removeSubject": "حذف المادة",
  "average.your": "معدلك: {value}%",
  "average.count": "تم احتساب {count} مواد",

  "tool.percentage.name": "حاسبة النسبة المئوية",
  "tool.percentage.desc": "النسب المئوية ونسبة التغيير.",
  "percentage.ofTitle": "كم يساوي X% من Y؟",
  "percentage.percent": "النسبة المئوية",
  "percentage.value": "القيمة",
  "percentage.changeTitle": "نسبة التغيير",
  "percentage.from": "من",
  "percentage.to": "إلى",
  "percentage.increase": "زيادة بنسبة {value}%",
  "percentage.decrease": "انخفاض بنسبة {value}%",
  "percentage.nochange": "لا يوجد تغيير",

  "tool.gpa.name": "حاسبة المعدل التراكمي",
  "tool.gpa.desc": "أدخل المواد والدرجات والساعات لحساب معدلك.",
  "gpa.course": "المقرر",
  "gpa.credits": "الساعات",
  "gpa.points": "نقاط الدرجة (0–4)",
  "gpa.addCourse": "إضافة مقرر",
  "gpa.your": "معدلك التراكمي: {value}",

  "tool.weighted.name": "حاسبة الدرجات الموزونة",
  "tool.weighted.desc": "ادمج فئات بأوزان مختلفة.",
  "weighted.category": "الفئة",
  "weighted.score": "الدرجة",
  "weighted.weight": "الوزن",
  "weighted.addCategory": "إضافة فئة",
  "weighted.your": "الدرجة الموزونة: {value}%",
  "weighted.totalWeight": "مجموع الأوزان: {value}%",

  "tool.target.name": "حاسبة الدرجة المستهدفة",
  "tool.target.desc": "اعرف الدرجة التي تحتاجها في التقييم القادم.",
  "target.assessmentWeight": "وزن التقييم",
  "target.need": "تحتاج إلى {value}% في هذا التقييم.",

  "tool.whatif.name": "حاسبة ماذا لو",
  "tool.whatif.desc": "جرّب درجات افتراضية وشاهد معدلك الجديد.",
  "whatif.currentAverage": "المعدل الحالي",
  "whatif.gradesSoFar": "عدد الدرجات حتى الآن",
  "whatif.newGrade": "الدرجة الافتراضية الجديدة",
  "whatif.result": "المعدل الجديد: {value}%",

  "tool.converter.name": "محوّل الدرجات",
  "tool.converter.desc": "حوّل النسبة المئوية إلى تقدير بالحروف.",
  "converter.percentage": "النسبة المئوية",
  "converter.letter": "التقدير: {value}",
  "converter.scale": "سلم الدرجات",

  "tool.studytimer.name": "مؤقت الدراسة",
  "tool.studytimer.desc": "مؤقت تنازلي بسيط للتركيز.",
  "timer.minutes": "الدقائق",
  "timer.done": "انتهى الوقت!",

  "tool.pomodoro.name": "مؤقت بومودورو",
  "tool.pomodoro.desc": "25 دقيقة تركيز و5 دقائق راحة.",
  "pomodoro.focus": "تركيز",
  "pomodoro.break": "راحة",
  "pomodoro.switch": "تغيير الوضع",

  "tool.unit.name": "محوّل الوحدات",
  "tool.unit.desc": "تحويلات يومية شائعة.",
  "unit.from": "من",
  "unit.to": "إلى",
  "unit.type": "نوع التحويل",
  "unit.km_mi": "كيلومتر ↔ ميل",
  "unit.kg_lb": "كيلوغرام ↔ رطل",
  "unit.m_ft": "متر ↔ قدم",
  "unit.c_f": "مئوية ↔ فهرنهايت",
  "unit.l_gal": "لتر ↔ غالون",
  "unit.swap": "عكس الاتجاه",

  "tool.calculator.name": "الآلة الحاسبة",
  "tool.calculator.desc": "آلة حاسبة بسيطة للعمليات اليومية.",
};

const fr: Dict = {
  "brand.tagline": "Des outils pour étudiants. En toute simplicité.",
  "nav.home": "Accueil",
  "nav.mainTools": "Outils principaux",
  "nav.moreTools": "Autres outils",
  "nav.language": "Langue",
  "nav.menu": "Menu",
  "section.mainTools": "Outils principaux",
  "section.moreTools": "Autres outils pour étudiants",
  "section.mainToolsDesc": "Les deux outils de notes essentiels.",
  "section.moreToolsDesc": "Des extras pratiques pour réviser au quotidien.",
  "footer.credit": "© 2026 C4TOOLS — Créé par Melad",
  "common.calculate": "Calculer",
  "common.reset": "Réinitialiser",
  "common.clearAll": "Tout effacer",
  "common.result": "Résultat",
  "common.back": "Retour aux outils",
  "common.open": "Ouvrir",
  "common.add": "Ajouter",
  "common.remove": "Supprimer",
  "common.start": "Démarrer",
  "common.pause": "Pause",
  "common.total": "Total",
  "err.range0100": "Entrez un nombre entre 0 et 100.",
  "err.number": "Entrez un nombre valide.",
  "err.weight": "Le coefficient doit être supérieur à 0 et au maximum 100.",
  "err.atLeastOne": "Ajoutez au moins une entrée valide.",
  "err.positive": "Entrez un nombre supérieur à 0.",

  "tool.grade.name": "Calculateur de note",
  "tool.grade.desc": "Découvrez la note nécessaire à l'examen final.",
  "grade.current": "Note actuelle",
  "grade.weight": "Coefficient de l'examen final",
  "grade.desired": "Note finale souhaitée",
  "grade.need": "Il vous faut {value}% à l'examen final.",
  "grade.already": "Vous avez déjà atteint votre objectif.",
  "grade.impossible": "Cet objectif est mathématiquement impossible avec cet examen.",
  "grade.formula": "Note requise = (Objectif − Actuelle × (1 − Coefficient)) ÷ Coefficient",

  "tool.average.name": "Calculateur de moyenne",
  "tool.average.desc": "Ajoutez vos matières et obtenez votre moyenne.",
  "average.subject": "Matière",
  "average.subjectName": "Nom de la matière",
  "average.grade": "Note",
  "average.addSubject": "Ajouter une matière",
  "average.removeSubject": "Supprimer la matière",
  "average.your": "Votre moyenne : {value}%",
  "average.count": "{count} matières comptées",

  "tool.percentage.name": "Calculateur de pourcentage",
  "tool.percentage.desc": "Pourcentages et variations.",
  "percentage.ofTitle": "Combien font X% de Y ?",
  "percentage.percent": "Pourcentage",
  "percentage.value": "Valeur",
  "percentage.changeTitle": "Variation en pourcentage",
  "percentage.from": "De",
  "percentage.to": "À",
  "percentage.increase": "Hausse de {value}%",
  "percentage.decrease": "Baisse de {value}%",
  "percentage.nochange": "Aucun changement",

  "tool.gpa.name": "Calculateur de GPA",
  "tool.gpa.desc": "Saisissez cours, notes et crédits pour votre GPA.",
  "gpa.course": "Cours",
  "gpa.credits": "Crédits",
  "gpa.points": "Points (0–4)",
  "gpa.addCourse": "Ajouter un cours",
  "gpa.your": "Votre GPA : {value}",

  "tool.weighted.name": "Calculateur de note pondérée",
  "tool.weighted.desc": "Combinez des catégories de coefficients différents.",
  "weighted.category": "Catégorie",
  "weighted.score": "Note",
  "weighted.weight": "Coefficient",
  "weighted.addCategory": "Ajouter une catégorie",
  "weighted.your": "Note pondérée : {value}%",
  "weighted.totalWeight": "Coefficient total : {value}%",

  "tool.target.name": "Calculateur de note cible",
  "tool.target.desc": "La note nécessaire à votre prochaine évaluation.",
  "target.assessmentWeight": "Coefficient de l'évaluation",
  "target.need": "Il vous faut {value}% à cette évaluation.",

  "tool.whatif.name": "Simulateur de notes",
  "tool.whatif.desc": "Testez des notes hypothétiques et votre nouvelle moyenne.",
  "whatif.currentAverage": "Moyenne actuelle",
  "whatif.gradesSoFar": "Nombre de notes actuelles",
  "whatif.newGrade": "Nouvelle note hypothétique",
  "whatif.result": "Nouvelle moyenne : {value}%",

  "tool.converter.name": "Convertisseur de notes",
  "tool.converter.desc": "Convertissez un pourcentage en lettre.",
  "converter.percentage": "Pourcentage",
  "converter.letter": "Note en lettre : {value}",
  "converter.scale": "Barème",

  "tool.studytimer.name": "Minuteur d'étude",
  "tool.studytimer.desc": "Un simple compte à rebours pour se concentrer.",
  "timer.minutes": "Minutes",
  "timer.done": "Temps écoulé !",

  "tool.pomodoro.name": "Minuteur Pomodoro",
  "tool.pomodoro.desc": "25 minutes de concentration, 5 minutes de pause.",
  "pomodoro.focus": "Concentration",
  "pomodoro.break": "Pause",
  "pomodoro.switch": "Changer de mode",

  "tool.unit.name": "Convertisseur d'unités",
  "tool.unit.desc": "Conversions courantes du quotidien.",
  "unit.from": "De",
  "unit.to": "Vers",
  "unit.type": "Conversion",
  "unit.km_mi": "Kilomètres ↔ Miles",
  "unit.kg_lb": "Kilogrammes ↔ Livres",
  "unit.m_ft": "Mètres ↔ Pieds",
  "unit.c_f": "Celsius ↔ Fahrenheit",
  "unit.l_gal": "Litres ↔ Gallons",
  "unit.swap": "Inverser le sens",

  "tool.calculator.name": "Calculatrice",
  "tool.calculator.desc": "Une calculatrice simple pour le quotidien.",
};

const es: Dict = {
  "brand.tagline": "Herramientas para estudiantes. Así de simple.",
  "nav.home": "Inicio",
  "nav.mainTools": "Herramientas principales",
  "nav.moreTools": "Más herramientas",
  "nav.language": "Idioma",
  "nav.menu": "Menú",
  "section.mainTools": "Herramientas principales",
  "section.moreTools": "Más herramientas para estudiantes",
  "section.mainToolsDesc": "Las dos herramientas de notas esenciales.",
  "section.moreToolsDesc": "Extras prácticos para el día a día.",
  "footer.credit": "© 2026 C4TOOLS — Creado por Melad",
  "common.calculate": "Calcular",
  "common.reset": "Reiniciar",
  "common.clearAll": "Borrar todo",
  "common.result": "Resultado",
  "common.back": "Volver a las herramientas",
  "common.open": "Abrir",
  "common.add": "Añadir",
  "common.remove": "Eliminar",
  "common.start": "Iniciar",
  "common.pause": "Pausar",
  "common.total": "Total",
  "err.range0100": "Introduce un número entre 0 y 100.",
  "err.number": "Introduce un número válido.",
  "err.weight": "El peso debe ser mayor que 0 y como máximo 100.",
  "err.atLeastOne": "Añade al menos una entrada válida.",
  "err.positive": "Introduce un número mayor que 0.",

  "tool.grade.name": "Calculadora de notas",
  "tool.grade.desc": "Descubre qué necesitas en tu examen final.",
  "grade.current": "Nota actual",
  "grade.weight": "Peso del examen final",
  "grade.desired": "Nota final deseada",
  "grade.need": "Necesitas un {value}% en tu examen final.",
  "grade.already": "Ya has alcanzado tu objetivo.",
  "grade.impossible": "Este objetivo no es matemáticamente posible con este examen.",
  "grade.formula": "Nota necesaria = (Objetivo − Actual × (1 − Peso)) ÷ Peso",

  "tool.average.name": "Calculadora de promedio",
  "tool.average.desc": "Añade tus asignaturas y obtén tu promedio.",
  "average.subject": "Asignatura",
  "average.subjectName": "Nombre de la asignatura",
  "average.grade": "Nota",
  "average.addSubject": "Añadir asignatura",
  "average.removeSubject": "Eliminar asignatura",
  "average.your": "Tu promedio: {value}%",
  "average.count": "{count} asignaturas contadas",

  "tool.percentage.name": "Calculadora de porcentajes",
  "tool.percentage.desc": "Porcentajes y variación porcentual.",
  "percentage.ofTitle": "¿Cuánto es X% de Y?",
  "percentage.percent": "Porcentaje",
  "percentage.value": "Valor",
  "percentage.changeTitle": "Variación porcentual",
  "percentage.from": "Desde",
  "percentage.to": "Hasta",
  "percentage.increase": "Aumento del {value}%",
  "percentage.decrease": "Disminución del {value}%",
  "percentage.nochange": "Sin cambios",

  "tool.gpa.name": "Calculadora de GPA",
  "tool.gpa.desc": "Introduce cursos, notas y créditos para tu GPA.",
  "gpa.course": "Curso",
  "gpa.credits": "Créditos",
  "gpa.points": "Puntos (0–4)",
  "gpa.addCourse": "Añadir curso",
  "gpa.your": "Tu GPA: {value}",

  "tool.weighted.name": "Calculadora de nota ponderada",
  "tool.weighted.desc": "Combina categorías con distintos pesos.",
  "weighted.category": "Categoría",
  "weighted.score": "Nota",
  "weighted.weight": "Peso",
  "weighted.addCategory": "Añadir categoría",
  "weighted.your": "Nota ponderada: {value}%",
  "weighted.totalWeight": "Peso total: {value}%",

  "tool.target.name": "Calculadora de nota objetivo",
  "tool.target.desc": "La nota que necesitas en tu próxima evaluación.",
  "target.assessmentWeight": "Peso de la evaluación",
  "target.need": "Necesitas un {value}% en esta evaluación.",

  "tool.whatif.name": "Calculadora de hipótesis",
  "tool.whatif.desc": "Prueba notas hipotéticas y mira tu nuevo promedio.",
  "whatif.currentAverage": "Promedio actual",
  "whatif.gradesSoFar": "Número de notas hasta ahora",
  "whatif.newGrade": "Nueva nota hipotética",
  "whatif.result": "Nuevo promedio: {value}%",

  "tool.converter.name": "Conversor de notas",
  "tool.converter.desc": "Convierte un porcentaje en nota con letra.",
  "converter.percentage": "Porcentaje",
  "converter.letter": "Nota con letra: {value}",
  "converter.scale": "Escala de calificación",

  "tool.studytimer.name": "Temporizador de estudio",
  "tool.studytimer.desc": "Una cuenta atrás sencilla para concentrarte.",
  "timer.minutes": "Minutos",
  "timer.done": "¡Se acabó el tiempo!",

  "tool.pomodoro.name": "Temporizador Pomodoro",
  "tool.pomodoro.desc": "25 minutos de foco y 5 de descanso.",
  "pomodoro.focus": "Concentración",
  "pomodoro.break": "Descanso",
  "pomodoro.switch": "Cambiar modo",

  "tool.unit.name": "Conversor de unidades",
  "tool.unit.desc": "Conversiones cotidianas habituales.",
  "unit.from": "De",
  "unit.to": "A",
  "unit.type": "Conversión",
  "unit.km_mi": "Kilómetros ↔ Millas",
  "unit.kg_lb": "Kilogramos ↔ Libras",
  "unit.m_ft": "Metros ↔ Pies",
  "unit.c_f": "Celsius ↔ Fahrenheit",
  "unit.l_gal": "Litros ↔ Galones",
  "unit.swap": "Invertir dirección",

  "tool.calculator.name": "Calculadora básica",
  "tool.calculator.desc": "Una calculadora limpia para aritmética diaria.",
};

const DICTS: Record<LanguageCode, Dict> = { en, ar, fr, es };

const STORAGE_KEY = "c4tools.lang";

interface I18nValue {
  lang: LanguageCode;
  dir: "ltr" | "rtl";
  setLang: (lang: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const template = DICTS[lang][key] ?? en[key] ?? key;
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (_, name: string) =>
        String(vars[name] ?? `{${name}}`)
      );
    },
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
