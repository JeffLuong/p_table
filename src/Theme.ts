import { DefaultTheme } from 'styled-components'

const LightTheme: DefaultTheme = {
  tableBg: '#ffffff',
  text: {
    title: '#b3bed5',
    body: '#191919'
  },
  cell: {
    bg: '#ffffff',
    accentBg: '#eeeeee',
    primaryHighlightBg: '#dddddd',
    secondaryHighlightBg: '#0c0c0c'
  }
};

const DarkTheme: DefaultTheme = {
  tableBg: '#191919',
  text: {
    title: '#ffffff',
    body: '#ffffff'
  },
  cell: {
    bg: '#191919',
    accentBg: '#0c0c0c',
    primaryHighlightBg: '#000000',
    secondaryHighlightBg: '#000000'
  }
};

export { LightTheme, DarkTheme };