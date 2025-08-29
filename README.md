# VipMall - React TypeScript H5 Template

一个基于 React + TypeScript + Vite 构建的移动端H5模板项目。

## 项目特性

- ⚡️ **Vite** - 快速的构建工具
- 🏗️ **React 18** - 现代化的前端框架
- 🔷 **TypeScript** - 类型安全的JavaScript
- 🎨 **Tailwind CSS** - 实用的CSS框架
- 📱 **响应式设计** - 支持移动端
- 🌐 **多语言支持** - i18n国际化
- 🧪 **代码质量** - ESLint + Prettier + Stylelint
- 🔧 **Husky** - Git hooks自动化

## 开发环境

# Repo : http://git-app.haidilao.com/mall-global/vipmall
# Node -v20
# npm  -v10.1.0
```bash
# 安装依赖
npm install

# 启动开发服务器 (开发环境)
npm run dev

# 启动预发布环境
npm run pre

# 启动生产环境
npm run prod

# 构建项目
npm run build:dev    # 开发环境构建
npm run build:pre    # 预发布环境构建
npm run build:prod   # 生产环境构建

# 代码质量检查
npm run lint         # 运行所有lint检查
npm run lint:fix     # 自动修复ESLint问题
npm run lint:style   # 检查样式文件
npm run lint:prettier # 检查代码格式

# 预览构建结果
npm run serve 

生成打包文件到build目录下，并自动打开浏览器预览。

```

## CI/CD 配置

项目已配置 GitLab CI/CD，支持多环境自动化部署。

### 分支策略

- **`master`** → 生产环境部署 (手动触发)
- **`pre`** → 预发布环境部署
- **`dev`** → 开发环境部署

### 流水线阶段

1. **测试阶段**: 代码质量检查 (ESLint, Prettier, Stylelint)
2. **构建阶段**: 根据分支构建对应环境
3. **部署阶段**: 部署到对应环境

### 环境变量配置

在 GitLab CI/CD 设置中配置以下环境变量：

```bash
# 部署相关变量（根据实际部署方式配置）
DEPLOY_DEV_SERVER    # 开发环境服务器地址
DEPLOY_PRE_SERVER    # 预发布环境服务器地址  
DEPLOY_PROD_SERVER   # 生产环境服务器地址
DEPLOY_USER          # 部署用户名
DEPLOY_SSH_KEY       # SSH私钥（用于服务器部署）
```

### 部署配置

当前配置文件中的部署部分为示例，需要根据实际部署目标进行配置：

1. **服务器部署**: 配置SSH密钥和服务器信息
2. **云存储部署**: 配置云服务商访问密钥
3. **静态网站托管**: 配置对应的平台信息

## 项目结构

```
src/
├── components/     # 公共组件
├── pages/         # 页面组件
├── layout/        # 布局组件
├── hooks/         # 自定义Hooks
├── store/         # 状态管理
├── utils/         # 工具函数
├── locales/       # 国际化文件
└── assets/        # 静态资源
```

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS + Less
- **状态管理**: Zustand
- **路由**: React Router
- **HTTP客户端**: Axios
- **国际化**: i18next
- **代码质量**: ESLint + Prettier + Stylelint

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

ISC License
