<div align="center">

# Web File Launcher

**Connect the websites you visit to the files you use.**

Open a local application, document, or folder automatically when you visit a configured website.

![Windows](https://img.shields.io/badge/platform-Windows-0078D4)
![Chrome](https://img.shields.io/badge/browser-Chrome-4285F4)
![Edge](https://img.shields.io/badge/browser-Edge-0078D7)
![Version](https://img.shields.io/badge/extension-v2.3.0-16694F)

[Getting started](#getting-started) · [Usage](#usage) · [Troubleshooting](#troubleshooting) · [Report an issue](https://github.com/Qu4nh/Web-File-Launcher/issues)

Created by [qu4nh](https://github.com/Qu4nh).

</div>

## Overview

Web File Launcher pairs a website with something on your Windows PC. For example, opening a project dashboard can launch your desktop tool, a reference document, or the project's local folder.

Manage everything from a compact toolbar popup. There is no separate settings tab and no cloud service to configure.

The project consists of a browser extension and a Windows **native host**. The native host is required because browser extensions cannot directly launch arbitrary local programs.

> **Distribution status:** this package includes an unsigned native host. Windows Smart App Control or organizational policies may prevent it from running. The installer does not disable these protections. This is not a signed, store-distributed release. No package can guarantee execution on every managed or security-restricted PC; see [Microsoft’s Smart App Control documentation](https://learn.microsoft.com/en-us/windows/apps/develop/smart-app-control/overview).

## Features

- Map websites to local applications, documents, or folders.
- Add, enable, disable, remove, and test rules in a **400 × 560 px popup**.
- Switch between **English (default)** and **Vietnamese** without reopening the popup.
- Select targets using the Windows file or folder picker.
- Use the current website without typing its address.
- Optionally avoid launching an executable that is already running from the same path.
- Apply a **15-second cooldown** per rule to reduce repeated launches.
- Review the latest **30 automatic launch events**, stored locally.
- Register the native host for **Chrome and Edge** with one setup step.

## Requirements

| Component | Requirement |
| --- | --- |
| Operating system | Windows 10 or 11 |
| Browser | Google Chrome or Microsoft Edge, with unpacked extensions allowed |
| Runtime | .NET Framework 4.6 or later |
| Local target | An existing file, application, or folder accessible to your Windows account |

Documents require an associated application. Executables may have their own dependencies. The native host currently supports Windows only. The popup defaults to English. Use the language selector in its footer to switch between **English** and **Tiếng Việt**. Your choice is saved per browser profile.

## Getting started

### 1. Download

[Download the latest source-tree ZIP](https://github.com/Qu4nh/Web-File-Launcher/archive/refs/heads/main.zip), then extract the entire archive to a location where you want to keep the browser extension.

The extracted directory should contain:

```text
Web-File-Launcher/
├── extension/                     Browser extension
├── native-host/
│   └── WebFileLauncher.Host.exe    Native host with built-in installation
├── install.cmd                    Setup launcher with error logging
└── README.md
```

Do not run setup inside the ZIP. Keep the `extension` directory in place after loading it into your browser. The native host is installed separately into LocalAppData.

### 2. Register the native host

Double-click **`install.cmd`** in the extracted directory. This runs the native executable with its built-in `--install` command. **No PowerShell script is used**, so PowerShell execution policies and downloaded-script signature errors do not apply to this setup step. Administrator privileges are not normally required.

The installer copies the host into `%LOCALAPPDATA%\WebFileLauncher\bin`, checks its Native Messaging response, and registers both 32-bit and 64-bit registry views where applicable for Chrome and Edge. You can also double-click `native-host/WebFileLauncher.Host.exe` and confirm the setup dialog.

Wait for both messages:

```text
Registered for Chrome and Edge (current Windows user).
Installation completed.
```

The window stays open so you can read any errors. Setup writes a diagnostic log to:

```text
%TEMP%\WebFileLauncher-install.log
```

Registration creates `%LOCALAPPDATA%\WebFileLauncher\host.json`, pointing to the installed host on that PC. The setup self-test must succeed before browser registration is written. Each person should run setup on their own PC. Existing saved rules are preserved when reinstalling.

If setup is blocked, see [Troubleshooting](#troubleshooting). Successful registration alone does not mean Windows will allow the host to execute.

### 3. Load the extension

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted **`extension`** directory.
4. Pin **Web File Launcher** to your toolbar if desired.
5. Click its icon to open the popup.

Repeat this step for each browser profile you want to use. The Windows host is registered once per Windows account; moving the extracted package does not change its installed path. Moving the extension directory still requires reloading it in the browser.

### 4. Create your first rule

1. Open the popup and check for **Connected**. Click **↻** to refresh if needed.
2. Select **＋ Add new**.
3. Enter a name such as **Project workspace**.
4. Enter a website, for example `https://example.com/`, or click **Current site**.
5. Choose **File / application** or **Folder**.
6. Click **Choose target and save**, then select your target in the Windows dialog.
7. Visit or reload the website to trigger the rule. Use **Test launch** to test it manually.

The popup may close when the Windows picker receives focus. Selection continues in the background; reopen the popup after finishing to see the saved result. Complete or cancel the existing picker before opening another one.

## Usage

| Popup control | Action |
| --- | --- |
| **Rules** | View rules, toggle them, or launch a target manually. |
| **＋ Add new** | Create a website-to-target rule. |
| **Choose again** | Select a different target for an existing rule. |
| **Delete** → **Confirm delete** | Remove a rule; the target file is kept. |
| **Activity** | View or clear recent automatic launch events. |
| **↻** | Reconnect and refresh saved rules. |
| **English / Tiếng Việt** | Change the interface language; your choice is remembered. |

### Website matching

Rules match a website's **origin**: its protocol, hostname, and port. Paths, queries, and URL fragments are not part of the rule.

For a rule configured with `https://example.com`:

| Visited address | Matches? |
| --- | --- |
| `https://example.com` | Yes |
| `https://example.com/projects/42` | Yes |
| `http://example.com` | No — different protocol |
| `https://app.example.com` | No — different hostname |
| `https://example.com:8443` | No — different port |

Entering a full page URL when creating a rule stores its origin. Opening a matching website can trigger every enabled rule assigned to that origin.

### Launch behavior

- Executables run directly, without additional command-line arguments.
- Documents and folders open through Windows using their default handlers.
- Duplicate detection applies to `.exe` processes at the same path. Elevated processes may restrict path inspection; document and folder duplication cannot be reliably detected.
- If you close a target while staying on a website, reload the page or launch it manually to open it again.
- Closing the website or browser does not automatically close launched applications.
- Normal navigation and History API URL changes can trigger rules; iframe navigation and fragment-only changes do not. Back/Forward behavior depends on browser navigation events.
- Private browsing is not enabled by default.

## Troubleshooting

### The old installer reports “install.ps1 is not digitally signed”

You are using a package older than **2.3.0**. Download and extract the current package into a fresh folder, then run its `install.cmd`. The current setup does not include or invoke a `.ps1` file. Do not combine an old `install.cmd` with new files.

### Setup fails or a window closes immediately

Use `install.cmd` rather than launching the executable from a terminal that closes on completion. The wrapper keeps its output visible and saves `%TEMP%\WebFileLauncher-install.log`. Confirm that the archive is fully extracted, the host executable exists, and .NET Framework 4.6 or later is available. If Windows blocks the executable itself, see the next section.

### Smart App Control or Application Control blocks the host

The bundled host is unsigned. Moving setup into the executable removes the PowerShell dependency but does not make the executable trusted. You need a host build accepted by Windows and any applicable organizational policy. Do not disable these protections to install this package. Target applications are checked independently.

### The popup cannot connect

Confirm that setup reported **Native host connection verified** and **Installation completed**, then click **↻** in the popup. If the installed host was removed, run setup again. If only the extension directory moved, reload it from its new location in the browser.

### A target does not open

Use **Test launch** to read the error, verify the target still exists, and try opening it directly in Windows. Wait for the 15-second cooldown if it was just launched. Use **Choose again** if its location changed.

If setup fails, inspect `%TEMP%\WebFileLauncher-install.log`. Share the relevant error when [opening an issue](https://github.com/Qu4nh/Web-File-Launcher/issues), removing personal paths or other private details first.

## Privacy and permissions

Rules are stored in `%LOCALAPPDATA%\WebFileLauncher\rules.json`. Each browser profile stores its own language preference, local cache, form draft, selection result, and activity log. Profiles on the same Windows account share host rules; reopen the popup to refresh a profile's cache.

The extension has no cloud backend, analytics, or remote scripts. It does not inject content scripts or read page contents. A page cannot supply a launch path: the native host resolves the target from the locally saved rule and validates the rule's enabled state and website origin.

| Permission | Purpose |
| --- | --- |
| `webNavigation` | Detect website navigation and match configured origins. |
| `nativeMessaging` | Communicate with the registered Windows host. |
| `storage` | Store settings and activity locally. |
| `activeTab` | Identify the current website when the popup is opened. |

Applications launched by a rule have their own behavior and privacy policies.

## Updating and removal

**Update:** close any open target picker, extract the new package, run its `install.cmd` to update the installed native host, and click **Reload** on the browser's extensions page. If the extension directory changed, load it from the new location instead. Do not replace only the JavaScript files when the host has also changed.

**Remove:** remove **Web File Launcher** from each browser profile. To unregister the installed host, run this command in Command Prompt:

```bat
"%LOCALAPPDATA%\WebFileLauncher\bin\WebFileLauncher.Host.exe" --uninstall
```

This removes only registry entries owned by this installation. Saved rules, installed files, and your target files are retained. Once the host and any target picker have closed, you can delete `%LOCALAPPDATA%\WebFileLauncher` and the extracted package if no longer needed. Old releases registered directly from their extracted folder may have leftover `host.json` files; these are not used after running the current installer.

## Project status and feedback

The popup and JavaScript logic have been tested with simulated browser/native APIs. The native installer has also been tested on the development machine, including a path with spaces and Unicode characters, repeated installation, registry-view verification, and a read-only host messaging self-test. End-to-end target selection and launch through an installed extension have not yet been fully verified; compatibility with every Windows security configuration is not established.

This repository distributes the runnable package rather than a complete native-host development environment. Bug reports, documentation improvements, and feature requests are welcome through [GitHub Issues](https://github.com/Qu4nh/Web-File-Launcher/issues).
