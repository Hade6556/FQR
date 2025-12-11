export interface UserStats {
  freeHours: number;
  studiedHours: number;
  tasksToday: number;
  attendanceEnter: number;
  attendanceExit: number;
}

export interface GroupStats {
  avgStudyHours: number;
  avgAttendance: number;
}

// FOMO message templates - brutally honest Lithuanian motivation
const fomoTemplates = [
  (u: UserStats, g: GroupStats) =>
    `Grupė mokėsi ${g.avgStudyHours}h, tu tik ${u.studiedHours}h. Ką darai?`,
  (u: UserStats, g: GroupStats) =>
    `${u.freeHours}h laisvo laiko ir nieko nepadarei? Grupė tau nebelauks.`,
  (u: UserStats) =>
    `Visi dirba, o tu turi ${u.freeHours}h laisvo. Gėda.`,
  (u: UserStats, g: GroupStats) =>
    `${g.avgAttendance} vidutinis lankomumas, o tu? ${u.attendanceEnter}. Juokinga.`,
  (u: UserStats, g: GroupStats) =>
    `Kol tu tingi, grupė mokosi ${g.avgStudyHours}h. Pasiruošk būti paskutinis.`,
  (u: UserStats, g: GroupStats) =>
    `Tu: ${u.studiedHours}h. Grupė: ${g.avgStudyHours}h. Skaičiai neapgauna.`,
  (u: UserStats) =>
    `${u.freeHours} valandos laisvos. Knyga nedūlės pati.`,
  (u: UserStats, g: GroupStats) =>
    `Grupės vidurkis ${g.avgStudyHours}h mokymosi. Tu kur?`,
  (u: UserStats) =>
    `Tik ${u.attendanceEnter} lankymai šiandien? Ar tu rimtai?`,
  (u: UserStats, g: GroupStats) =>
    `Grupė turi ${g.avgAttendance} lankomumą. Tu ${u.attendanceEnter}. Wake up.`,
  (u: UserStats) =>
    `${u.freeHours}h laisvo ir vis dar nieko? Būk geresnis.`,
  (u: UserStats, g: GroupStats) =>
    `Jie mokosi ${g.avgStudyHours}h per dieną. Tu - ${u.studiedHours}h. Matai problemą?`,
  (u: UserStats) =>
    `Laisvo laiko pilna - ${u.freeHours}h. Rezultatų - nulis.`,
  (u: UserStats, g: GroupStats) =>
    `Vidutinis studentas mokosi ${g.avgStudyHours}h. Tu net to nepadarei.`,
  (u: UserStats) =>
    `${u.studiedHours}h mokymosi. Tikrai tiek užtenka? Aš netikiu.`,
];

export async function generateFomoMessage(
  userStats: UserStats,
  groupStats: GroupStats
): Promise<string> {
  // Try OpenAI if API key is available
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-openai-api-key") {
    try {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Sukurk vieną labai trumpą, kandų, brutaliai motyvuojantį FOMO pranešimą lietuviškai.

Naudok duomenis:
- Vartotojo laisvo laiko: ${userStats.freeHours}h
- Vartotojo mokymosi valandos: ${userStats.studiedHours}h
- Grupės vidurkis mokymosi: ${groupStats.avgStudyHours}h
- Vartotojo lankomumas: ${userStats.attendanceEnter} įėjimai
- Grupės vidutinis lankomumas: ${groupStats.avgAttendance}

Taisyklės:
- Turi būti kandus, spaudžiantis, demotyvuojantis komforto zoną
- Maksimalus ilgis: 20 žodžių
- 1-2 trumpi sakiniai
- Jokio mandagumo, jokio švelnumo
- Turi paspausti veikti DABAR
- Naudok konkrečius skaičius iš duomenų`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu esi brutalus, kandus, FOMO generuojantis asistentas. Tavo tikslas - išmušti studentą iš komforto zonos trumpais, aštriais pranešimais lietuvių kalba.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.9,
      });

      const aiMessage = response.choices[0]?.message?.content?.trim();
      if (aiMessage) return aiMessage;
    } catch (error) {
      console.error("OpenAI API error, using fallback:", error);
    }
  }

  // Fallback to templates
  const randomTemplate = fomoTemplates[Math.floor(Math.random() * fomoTemplates.length)];
  return randomTemplate(userStats, groupStats);
}
