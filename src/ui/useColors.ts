import { useColorScheme } from 'react-native';

import { dark, light, type Colors } from '@/theme';

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}
