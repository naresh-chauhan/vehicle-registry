# Git Setup Instructions

## Step 1: Install Git

1. **Download Git for Windows**: https://git-scm.com/download/win
2. **Run the installer** and use all default settings
3. **Restart your terminal/PowerShell** after installation

## Step 2: Verify Installation

Open PowerShell and type:
```bash
git --version
```

You should see something like: `git version 2.x.x`

## Step 3: Configure Git (First Time Only)

Set your name and email (replace with your info):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Where to Type Git Commands

**You type Git commands in PowerShell (or Command Prompt):**

1. **Open PowerShell**:
   - Press `Windows Key + X`
   - Select "Windows PowerShell" or "Terminal"
   - OR use the terminal in Cursor (bottom panel)

2. **Navigate to your project**:
   ```bash
   cd C:\Users\nar3s\vehicle-registry
   ```

3. **Type the Git commands** in that same PowerShell window

## Step 5: Push to GitHub

Once Git is installed, follow these steps:

### A. Create a GitHub Account
- Go to https://github.com
- Sign up for a free account

### B. Create a New Repository on GitHub
1. Click the "+" icon in the top right
2. Select "New repository"
3. Name it: `vehicle-registry`
4. Make it **Public** (required for free hosting)
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### C. Push Your Code

In PowerShell (in your project folder), type these commands one by one:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Rename branch to main
git branch -M main

# Add GitHub as remote (REPLACE YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vehicle-registry.git

# Push to GitHub
git push -u origin main
```

**Note**: When you run `git push`, GitHub will ask for your username and password. 
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - To create one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Give it "repo" permissions

## Alternative: Use GitHub Desktop (Easier GUI)

If you prefer a visual interface:

1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. Click "File" → "Add Local Repository"
4. Select: `C:\Users\nar3s\vehicle-registry`
5. Click "Publish repository" to push to GitHub

