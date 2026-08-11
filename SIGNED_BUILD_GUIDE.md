# Signed Release Build Setup Guide

This guide explains how to securely configure your signing keystore for the
Google Play Store AAB build — **without hardcoding any passwords in the code**.

---

## Step 1: Generate a Release Keystore

On your computer (requires Java/JDK installed):

```bash
keytool -genkey -v -keystore release.keystore -alias calculator-pro \
  -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- **Keystore password** — choose a strong password
- **Key alias** — `calculator-pro` (or any name you prefer)
- **Key password** — can be the same or different
- **Your name, organization, etc.** — fill in your details

> IMPORTANT: Back up this `.keystore` file in a safe place. You will need the
> SAME keystore for every future update to this app on the Play Store. If you
> lose it, you cannot update the app.

---

## Step 2: Base64-Encode the Keystore

The workflow reads the keystore from a GitHub secret. To store a binary file
as a secret, encode it as base64:

**macOS / Linux:**
```bash
base64 -i release.keystore -o keystore-base64.txt
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Out-File -Encoding ascii keystore-base64.txt
```

Copy the entire contents of `keystore-base64.txt` to your clipboard.

---

## Step 3: Add GitHub Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** →
**Actions** → **New repository secret**. Add these 4 secrets:

| Secret Name | Value |
|---|---|
| `RELEASE_KEYSTORE_BASE64` | Paste the base64-encoded keystore content |
| `RELEASE_STORE_PASSWORD` | The keystore password you chose in Step 1 |
| `RELEASE_KEY_ALIAS` | The alias you chose (e.g., `calculator-pro`) |
| `RELEASE_KEY_PASSWORD` | The key password you chose in Step 1 |

Also make sure these secrets exist (for the web build):
| Secret Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

---

## Step 4: Trigger the Build

Push to the `main` branch, or go to **Actions** → **Build Android APK & AAB** →
**Run workflow** to trigger manually.

The workflow will:
1. Build a **debug APK** (for testing) — always runs
2. Build a **signed release AAB** (for Play Store) — only runs if the keystore
   secrets are configured

Both artifacts are uploaded to the workflow run page under **Artifacts**.

---

## Step 5: Download the AAB

1. Go to the **Actions** tab in your GitHub repository
2. Click the latest successful run
3. Scroll down to **Artifacts**
4. Download **Calculator-Pro-AAB**

Upload this `.aab` file to the Google Play Console under
**Production** → **Create new release**.

---

## Security Notes

- The keystore file is **never** committed to the repository
- The keystore is decoded at build time and **deleted** after the build
  completes (even if the build fails)
- Passwords are only available as environment variables during the build —
  they are never printed or logged
- GitHub secrets are encrypted at rest and masked in logs
