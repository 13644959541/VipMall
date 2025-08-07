import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';


const px2rem = pxtorem({
  rootValue: 75,
  unitPrecision: 5,
  propList: ['*', '!font*'],
  mediaQuery: true,
  exclude: /node_modules|\.(jsx?|tsx?)$/,
});


export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    px2rem,
  ],
};
