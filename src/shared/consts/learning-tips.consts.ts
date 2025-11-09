/**
 * Советы по изучению казахского языка на разных языках
 */

export type LanguageCode = "ru" | "en" | "kk";

export interface LearningTips {
  ru: string[];
  en: string[];
  kk: string[];
}

/**
 * Массив советов по изучению казахского языка
 */
export const learningTips: LearningTips = {
  ru: [
    "Практикуйте казахский язык каждый день хотя бы по 10 минут",
    "Используйте карточки для запоминания новых слов",
    "Слушайте казахскую музыку и подкасты для улучшения восприятия на слух",
    "Общайтесь с носителями языка в чате с ИИ",
    "Читайте простые тексты на казахском языке ежедневно",
    "Записывайте новые слова в словарь и повторяйте их регулярно",
    "Смотрите казахские фильмы с субтитрами",
    "Практикуйте произношение вслух каждый день",
    "Изучайте грамматику постепенно, не пытайтесь выучить все сразу",
    "Используйте приложение для изучения языка регулярно",
    "Создавайте ассоциации для запоминания сложных слов",
    "Практикуйте диалоги на казахском языке",
    "Изучайте казахскую культуру вместе с языком",
    "Используйте мнемотехники для запоминания",
    "Повторяйте пройденный материал перед изучением нового",
    "Учите по 5-10 новых слов каждый день",
    "Практикуйте письмо на казахском языке",
    "Используйте грамматические упражнения для закрепления знаний",
    "Слушайте казахское радио онлайн",
    "Общайтесь с друзьями на казахском языке",
  ],
  en: [
    "Practice Kazakh every day for at least 10 minutes",
    "Use flashcards to memorize new words",
    "Listen to Kazakh music and podcasts to improve listening skills",
    "Chat with native speakers using AI chat",
    "Read simple texts in Kazakh daily",
    "Write down new words in a dictionary and review them regularly",
    "Watch Kazakh movies with subtitles",
    "Practice pronunciation out loud every day",
    "Learn grammar gradually, don't try to learn everything at once",
    "Use the language learning app regularly",
    "Create associations to remember complex words",
    "Practice dialogues in Kazakh",
    "Learn Kazakh culture along with the language",
    "Use mnemonics for memorization",
    "Review previous material before learning new",
    "Learn 5-10 new words every day",
    "Practice writing in Kazakh",
    "Use grammar exercises to reinforce knowledge",
    "Listen to Kazakh radio online",
    "Chat with friends in Kazakh",
  ],
  kk: [
    "Қазақ тілін күн сайын кемінде 10 минут бойы жаттықтырыңыз",
    "Жаңа сөздерді жаттау үшін карточкаларды пайдаланыңыз",
    "Есту дағдысын жақсарту үшін қазақ музыкасы мен подкастарды тыңдаңыз",
    "ЖИ-мен чат арқылы тілдің тұқымдас нұсқасымен сөйлесіңіз",
    "Қазақ тіліндегі қарапайым мәтіндерді күн сайын оқыңыз",
    "Жаңа сөздерді сөздікке жазып, оларды үнемі қайталаңыз",
    "Қазақ фильмдерін субтитрмен көріңіз",
    "Күн сайын дауыстап айтып, айтылуды жаттықтырыңыз",
    "Грамматиканы біртіндеп үйреніңіз, бәрін бірден үйренуге тырыспаңыз",
    "Тіл үйрену қосымшасын үнемі пайдаланыңыз",
    "Күрделі сөздерді жаттау үшін ассоциациялар құрыңыз",
    "Қазақ тілінде диалогтарды жаттықтырыңыз",
    "Тілмен бірге қазақ мәдениетін үйреніңіз",
    "Жаттау үшін мнемоникалық әдістерді пайдаланыңыз",
    "Жаңа материалды үйрену алдында өткен материалды қайталаңыз",
    "Күн сайын 5-10 жаңа сөз үйреніңіз",
    "Қазақ тілінде жазуды жаттықтырыңыз",
    "Білімді бекіту үшін грамматикалық жаттығуларды пайдаланыңыз",
    "Қазақ радиосын онлайн тыңдаңыз",
    "Достармен қазақ тілінде сөйлесіңіз",
  ],
};

/**
 * Получить случайный совет на указанном языке
 *
 * @param language - Код языка (ru, en, kk)
 * @returns Случайный совет на указанном языке
 */
export const getRandomTip = (language: LanguageCode): string => {
  const tips = learningTips[language] || learningTips.ru;
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

