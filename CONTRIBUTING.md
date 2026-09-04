# Contributing to MOBU_Xval

Thank you for your interest in contributing to MOBU_Xval! This document provides guidelines for collaboration.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Commit Messages](#commit-messages)
9. [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and professional environment for all contributors.

### Expected Behavior

- Be respectful and professional
- Welcome diverse perspectives
- Focus on constructive feedback
- Respect intellectual property and confidentiality

### Unacceptable Behavior

- Harassment or discrimination
- Disrespectful or unprofessional communication
- Sharing proprietary information without authorization

---

## 🚀 Getting Started

### Prerequisites

- Git installed and configured
- Python 3.9 or higher
- Access to the repository (request from project lead)
- Understanding of xVA models and validation (recommended)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd Fede_Valuations

# Create a branch for your work
git checkout -b feature/your-feature-name

# Set up development environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (when available)
pip install -r requirements-dev.txt
```

---

## 🤝 How to Contribute

### Types of Contributions

1. **Documentation Improvements**
   - Clarify existing documentation
   - Add examples and use cases
   - Fix typos and formatting
   - Translate documentation

2. **Code Contributions**
   - Bug fixes
   - New features
   - Performance improvements
   - Test coverage improvements

3. **Issue Reporting**
   - Bug reports
   - Feature requests
   - Questions and discussions

4. **Reviews**
   - Code reviews
   - Documentation reviews
   - Architecture discussions

### What to Contribute

**High Priority:**
- Implementation of Phase 1 components (see Implementation_Roadmap.md)
- Unit tests for validation framework
- Integration tests for data pipelines
- Performance benchmarks

**Medium Priority:**
- Additional documentation and examples
- UI/UX improvements for web demo
- Additional validation test cases
- Deployment scripts and automation

**Welcome Contributions:**
- Bug fixes (always appreciated!)
- Documentation improvements
- Code quality improvements
- Example notebooks and tutorials

---

## 💻 Development Workflow

### Branching Strategy

```
main
  └─ develop
       ├─ feature/calibration-engine
       ├─ feature/gpu-acceleration
       ├─ bugfix/pnl-calculation
       └─ release/v1.1
```

**Branch Types:**
- `main` - Production-ready, stable code
- `develop` - Integration branch for development
- `feature/*` - New features (branch from `develop`)
- `bugfix/*` - Bug fixes (branch from `develop`)
- `hotfix/*` - Urgent production fixes (branch from `main`)
- `release/*` - Release preparation (branch from `develop`)

### Workflow Steps

1. **Create Issue**
   ```
   - Describe the problem or feature
   - Add appropriate labels
   - Assign to yourself or request assignment
   ```

2. **Create Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

3. **Develop**
   ```bash
   # Make changes
   # Write tests
   # Update documentation
   ```

4. **Test Locally**
   ```bash
   # Run all tests
   pytest tests/
   
   # Run linting
   flake8 src/
   black src/
   
   # Run type checking
   mypy src/
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add calibration quality monitoring"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

7. **Address Review Comments**
   ```bash
   # Make changes based on feedback
   git add .
   git commit -m "fix: address review comments"
   git push origin feature/your-feature-name
   ```

8. **Merge**
   ```
   - Squash and merge to develop
   - Delete feature branch after merge
   ```

---

## 📝 Coding Standards

### Python Style Guide

Follow **PEP 8** with these additions:

```python
# Good: Descriptive names, type hints, docstrings
def calculate_calibration_error(
    model_prices: np.ndarray,
    market_prices: np.ndarray,
    weights: Optional[np.ndarray] = None
) -> float:
    """
    Calculate weighted calibration error.
    
    Args:
        model_prices: Array of model-generated prices
        market_prices: Array of market observed prices
        weights: Optional weights for each instrument
        
    Returns:
        float: Weighted mean absolute error in basis points
        
    Raises:
        ValueError: If arrays have different lengths
    """
    if len(model_prices) != len(market_prices):
        raise ValueError("Price arrays must have same length")
    
    errors = np.abs(model_prices - market_prices)
    
    if weights is not None:
        return np.average(errors, weights=weights) * 10000
    else:
        return np.mean(errors) * 10000


# Bad: No type hints, no docstring, unclear names
def calc(m, mk, w=None):
    e = np.abs(m - mk)
    if w is not None:
        return np.average(e, weights=w) * 10000
    else:
        return np.mean(e) * 10000
```

### Code Organization

```python
# File structure for modules
"""
Module for calibration quality monitoring.

This module provides functions for assessing and tracking
calibration quality over time.
"""

# Standard library imports
import logging
from typing import Dict, List, Optional

# Third-party imports
import numpy as np
import pandas as pd

# Local imports
from mobu_xval.core import ValidationError
from mobu_xval.utils import logger

# Module-level constants
CALIBRATION_THRESHOLD_BP = 1.0
DEFAULT_WINDOW_DAYS = 30

# Class definitions
class CalibrationMonitor:
    """Monitor calibration quality metrics."""
    pass

# Function definitions
def assess_calibration_quality(...):
    """Assess current calibration quality."""
    pass
```

### Naming Conventions

- **Classes**: PascalCase (`CalibrationEngine`, `ValidationSuite`)
- **Functions**: snake_case (`calculate_error`, `run_validation`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITERATIONS`, `DEFAULT_TOLERANCE`)
- **Private**: Leading underscore (`_internal_helper`, `_cache`)

### Type Hints

Use type hints for all public functions:

```python
from typing import List, Dict, Optional, Union, Tuple

def process_trades(
    trades: List[Dict[str, any]],
    as_of_date: str,
    include_expired: bool = False
) -> Tuple[pd.DataFrame, Dict[str, int]]:
    """Process trade data."""
    pass
```

---

## 🧪 Testing Guidelines

### Test Structure

```
tests/
├── unit/                   # Unit tests
│   ├── test_calibration.py
│   ├── test_validation.py
│   └── test_degradation.py
├── integration/            # Integration tests
│   ├── test_data_pipeline.py
│   └── test_api.py
├── performance/            # Performance tests
│   └── test_benchmarks.py
└── conftest.py            # Pytest fixtures
```

### Writing Tests

```python
# tests/unit/test_calibration.py
import pytest
import numpy as np
from mobu_xval.calibration import calculate_calibration_error

class TestCalibrationError:
    """Test suite for calibration error calculations."""
    
    def test_zero_error(self):
        """Test that identical prices give zero error."""
        prices = np.array([100.0, 200.0, 300.0])
        error = calculate_calibration_error(prices, prices)
        assert error == 0.0
    
    def test_known_error(self):
        """Test with known error value."""
        model = np.array([100.0, 200.0])
        market = np.array([100.1, 199.9])
        error = calculate_calibration_error(model, market)
        assert np.isclose(error, 1.0)  # 0.1 absolute = 1bp
    
    def test_weighted_error(self):
        """Test weighted error calculation."""
        model = np.array([100.0, 200.0])
        market = np.array([101.0, 200.0])
        weights = np.array([1.0, 0.0])  # Only first matters
        error = calculate_calibration_error(model, market, weights)
        assert np.isclose(error, 10.0)  # 1.0 absolute = 10bp
    
    def test_dimension_mismatch_raises(self):
        """Test that mismatched dimensions raise error."""
        model = np.array([100.0])
        market = np.array([100.0, 200.0])
        with pytest.raises(ValueError):
            calculate_calibration_error(model, market)

    @pytest.mark.parametrize("model,market,expected", [
        ([100], [100], 0.0),
        ([100], [100.1], 1.0),
        ([100, 200], [100.1, 199.9], 1.0),
    ])
    def test_parametrized(self, model, market, expected):
        """Test multiple cases with parametrize."""
        error = calculate_calibration_error(
            np.array(model), np.array(market)
        )
        assert np.isclose(error, expected)
```

### Test Coverage

- Aim for >80% code coverage
- 100% coverage for critical paths
- Include edge cases and error conditions
- Test both success and failure paths

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_calibration.py

# Run specific test
pytest tests/unit/test_calibration.py::TestCalibrationError::test_zero_error

# Run with markers
pytest -m "not slow"  # Skip slow tests
```

---

## 📚 Documentation

### Docstring Format

Use **Google Style** docstrings:

```python
def calculate_exposure(
    trade: Trade,
    scenarios: np.ndarray,
    collateral: Optional[CollateralAgreement] = None
) -> ExposureProfile:
    """
    Calculate exposure profile for a trade under scenarios.
    
    This function simulates the trade value across multiple market
    scenarios and applies collateral rules to compute the exposure
    profile over time.
    
    Args:
        trade: Trade object containing trade details
        scenarios: Array of shape (n_scenarios, n_timesteps, n_factors)
            containing market scenario simulations
        collateral: Optional collateral agreement. If None, assumes
            no collateral (uncollateralized exposure)
    
    Returns:
        ExposureProfile object containing:
            - epe: Expected Positive Exposure at each timestep
            - ene: Expected Negative Exposure at each timestep
            - pfe: Potential Future Exposure (95th percentile)
    
    Raises:
        ValueError: If scenarios array has invalid shape
        CalibrationError: If trade pricing fails
    
    Example:
        >>> trade = Trade(notional=1_000_000, maturity=5.0)
        >>> scenarios = generate_scenarios(n_paths=10000)
        >>> profile = calculate_exposure(trade, scenarios)
        >>> print(profile.epe)
    
    Note:
        This function is computationally intensive. For large portfolios,
        consider using the batch processing API.
    
    See Also:
        - calculate_portfolio_exposure: For multiple trades
        - CollateralAgreement: Collateral agreement specification
    """
    pass
```

### Documentation Updates

When adding features, update:

1. **Code docstrings** - All public APIs
2. **README.md** - If architecture changes
3. **Technical docs** - Implementation details
4. **User guides** - If user-facing features

---

## 💬 Commit Messages

### Format

Use **Conventional Commits** format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes

### Examples

```bash
# Good commits
git commit -m "feat(calibration): add G2++ model calibration"
git commit -m "fix(validation): correct P&L attribution calculation"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(calibration): add unit tests for parameter stability"
git commit -m "perf(monte-carlo): optimize GPU memory usage"

# With body
git commit -m "feat(degradation): add anomaly detection

Implemented isolation forest algorithm for detecting
multivariate anomalies in model metrics. Includes
configurable contamination parameter and retraining
schedule.

Closes #123"

# Breaking change
git commit -m "feat(api)!: change validation endpoint response format

BREAKING CHANGE: ValidationResult now returns structured
errors instead of flat list. Update client code accordingly."
```

---

## 🔄 Pull Request Process

### Before Creating PR

- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commits follow conventional format
- [ ] Branch is up to date with develop

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Detailed list of changes
- Why these changes were necessary

## Testing
- How was this tested?
- What test cases were added?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added
- [ ] All tests pass

## Related Issues
Closes #123
Related to #456
```

### Review Process

1. **Automated Checks** (CI/CD runs automatically)
   - Linting
   - Type checking
   - Unit tests
   - Integration tests
   - Code coverage

2. **Peer Review** (Required)
   - At least 1 approval required
   - Address all comments
   - Re-request review after changes

3. **Technical Lead Review** (For major changes)
   - Architecture review
   - Performance review
   - Security review

4. **Merge**
   - Squash and merge to keep history clean
   - Delete feature branch after merge

### PR Best Practices

- Keep PRs focused and small (<500 lines if possible)
- Provide context and rationale
- Respond to comments promptly
- Be open to feedback
- Test thoroughly before requesting review

---

## 🎯 Areas Needing Contributions

### Immediate Priorities

1. **Core Calculation Engine**
   - Monte Carlo simulation framework
   - G2++ model implementation
   - Exposure calculation engine

2. **Validation Framework**
   - Calibration quality tests
   - Convergence validation tests
   - Stress testing framework

3. **Data Pipelines**
   - Market data ingestion
   - Trade repository integration
   - Model artifact management

### Future Enhancements

1. **Additional Models**
   - FX volatility models
   - Credit spread models
   - Alternative calibration methods

2. **Performance**
   - GPU optimization
   - Distributed computing
   - Caching strategies

3. **User Interface**
   - Advanced visualizations
   - Custom report builder
   - Real-time monitoring dashboard

---

## 📞 Getting Help

### Questions?

- **General questions**: Open a discussion on GitHub
- **Bug reports**: Open an issue with `bug` label
- **Feature ideas**: Open an issue with `enhancement` label
- **Urgent matters**: Contact the technical lead directly

### Resources

- [Project Documentation](./README.md)
- [Technical Specifications](./xVA_Validation_Platform_Technical_Spec.md)
- [Implementation Roadmap](./Implementation_Roadmap.md)

---

## 🙏 Thank You!

Your contributions make MOBU_Xval better for everyone. We appreciate your time and expertise!

---

**Questions about contributing? Open an issue or start a discussion!**
