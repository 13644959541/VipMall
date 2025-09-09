# 部署配置示例

这里提供几种常见的部署方式配置示例，您可以根据实际需求选择并修改 `.gitlab-ci.yml` 文件。

## 1. SSH 服务器部署

### 配置 GitLab CI 变量
在 GitLab CI/CD 设置中添加：
- `DEPLOY_SERVER_DEV` - 开发环境服务器地址
- `DEPLOY_SERVER_PRE` - 预发布环境服务器地址  
- `DEPLOY_SERVER_PROD` - 生产环境服务器地址
- `DEPLOY_USER` - 服务器用户名
- `DEPLOY_SSH_PRIVATE_KEY` - SSH 私钥

### 修改部署作业
```yaml
deploy:dev:
  stage: deploy
  before_script:
    - mkdir -p ~/.ssh
    - echo "$DEPLOY_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $DEPLOY_SERVER_DEV >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete build/ $DEPLOY_USER@$DEPLOY_SERVER_DEV:/path/to/www/
  environment:
    name: development
    url: https://dev.example.com
  only:
    - dev

# 类似的配置 pre 和 prod 环境
```

## 2. AWS S3 部署

### 配置 GitLab CI 变量
- `AWS_ACCESS_KEY_ID` - AWS访问密钥ID
- `AWS_SECRET_ACCESS_KEY` - AWS秘密访问密钥
- `AWS_REGION` - AWS区域
- `S3_BUCKET_DEV` - 开发环境S3桶名
- `S3_BUCKET_PRE` - 预发布环境S3桶名
- `S3_BUCKET_PROD` - 生产环境S3桶名

### 修改部署作业
```yaml
deploy:dev:
  stage: deploy
  script:
    - npm install -g aws-cli
    - aws s3 sync build/ s3://$S3_BUCKET_DEV/ --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
  environment:
    name: development
    url: https://dev.example.com
  only:
    - dev
```

## 3. 阿里云 OSS 部署

### 配置 GitLab CI 变量
- `ALI_ACCESS_KEY_ID` - 阿里云访问密钥ID
- `ALI_ACCESS_KEY_SECRET` - 阿里云访问密钥Secret
- `OSS_BUCKET_DEV` - 开发环境OSS桶名
- `OSS_BUCKET_PRE` - 预发布环境OSS桶名  
- `OSS_BUCKET_PROD` - 生产环境OSS桶名

### 修改部署作业
```yaml
deploy:dev:
  stage: deploy
  script:
    - npm install -g ossutil
    - ossutil config -e oss-cn-hangzhou.aliyuncs.com -i $ALI_ACCESS_KEY_ID -k $ALI_ACCESS_KEY_SECRET
    - ossutil cp -r build/ oss://$OSS_BUCKET_DEV/ --update
  environment:
    name: development
    url: https://dev.example.com
  only:
    - dev
```

## 4. Docker 容器部署

### 创建 Dockerfile
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 修改部署作业
```yaml
deploy:dev:
  stage: deploy
  script:
    - docker build -t vipmall-app:dev .
    - docker tag vipmall-app:dev registry.example.com/vipmall-app:dev
    - docker push registry.example.com/vipmall-app:dev
    - ssh $DEPLOY_USER@$DEPLOY_SERVER_DEV "docker pull registry.example.com/vipmall-app:dev && docker-compose up -d"
  environment:
    name: development
    url: https://dev.example.com
  only:
    - dev
```

## 5. GitLab Pages 部署

### 修改构建配置
```yaml
build:dev:
  stage: build
  script:
    - *before_script
    - npm run build:dev
    - echo "Deploying to GitLab Pages"
  artifacts:
    paths:
      - build/
    expire_in: 1 week
  environment:
    name: development
    url: https://$CI_PROJECT_NAMESPACE.gitlab.io/$CI_PROJECT_NAME
  only:
    - dev
```

## 环境变量管理建议

### 开发环境 (.env.dev)
```
VITE_HTTP_API=https://dev-api.example.com
VITE_PORT=3000
```

### 预发布环境 (.env.pre)  
```
VITE_HTTP_API=https://pre-api.example.com
VITE_PORT=3001
```

### 生产环境 (.env.prod)
```
VITE_HTTP_API=https://api.example.com
VITE_PORT=3002
```

