import * as React from 'react'
import SVG, { Circle, Path, Rect } from 'react-native-svg'

const SearchSVG = ({ size = 27, color = '#000', theme }) => {
  return (
    <SVG width={size} height={size} viewBox="0 0 28 29" fill="none">
      <Rect y={0.931} width={9.5} height={9.5} rx={2} fill={color} />
      <Rect x={12.069} y={0.931} width={9.5} height={9.5} rx={2} fill={color} />
      <Rect x={12.069} y={13} width={9.5} height={9.5} rx={2} fill={color} />
      <Rect y={13} width={9.5} height={9.5} rx={2} fill={color} />
      <Circle
        cx={17}
        cy={17}
        r={8}
        fill={theme === 'dark' ? '#121212' : '#ffffff'}
      />
      <Path
        d="M16.84 22.542a5.608 5.608 0 003.263-1.042l3.271 3.27a.938.938 0 101.327-1.327l-3.27-3.27a5.634 5.634 0 10-4.591 2.369zm0-1.878a3.756 3.756 0 110-7.511 3.756 3.756 0 010 7.511z"
        fill={color}
      />
    </SVG>
  )
}

export default SearchSVG
