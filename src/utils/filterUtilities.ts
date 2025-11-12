import { Professor } from "../types/professor";

export const groupByTitulacao = (professors: Professor[]) => {
    const counts: Record<string, number> = {};

    professors.forEach((p) => {
        counts[p.titulacao] = (counts[p.titulacao] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return { labels, data };
};
