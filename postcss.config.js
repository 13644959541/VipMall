import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';


const px2rem = pxtorem({
  rootValue: 75, // 保持手机端基准
  unitPrecision: 5,
  propList: ['*', '!font*'], // 排除字体大小
  mediaQuery: true, // 启用媒体查询转换
  exclude: /node_modules/,
});


export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    px2rem,
  ],
};
