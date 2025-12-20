# 构建脚本

此目录包含项目构建和维护相关的脚本。

## 📜 脚本说明

### `sync-assets.js`

**用途**: 在构建前将文档资源同步到 public 目录

**功能**:
- 将 `docs/` 目录下的所有文件复制到 `public/docs/`
- 确保静态资源在构建后可以访问
- 在 `npm run dev` 和 `npm run build` 时自动执行

**运行方式**:
```bash
node scripts/sync-assets.js
```

**配置**:
- `SOURCE_DIR`: 源目录 (`docs/`)
- `DEST_DIR`: 目标目录 (`public/docs/`)

**注意事项**:
- `public/` 目录在 `.gitignore` 中，不会被提交到版本控制
- 每次构建时都会重新同步，确保资源最新
- 如果源目录不存在，脚本会跳过同步并给出警告

## 🔧 扩展脚本

如需添加新的构建脚本，建议遵循以下规范：

1. **命名**: 使用 kebab-case (例: `build-helpers.js`)
2. **错误处理**: 包含适当的 try-catch 和错误信息
3. **日志输出**: 使用 console.log 输出进度信息
4. **文档**: 在本 README 中添加说明

### 示例脚本结构

```javascript
const fs = require('fs');
const path = require('path');

try {
    console.log('Starting process...');
    
    // 你的逻辑代码
    
    console.log('Process complete.');
} catch (error) {
    console.error('Process failed:', error);
    process.exit(1);
}
```

## 📝 package.json 集成

当前脚本已集成到 npm 命令中：

```json
{
  "scripts": {
    "dev": "node scripts/sync-assets.js && next dev --turbopack",
    "build": "node scripts/sync-assets.js && next build"
  }
}
```

## 🔍 调试

如遇到资源同步问题：

1. 检查 `docs/` 目录是否存在
2. 验证文件权限
3. 查看控制台输出的错误信息
4. 手动运行脚本测试: `node scripts/sync-assets.js`

## 📚 相关文档

- [项目文档](../docs/README.md)
- [贡献指南](../CONTRIBUTING.md)
