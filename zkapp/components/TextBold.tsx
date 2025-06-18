import { Text, TextProps } from 'react-native'

export const TextBold = (props: TextProps) => (
  <Text {...props} className={`${props.className || ''} font-bold text-white`} />
)