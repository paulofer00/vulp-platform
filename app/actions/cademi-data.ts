"use server";

import { getProgressoCurso } from "@/lib/cademi";

// Configuração APENAS do curso que existe
const COURSES_CONFIG = [
  { 
    id: "534401", // ID REAL DO PRINT
    title: "Marketing", 
    slug: "marketing" 
  }
];

export async function fetchStudentProgress(email: string) {
  if (!email) return [];

  const results = await Promise.all(
    COURSES_CONFIG.map(async (course) => {
      const data = await getProgressoCurso(email, course.id);
      
      // Só retorna se encontrar dados válidos (curso existe pro aluno)
      if (data) {
        return {
            ...course,
            percent: data.porcentagem,
            watched: data.assistidas,
            total: data.total_aulas
        };
      }
      return null;
    })
  );

  return results.filter((item) => item !== null);
}