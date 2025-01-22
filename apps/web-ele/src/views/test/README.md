## 快速创建文件夹（powershell）

```powershell
# 定义父目录
$BaseDir = "test"

# 如果父目录不存在，则创建
if (!(Test-Path $BaseDir)) {
    New-Item -ItemType Directory -Path $BaseDir
}

# 循环创建 test1 到 test10 文件夹
for ($i = 1; $i -le 10; $i++) {
    New-Item -ItemType Directory -Path "$BaseDir\test$i"
}

# 提示完成
Write-Host "文件夹 test1 到 test10 创建完成！"
```

### 说明：
1. **`$BaseDir`**：
   - 定义了基础目录名称为 `test`，可以根据需要调整为实际路径。
2. **`Test-Path` 和 `New-Item`**：
   - `Test-Path`：检查路径是否存在。
   - `New-Item`：创建目录。
3. **循环**：
   - `for ($i = 1; $i -le 10; $i++)`：表示从 1 循环到 10，每次递增 1。
4. **提示完成**：
   - `Write-Host` 输出完成信息。

### 使用方法：
1. 将代码保存为 `create_test_folders.ps1` 文件。
2. 打开 PowerShell 并运行以下命令以执行脚本：
   ```powershell
   .\create_test_folders.ps1
   ```
3. 脚本执行后，会在当前目录下生成如下结构：
   ```
   test/
   ├── test1/
   ├── test2/
   ├── test3/
   ├── test4/
   ├── test5/
   ├── test6/
   ├── test7/
   ├── test8/
   ├── test9/
   └── test10/
   ```
