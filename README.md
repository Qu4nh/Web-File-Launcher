<div align="center">

# Web File Launcher

**Connect the websites you visit to the files you use.**

Open a local application, document, or folder automatically when you visit a configured website.

![Windows](https://img.shields.io/badge/platform-Windows-0078D4)
![Chrome](https://img.shields.io/badge/browser-Chrome-4285F4)
![Edge](https://img.shields.io/badge/browser-Edge-0078D7)
![Version](https://img.shields.io/badge/extension-v2.2.0-16694F)

[Getting started](#getting-started) · [Usage](#usage) · [Troubleshooting](#troubleshooting) · [Report an issue](https://github.com/Qu4nh/Web-File-Launcher/issues)

Created by [qu4nh](https://github.com/Qu4nh).

</div>

## Overview

Web File Launcher pairs a website with something on your Windows PC. For example, opening a project dashboard can launch your desktop tool, a reference document, or the project's local folder.

Manage everything from a compact toolbar popup. There is no separate settings tab and no cloud service to configure.

The project consists of a browser extension and a Windows **native host**. The native host is required because browser extensions cannot directly launch arbitrary local programs.

> **Distribution status:** this package includes an unsigned native host. Windows Smart App Control or organizational policies may prevent it from running. The installer does not disable these protections. This is not a signed, store-distributed release.

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

[Download the latest source-tree ZIP](https://github.com/Qu4nh/Web-File-Launcher/archive/refs/heads/main.zip), then extract the entire archive to a permanent location.

The extracted directory should contain:

```text
Web-File-Launcher/
├── extension/                     Browser extension
├── native-host/
│   ├── WebFileLauncher.Host.exe    Windows native host
│   └── install.ps1                Native host registration
├── install.cmd                    Setup launcher with error logging
└── README.md
```

Do not run setup inside the ZIP or move this directory after installation.

### 2. Register the native host

Double-click **`install.cmd`** in the extracted directory. This invokes the registration script for your current Windows account; administrator privileges are not normally required.

Wait for both messages:

```text
Registered for Chrome and Edge (current Windows user).
Installation completed.
```

The window stays open so you can read any errors. Setup writes a diagnostic log to:

```text
%TEMP%\WebFileLauncher-install.log
```

Registration creates `native-host/host.json` using your installation path. Do not share that generated file with other users; each person should run setup on their own PC.

If setup is blocked, see [Troubleshooting](#troubleshooting). Successful registration alone does not mean Windows will allow the host to execute.

### 3. Load the extension

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted **`extension`** directory.
4. Pin **Web File Launcher** to your toolbar if desired.
5. Click its icon to open the popup.

Repeat this step for each browser profile you want to use. You only need to register the Windows host once per installation location and Windows account.

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

### “install.ps1 is not digitally signed”

Downloaded files may carry an Internet-zone marker. Open PowerShell in the extracted directory and check your policy:

```powershell
Get-ExecutionPolicy
```

If it is **RemoteSigned**, inspect `native-host/install.ps1` first. If you trust that specific file, remove its download marker and run it:

```powershell
Unblock-File -LiteralPath .\native-host\install.ps1
.\native-host\install.ps1
```

This does not change the execution policy or Smart App Control. Do not apply it indiscriminately to downloaded files. If your policy is **AllSigned**, **Restricted**, or managed by your organization, use an appropriately signed or approved installation instead.

See Microsoft's [execution policy documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1#manage-signed-and-unsigned-scripts).

### Smart App Control or Application Control blocks the host

The bundled host is unsigned. Re-registering it or unblocking the registration script does not make the executable trusted. You need a host build accepted by Windows and any applicable organizational policy. Do not disable these protections to install this package. Target applications are checked independently.

### The popup cannot connect

Confirm that setup completed, all files were extracted, and the installation directory has not moved. Click **↻** in the popup. If the directory moved, register the host again and reload the extension from its new location.

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

**Update:** close any open target picker, replace the package in its permanent location, and click **Reload** on the browser's extensions page. Run setup again if the host path changes.

**Remove:** remove **Web File Launcher** from each browser profile. Remaining host registration does not automatically launch anything, and your target files remain intact. You can then delete the installation directory and `%LOCALAPPDATA%\WebFileLauncher` if you no longer need the saved rules.

For complete registry cleanup, experienced users or administrators can remove only the `io.github.web_file_launcher` key created by this package beneath:

```text
HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts
HKEY_CURRENT_USER\Software\Microsoft\Edge\NativeMessagingHosts
```

## Project status and feedback

The popup and JavaScript logic have been tested with simulated browser/native APIs. Native host registration and a read-only messaging request have also been verified on the development machine. End-to-end target selection and launch through an installed extension have not yet been fully verified; compatibility with every Windows security configuration is not established.

This repository distributes the runnable package rather than a complete native-host development environment. Bug reports, documentation improvements, and feature requests are welcome through [GitHub Issues](https://github.com/Qu4nh/Web-File-Launcher/issues).
