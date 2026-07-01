import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export * from './button';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './image';
export * from './input';
export * from './modal';
export * from './progress-bar';
export * from './text';
export * from './modecard';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

cssInterop(Svg, { className: { target: 'style' } });
