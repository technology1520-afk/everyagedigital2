'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  forcedTheme,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isSeasonalHalloween, setIsSeasonalHalloween] = React.useState(forcedTheme === 'dark');

  React.useEffect(() => {
    const checkSeasonal = () => {
      const isHalloween = document.documentElement.getAttribute('data-seasonal') === 'halloween';
      if (isHalloween) {
        setIsSeasonalHalloween(true);
        if (!document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.add('dark');
        }
      } else if (!forcedTheme) {
        setIsSeasonalHalloween(false);
      }
    };

    checkSeasonal();

    const observer = new MutationObserver(checkSeasonal);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-seasonal', 'class']
    });

    return () => observer.disconnect();
  }, [forcedTheme]);

  const effectiveForcedTheme = forcedTheme || (isSeasonalHalloween ? 'dark' : undefined);

  return (
    <NextThemesProvider forcedTheme={effectiveForcedTheme} {...props}>
      {children}
    </NextThemesProvider>
  );
}
