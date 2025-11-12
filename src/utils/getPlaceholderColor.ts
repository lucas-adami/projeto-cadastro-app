export function getPlaceholderColor({
  isDarkMode,
  suggestionEnabled,
  hasSuggestion,
}: {
  isDarkMode: boolean;
  suggestionEnabled: boolean;
  hasSuggestion: boolean;
}) {
  if (suggestionEnabled && hasSuggestion) return "#D32719";
  return isDarkMode ? "#aaa" : "#888";
}