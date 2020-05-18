import theme from 'styled-theming';

const backgroundColor =  theme('mode', {
    light: '#fafafa',
    dark: '#1a213c'
});

const foregroundColor = theme('mode', {
    light: '#111',
    dark: '#fafafa'
});

const primaryColor = theme('mode', {
    light: '#7f98ff',
    dark: '#5172ff'
});

const primaryDarkColor = theme('mode', {
    light: '#5b79fb',
    dark: '#5b79fb'
});


const appTheme = {
    color: {
        backgroundColor,
        primaryColor,
        foregroundColor,
        primaryDarkColor
    }
}
export default appTheme