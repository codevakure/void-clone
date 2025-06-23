# Extension Recommendations Configuration Guide

This guide explains how to configure extension recommendations in Void Editor. Extension recommendations help users discover useful extensions for their workflow by automatically suggesting them based on file types, settings, or other conditions.

## Overview

Extension recommendations in Void are configured through the `product.json` file in the following sections:

- `extensionRecommendations` - File-based and settings-based recommendations
- `configBasedExtensionTips` - Recommendations based on workspace/user settings
- `exeBasedExtensionTips` - Recommendations based on installed executables
- `webExtensionTips` - Extensions useful for web development
- `languageExtensionTips` - Language support extensions
- `keymapExtensionTips` - Alternative keyboard layouts/keybindings

## Important Notes

⚠️ **Extension Availability**: Since Void uses Open VSX Registry instead of Microsoft's VS Code Marketplace, make sure the extensions you recommend are available on [Open VSX](https://open-vsx.org/).

🔍 **Finding Extension IDs**: Visit https://open-vsx.org/, search for extensions, and use the format `publisher.extensionname` (e.g., `ms-python.python`).

## Configuration Types

### 1. Extension Recommendations (`extensionRecommendations`)

These recommendations appear when users open specific file types or meet other conditions.

#### Example Configuration:

```json
{
  "extensionRecommendations": {
    "ms-python.python": {
      "onFileOpen": [
        {
          "languages": ["python"],
          "important": true
        }
      ]
    },
    "bradlc.vscode-tailwindcss": {
      "onFileOpen": [
        {
          "pathGlob": "**/tailwind.config.{js,ts}",
          "important": false
        }
      ]
    },
    "ms-vscode.vscode-json": {
      "onFileOpen": [
        {
          "languages": ["json"],
          "contentPattern": "\"$schema\":",
          "important": false
        }
      ]
    },
    "ms-vscode.theme-tomorrow": {
      "onSettingsEditorOpen": {
        "prerelease": false,
        "descriptionOverride": "Enhance your coding experience with beautiful themes"
      }
    }
  }
}
```

#### Trigger Conditions:

- **`languages`**: Array of language IDs (e.g., `["python", "javascript"]`)
- **`pathGlob`**: File path pattern (e.g., `"**/package.json"`, `"**/*.dockerfile"`)
- **`contentPattern`**: Regex pattern to match file content
- **`important`**: Boolean - whether to show as "important" recommendation
- **`whenInstalled`**: Array of extension IDs that must be installed
- **`whenNotInstalled`**: Array of extension IDs that must NOT be installed

#### Common Language IDs:

```
javascript, typescript, python, java, csharp, cpp, c, go, rust, php,
html, css, scss, less, json, yaml, xml, markdown, sql, shellscript,
powershell, dockerfile, makefile, plaintext
```

### 2. Configuration-Based Extension Tips (`configBasedExtensionTips`)

These recommendations appear when users have specific settings configured.

#### Example Configuration:

```json
{
  "configBasedExtensionTips": {
    "ms-azuretools.vscode-docker": {
      "configPath": "docker",
      "recommendations": ["ms-azuretools.vscode-docker"],
      "important": true
    },
    "dbaeumer.vscode-eslint": {
      "configPath": "eslint",
      "recommendations": ["dbaeumer.vscode-eslint"],
      "important": false
    }
  }
}
```

#### Properties:

- **`configPath`**: Configuration setting path to detect
- **`recommendations`**: Array of extension IDs to recommend
- **`important`**: Boolean indicating recommendation priority

### 3. Executable-Based Extension Tips (`exeBasedExtensionTips`)

These recommendations appear when specific executables are detected on the system.

#### Example Configuration:

```json
{
  "exeBasedExtensionTips": {
    "ms-python.python": {
      "friendlyName": "Python",
      "windowsPath": "python.exe",
      "recommendations": ["ms-python.python"],
      "important": true
    },
    "ms-vscode.node-debug2": {
      "friendlyName": "Node.js",
      "windowsPath": "node.exe",
      "recommendations": ["ms-vscode.node-debug2"],
      "important": false
    }
  }
}
```

#### Properties:

- **`friendlyName`**: Display name for the executable
- **`windowsPath`**: Executable name for Windows (include .exe)
- **`recommendations`**: Array of extension IDs to recommend
- **`important`**: Boolean indicating recommendation priority

### 4. Simple Extension Tip Arrays

These are simple arrays of extension IDs for specific categories:

#### Web Extension Tips (`webExtensionTips`):

```json
{
  "webExtensionTips": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### Language Extension Tips (`languageExtensionTips`):

```json
{
  "languageExtensionTips": [
    "ms-python.python",
    "ms-vscode.cpptools",
    "golang.go",
    "rust-lang.rust-analyzer"
  ]
}
```

#### Keymap Extension Tips (`keymapExtensionTips`):

```json
{
  "keymapExtensionTips": [
    "vscodevim.vim",
    "lfs.vscode-emacs-friendly",
    "ms-vscode.sublime-keybindings"
  ]
}
```

## Best Practices

### 1. **Quality over Quantity**
- Only recommend high-quality, well-maintained extensions
- Focus on extensions that significantly improve the user experience

### 2. **Open VSX Availability**
- Always verify extensions are available on Open VSX before adding them
- Consider suggesting alternative extensions if popular ones aren't available

### 3. **User Experience**
- Use `important: true` sparingly - only for essential extensions
- Provide clear, helpful descriptions for recommendations

### 4. **Testing**
- Test recommendations with actual workflows
- Ensure recommendations appear at appropriate times

## Popular Extension Categories

### Development Languages
- **Python**: `ms-python.python`
- **JavaScript/TypeScript**: `ms-vscode.vscode-typescript-next`
- **C/C++**: `ms-vscode.cpptools`
- **Go**: `golang.go`
- **Rust**: `rust-lang.rust-analyzer`
- **Java**: `redhat.java`

### Web Development
- **Prettier**: `esbenp.prettier-vscode`
- **ESLint**: `dbaeumer.vscode-eslint`
- **Auto Rename Tag**: `formulahendry.auto-rename-tag`
- **Live Server**: `ritwickdey.liveserver`

### Productivity
- **GitLens**: `eamodio.gitlens`
- **Bracket Pair Colorizer**: `coenraads.bracket-pair-colorizer`
- **indent-rainbow**: `oderwat.indent-rainbow`

### Themes
- **One Dark Pro**: `zhuangtongfa.material-theme`
- **Dracula**: `dracula-theme.theme-dracula`
- **Material Icon Theme**: `pkief.material-icon-theme`

## Implementation Steps

1. **Edit `product.json`**: Add your extension recommendations to the appropriate sections
2. **Test locally**: Build and test Void with your recommendations
3. **Verify on Open VSX**: Ensure all recommended extensions are available
4. **Document**: Update this guide if you add new recommendation patterns

## Example: Adding Python Development Support

Here's a complete example of adding Python development recommendations:

```json
{
  "extensionRecommendations": {
    "ms-python.python": {
      "onFileOpen": [
        {
          "languages": ["python"],
          "important": true
        },
        {
          "pathGlob": "**/requirements.txt",
          "important": true
        },
        {
          "pathGlob": "**/setup.py",
          "important": true
        }
      ]
    }
  },
  "configBasedExtensionTips": {
    "ms-python.python": {
      "configPath": "python.defaultInterpreterPath",
      "recommendations": ["ms-python.python"],
      "important": true
    }
  },
  "exeBasedExtensionTips": {
    "ms-python.python": {
      "friendlyName": "Python",
      "windowsPath": "python.exe",
      "recommendations": ["ms-python.python"],
      "important": true
    }
  },
  "languageExtensionTips": [
    "ms-python.python"
  ]
}
```

This configuration will:
- Recommend Python extension when opening `.py` files
- Recommend when opening Python-related config files
- Recommend when Python interpreter path is configured
- Recommend when Python executable is detected
- Include in general language extension tips

## Troubleshooting

### Extensions Not Appearing
1. Check that extension IDs are correct and available on Open VSX
2. Verify JSON syntax in `product.json`
3. Ensure trigger conditions are being met
4. Check browser/VS Code developer tools for any errors

### Performance Issues
1. Avoid overly broad content patterns that require scanning large files
2. Limit the number of simultaneous recommendations
3. Use `important: false` for non-critical recommendations

## Migration from VS Code

If migrating recommendations from VS Code:
1. Check each extension's availability on Open VSX
2. Find alternative extensions for those not available
3. Update extension IDs as needed (publishers may differ)
4. Test all recommendations in Void

---

For more information about Void Editor development, see the main [VOID_CODEBASE_GUIDE.md](./VOID_CODEBASE_GUIDE.md).
