import { useApp } from "../context/AppContext";

/**
 * Returns a theme object with colour tokens based on dark/light mode.
 * Import this hook in any component that needs styling tokens.
 */
export function useTheme() {
  const { dark } = useApp();
  return {
    bg:     dark ? "#09090b" : "#f4f4f5",
    card:   dark ? "#18181b" : "#ffffff",
    border: dark ? "#27272a" : "#e4e4e7",
    text:   dark ? "#fafafa" : "#18181b",
    muted:  dark ? "#a1a1aa" : "#71717a",
    hover:  dark ? "#27272a" : "#f4f4f5",
    input:  dark ? "#27272a" : "#f4f4f5",
    inset:  dark ? "#1c1917" : "#fffbeb",
    dark,
  };
}
