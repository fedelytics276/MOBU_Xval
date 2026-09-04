# GitHub Setup Guide for MOBU_Xval

This guide will help you push the MOBU_Xval project to GitHub for client collaboration.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in repository details:
   ```
   Repository name: MOBU_Xval
   Description: xVA Model Validation Platform by FedeAnalytics
   Visibility: Private (recommended for client work)
   ✓ Skip "Initialize this repository with a README" (we already have one)
   ```
3. Click **"Create repository"**

### Step 2: Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@fedeanalytics.com"

# Verify configuration
git config --global --list
```

### Step 3: Connect to GitHub

```bash
# Navigate to project directory
cd /Users/fedeanalytics/Documents/Sectors_solution/Fede_Valuations

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/MOBU_Xval.git

# Or use SSH (if you have SSH keys set up)
git remote add origin git@github.com:YOUR_USERNAME/MOBU_Xval.git

# Verify remote is added
git remote -v
```

### Step 4: Push to GitHub

```bash
# Push main branch to GitHub
git push -u origin main

# You'll be prompted for GitHub credentials
# Username: your_github_username
# Password: use Personal Access Token (not your GitHub password)
```

**Done!** 🎉 Your project is now on GitHub.

---

## 📝 Creating a Personal Access Token (PAT)

GitHub requires a Personal Access Token for HTTPS authentication:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Select scopes:
   - ✓ `repo` (full control of private repositories)
   - ✓ `workflow` (if using GitHub Actions)
4. Click **"Generate token"**
5. **Copy the token immediately** (you won't see it again)
6. Use this token as your password when pushing

---

## 🔐 SSH Setup (Alternative - Recommended)

SSH is more secure and convenient:

### Generate SSH Key

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@fedeanalytics.com"

# Press Enter to accept default location (~/.ssh/id_ed25519)
# Enter passphrase (optional but recommended)

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub
```

### Add SSH Key to GitHub

1. Go to GitHub Settings → SSH and GPG keys
2. Click **"New SSH key"**
3. Title: "MacBook Pro" (or whatever makes sense)
4. Paste the public key
5. Click **"Add SSH key"**

### Test SSH Connection

```bash
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated..."
```

### Update Remote to SSH

```bash
# If you already added HTTPS remote, change it to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/MOBU_Xval.git

# Verify
git remote -v
```

---

## 👥 Inviting Client Collaborators

### Option 1: Add as Collaborators

1. Go to your repository on GitHub
2. Settings → Collaborators and teams
3. Click **"Add people"**
4. Enter client's GitHub username or email
5. Select permission level:
   - **Read**: View and clone only
   - **Write**: Can push changes (recommended for collaboration)
   - **Admin**: Full control (not recommended for clients)

### Option 2: Organization (For Multiple Projects)

Create a GitHub Organization for better management:

1. Go to [https://github.com/organizations/new](https://github.com/organizations/new)
2. Create "FedeAnalytics" organization
3. Add team members and set permissions
4. Transfer repository to organization

---

## 📋 Repository Settings (Recommended)

### Branch Protection Rules

Protect the `main` branch:

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✓ Require pull request before merging
   - ✓ Require approvals (1 minimum)
   - ✓ Dismiss stale reviews
   - ✓ Require status checks to pass (when CI/CD is set up)
   - ✓ Do not allow bypassing settings

### Issue Templates

Create `.github/ISSUE_TEMPLATE/` folder with templates:
- Bug report
- Feature request
- Question

### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`

---

## 🔄 Daily Workflow for Collaboration

### Pulling Latest Changes

```bash
# Fetch and merge latest from main
git pull origin main

# Or fetch first, then merge
git fetch origin
git merge origin/main
```

### Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: add new feature"

# Push feature branch to GitHub
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to your repository on GitHub
2. Click **"Pull requests"** → **"New pull request"**
3. Select your feature branch
4. Fill in PR template
5. Request review from team members
6. Wait for approval and merge

### Merging Changes

```bash
# After PR is approved on GitHub, update local main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name
```

---

## 📊 Repository Structure on GitHub

After pushing, your GitHub repository will have:

```
MOBU_Xval/
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── PROJECT_README.md (displays as main README)
├── README.md (documentation navigation)
├── Executive_Summary.md
├── xVA_Optimization_Solution_Design.md
├── xVA_Validation_Platform_Technical_Spec.md
├── Implementation_Roadmap.md
├── Model_Degradation_Framework.md
└── validation_platform_demo/
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── logo.svg
    ├── favicon.svg
    └── README_DEMO.md
```

---

## 🎯 GitHub Features to Enable

### GitHub Pages (Optional)

Host the web demo on GitHub Pages:

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` → `/validation_platform_demo`
4. Your demo will be available at: `https://YOUR_USERNAME.github.io/MOBU_Xval/`

### GitHub Projects

Track implementation progress:

1. Go to Projects → New project
2. Choose "Board" template
3. Create columns:
   - 📋 Backlog
   - 🏗️ In Progress
   - 👀 In Review
   - ✅ Done
4. Link to Implementation Roadmap tasks

### GitHub Actions (Future)

Set up CI/CD when code is added:

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: pip install -r requirements.txt
      - run: pytest tests/
```

---

## 🔒 Security Best Practices

### What NOT to Commit

Already configured in `.gitignore`:
- API keys and secrets
- Database credentials
- `.env` files
- Private SSH keys
- Large data files (use Git LFS)

### If You Accidentally Commit Secrets

```bash
# Remove file from history (DANGER: rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (only if repository is private and you're the only user)
git push origin --force --all
```

**Better**: Rotate the exposed secrets immediately!

### GitHub Security Features

1. Enable **Dependabot alerts** (Settings → Security)
2. Enable **Secret scanning** (Settings → Security)
3. Enable **Two-factor authentication** for your account

---

## 📧 Notifying Your Client

After setting up, send client:

```
Subject: MOBU_Xval Project Repository Access

Hello [Client Name],

I've set up the MOBU_Xval project repository on GitHub for our collaboration.

Repository: https://github.com/YOUR_USERNAME/MOBU_Xval

What you'll find:
✓ Complete project documentation
✓ Interactive web demo
✓ Implementation roadmap
✓ Technical specifications

To get started:
1. Accept the GitHub collaboration invitation (check your email)
2. Clone the repository: git clone <repo-url>
3. Review the PROJECT_README.md for an overview
4. Run the demo: cd validation_platform_demo && python3 -m http.server 8000

For questions or issues, please use GitHub Issues or contact me directly.

Best regards,
FedeAnalytics Team
```

---

## 🆘 Troubleshooting

### "Permission denied (publickey)"
- SSH key not added to GitHub
- SSH agent not running
- Wrong repository URL

**Fix**: Use HTTPS instead or set up SSH properly

### "fatal: remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin <correct-url>
```

### "Updates were rejected because the remote contains work..."
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Large File Warnings
```bash
# Use Git LFS for files > 50MB
git lfs install
git lfs track "*.csv"
git add .gitattributes
git commit -m "chore: add Git LFS"
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Repository created on GitHub
- [ ] All files pushed successfully
- [ ] README displays correctly on GitHub
- [ ] Client invited as collaborator
- [ ] Branch protection rules set
- [ ] Demo works (if using GitHub Pages)
- [ ] Issue labels created
- [ ] Project board set up (optional)

---

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎉 You're All Set!

Your MOBU_Xval project is now ready for client collaboration on GitHub.

**Next Steps:**
1. Push to GitHub using commands above
2. Invite client collaborators
3. Share repository URL
4. Start collaborating!

---

**Need Help?** Contact: support@fedeanalytics.com
