/**
 * Константы для модуля лендинга
 */

export const FEATURES = [
  {
    id: "interactive",
    imagePath: "/images/features/interactive.png",
    titleKey: "features.interactive.title",
    descriptionKey: "features.interactive.description",
  },
  {
    id: "progress",
    imagePath: "/images/features/progress.png",
    titleKey: "features.progress.title",
    descriptionKey: "features.progress.description",
  },
  {
    id: "community",
    imagePath: "/images/features/community.png",
    titleKey: "features.community.title",
    descriptionKey: "features.community.description",
  },
  {
    id: "mobile",
    imagePath: "/images/features/mobile.png",
    titleKey: "features.mobile.title",
    descriptionKey: "features.mobile.description",
  },
] as const;

export const MEDAL_IMAGES = [
  "/images/medals/gold.png",
  "/images/medals/silver.png",
  "/images/medals/bronze.png",
  "/images/medals/fourth.png",
  "/images/medals/fifth.png",
] as const;

export const COURSES = [
  {
    id: "beginner",
    titleKey: "courses.beginner.title",
    descriptionKey: "courses.beginner.description",
    duration: "courses.beginner.duration",
    imagePath: "/images/courses/beginner.png",
  },
  {
    id: "intermediate",
    titleKey: "courses.intermediate.title",
    descriptionKey: "courses.intermediate.description",
    duration: "courses.intermediate.duration",
    imagePath: "/images/courses/intermediate.png",
  },
  {
    id: "advanced",
    titleKey: "courses.advanced.title",
    descriptionKey: "courses.advanced.description",
    duration: "courses.advanced.duration",
    imagePath: "/images/courses/advanced.png",
  },
  {
    id: "business",
    titleKey: "courses.business.title",
    descriptionKey: "courses.business.description",
    duration: "courses.business.duration",
    imagePath: "/images/courses/business.png",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    nameKey: "testimonials.1.name",
    textKey: "testimonials.1.text",
    roleKey: "testimonials.1.role",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Testimonial1",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    nameKey: "testimonials.2.name",
    textKey: "testimonials.2.text",
    roleKey: "testimonials.2.role",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Testimonial2",
    color: "from-pink-500/20 to-orange-500/20",
  },
  {
    id: 3,
    nameKey: "testimonials.3.name",
    textKey: "testimonials.3.text",
    roleKey: "testimonials.3.role",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Testimonial3",
    color: "from-green-500/20 to-cyan-500/20",
  },
] as const;

export const STATS = [
  {
    id: "students",
    valueKey: "stats.students.value",
    labelKey: "stats.students.label",
    imagePath: "/images/stats/students.png",
  },
  {
    id: "lessons",
    valueKey: "stats.lessons.value",
    labelKey: "stats.lessons.label",
    imagePath: "/images/stats/lessons.png",
  },
  {
    id: "teachers",
    valueKey: "stats.teachers.value",
    labelKey: "stats.teachers.label",
    imagePath: "/images/stats/teachers.png",
  },
  {
    id: "countries",
    valueKey: "stats.countries.value",
    labelKey: "stats.countries.label",
    imagePath: "/images/stats/countries.png",
  },
] as const;
