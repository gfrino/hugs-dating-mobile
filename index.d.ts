declare module 'dopenative' {
  export function useTheme(): {
    theme: any
    appearance: 'light' | 'dark'
  }
  export function useTranslations(): { localized: (text: string) => string }
}
