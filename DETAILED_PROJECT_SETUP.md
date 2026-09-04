# MOBU_Xval - Detailed Project Setup Guide
## Complete Development, Deployment & Collaboration Setup

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Environment](#development-environment)
4. [Project Structure](#project-structure)
5. [Data Engineering Setup](#data-engineering-setup)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [Database Setup](#database-setup)
9. [GPU & Compute Setup](#gpu--compute-setup)
10. [Testing Setup](#testing-setup)
11. [CI/CD Setup](#cicd-setup)
12. [Deployment Setup](#deployment-setup)
13. [Monitoring & Logging](#monitoring--logging)
14. [Security Setup](#security-setup)
15. [Collaboration Workflow](#collaboration-workflow)

---

## 1. Prerequisites

### System Requirements

**Hardware:**
- CPU: 8+ cores (16+ recommended for development)
- RAM: 16GB minimum (32GB+ recommended)
- Storage: 100GB+ available
- GPU: NVIDIA GPU with CUDA 11.8+ (for production performance)

**Software:**
- macOS 12+ / Linux (Ubuntu 20.04+) / Windows 10+ with WSL2
- Git 2.30+
- Python 3.9+
- Node.js 16+
- Docker 20.10+
- Docker Compose 2.0+

### Account Setup

1. **GitHub Account** - https://github.com
2. **Docker Hub** (optional) - https://hub.docker.com
3. **Cloud Provider** (for production):
   - AWS / Azure / GCP account
   - Terraform Cloud (optional)

---

## 2. Initial Setup

### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/fedelytics276/MOBU_Xval.git
cd MOBU_Xval

# Verify you're on main branch
git branch
git status
```

### 2.2 Environment Setup

```bash
# Create main environment file
cat > .env << 'EOF'
# Project Configuration
PROJECT_NAME=mobu_xval
ENVIRONMENT=development
DEBUG=true

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mobu_xval
POSTGRES_USER=mobu_user
POSTGRES_PASSWORD=changeme_in_production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=changeme_in_production

# TimescaleDB Configuration
TIMESCALE_HOST=localhost
TIMESCALE_PORT=5433
TIMESCALE_DB=mobu_timeseries

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_SECRET_KEY=generate_random_secret_key_here

# Compute Configuration
ENABLE_GPU=false
CUDA_VISIBLE_DEVICES=0
NUM_WORKERS=4

# Market Data Configuration
BLOOMBERG_API_KEY=your_key_here
REFINITIV_API_KEY=your_key_here

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/mobu_xval.log

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
EOF

# Secure the environment file
chmod 600 .env

# Create separate environment files for different environments
cp .env .env.development
cp .env .env.staging
cp .env .env.production

echo "⚠️  Remember to update passwords and API keys in production!"
```

### 2.3 Create Directory Structure

```bash
# Create complete project structure
mkdir -p {src,tests,data,logs,docs,config,scripts,infrastructure}
mkdir -p src/{api,core,models,validation,utils,data_engineering}
mkdir -p src/data_engineering/{bronze,silver,gold,orchestration}
mkdir -p tests/{unit,integration,performance,fixtures}
mkdir -p data/{raw,processed,artifacts,cache}
mkdir -p logs/{api,validation,pipeline}
mkdir -p config/{development,staging,production}
mkdir -p infrastructure/{terraform,kubernetes,docker}
mkdir -p docs/{api,architecture,runbooks}

echo "✅ Directory structure created"
tree -L 2 -d
```

---

## 3. Development Environment

### 3.1 Python Environment Setup

```bash
# Install pyenv for Python version management (if not installed)
curl https://pyenv.run | bash

# Install Python 3.9.18
pyenv install 3.9.18
pyenv local 3.9.18

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate   # On Windows

# Upgrade pip and setuptools
pip install --upgrade pip setuptools wheel

# Install development dependencies
cat > requirements-dev.txt << 'EOF'
# Core Dependencies
numpy==1.24.3
pandas==2.0.3
scipy==1.11.1

# Quantitative Libraries
quantlib-python==1.31
statsmodels==0.14.0

# Web Framework
fastapi==0.103.1
uvicorn[standard]==0.23.2
pydantic==2.3.0
pydantic-settings==2.0.3

# Database
psycopg2-binary==2.9.7
sqlalchemy==2.0.20
alembic==1.12.0
redis==5.0.0

# Data Engineering
dask[complete]==2023.9.2
apache-airflow==2.7.1
delta-spark==2.4.0

# GPU Computing
cupy-cuda11x==12.2.0  # For CUDA 11.x
numba==0.57.1

# Machine Learning
scikit-learn==1.3.0
lightgbm==4.1.0

# Testing
pytest==7.4.2
pytest-cov==4.1.0
pytest-asyncio==0.21.1
pytest-mock==3.11.1
hypothesis==6.88.1

# Code Quality
black==23.9.1
flake8==6.1.0
mypy==1.5.1
pylint==2.17.5
isort==5.12.0

# Documentation
sphinx==7.2.6
sphinx-rtd-theme==1.3.0

# Monitoring
prometheus-client==0.17.1

# Utilities
python-dotenv==1.0.0
click==8.1.7
pyyaml==6.0.1
requests==2.31.0
EOF

pip install -r requirements-dev.txt

# Create production requirements (subset)
cat > requirements.txt << 'EOF'
numpy==1.24.3
pandas==2.0.3
scipy==1.11.1
quantlib-python==1.31
fastapi==0.103.1
uvicorn[standard]==0.23.2
pydantic==2.3.0
psycopg2-binary==2.9.7
sqlalchemy==2.0.20
redis==5.0.0
python-dotenv==1.0.0
EOF

pip install -r requirements.txt
```

### 3.2 Node.js Environment Setup

```bash
# Install nvm (Node Version Manager) if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Install Node.js 18 LTS
nvm install 18
nvm use 18

# Navigate to frontend directory (when created)
cd validation_platform_demo

# Create package.json for dependencies
cat > package.json << 'EOF'
{
  "name": "mobu-xval-frontend",
  "version": "1.0.0",
  "description": "MOBU_Xval Validation Platform Frontend",
  "scripts": {
    "dev": "http-server -p 8000 -c-1",
    "build": "npm run minify",
    "minify": "terser app.js -o app.min.js && csso styles.css -o styles.min.css",
    "lint": "eslint *.js",
    "format": "prettier --write *.{js,html,css}"
  },
  "dependencies": {
    "bootstrap": "^5.3.2",
    "plotly.js-dist": "^2.26.0"
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "prettier": "^3.0.3",
    "http-server": "^14.1.1",
    "terser": "^5.20.0",
    "csso-cli": "^4.0.2"
  }
}
EOF

# Install dependencies
npm install

cd ..
```

### 3.3 Pre-commit Hooks Setup

```bash
# Install pre-commit
pip install pre-commit

# Create pre-commit configuration
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
        args: ['--maxkb=10000']
      - id: check-json
      - id: check-merge-conflict
      - id: detect-private-key

  - repo: https://github.com/psf/black
    rev: 23.9.1
    hooks:
      - id: black
        language_version: python3.9

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        args: ["--profile", "black"]

  - repo: https://github.com/pycqa/flake8
    rev: 6.1.0
    hooks:
      - id: flake8
        args: ['--max-line-length=88', '--extend-ignore=E203']

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.5.1
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
EOF

# Install pre-commit hooks
pre-commit install

# Run on all files to test
pre-commit run --all-files
```

---

## 4. Project Structure

### 4.1 Create Core Module Structure

```bash
# Create __init__.py files
touch src/__init__.py
touch src/api/__init__.py
touch src/core/__init__.py
touch src/models/__init__.py
touch src/validation/__init__.py
touch src/utils/__init__.py
touch src/data_engineering/__init__.py

# Create main API application
cat > src/api/main.py << 'EOF'
"""
MOBU_Xval - Main API Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MOBU_Xval API",
    description="xVA Model Validation Platform API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "MOBU_Xval API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Create configuration management
cat > src/core/config.py << 'EOF'
"""
Configuration Management
"""
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    
    # Project
    project_name: str = "MOBU_Xval"
    environment: str = "development"
    debug: bool = True
    
    # Database
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "mobu_xval"
    postgres_user: str = "mobu_user"
    postgres_password: str = "changeme"
    
    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_secret_key: str = "changeme"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
EOF

# Create logger utility
cat > src/utils/logger.py << 'EOF'
"""
Logging Configuration
"""
import logging
import sys
from pathlib import Path

def setup_logger(name: str, log_file: str = None, level=logging.INFO):
    """Setup logger with file and console handlers"""
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler
    if log_file:
        Path(log_file).parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger
EOF
```

---

## 5. Data Engineering Setup

### 5.1 Medallion Architecture Implementation

```bash
# Create medallion architecture structure
cat > src/data_engineering/medallion_architecture.md << 'EOF'
# Medallion Architecture for MOBU_Xval

## Overview

The platform uses a medallion architecture (Bronze → Silver → Gold) for data processing.

```
┌─────────────────────────────────────────────────────────────────┐
│                   MOBU_Xval Data Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐             │
│  │  Bronze  │ ───▶ │  Silver  │ ───▶ │   Gold   │             │
│  │   Layer  │      │   Layer  │      │   Layer  │             │
│  └──────────┘      └──────────┘      └──────────┘             │
│       ▲                  ▲                  ▲                   │
│       │                  │                  │                   │
│  Raw Data          Cleansed &         Analytics-Ready          │
│                   Validated                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Bronze Layer (Raw Data Ingestion)

### Purpose
- Ingest raw data from source systems
- Minimal transformation
- Preserve original format
- Audit trail of all data received

### Data Sources
1. **Market Data**
   - Bloomberg API
   - Refinitiv/Reuters
   - Exchange feeds

2. **Trade Data**
   - Trade repository
   - Risk systems
   - Trading platforms

3. **Reference Data**
   - Security master
   - Counterparty data
   - CSA agreements

4. **Model Artifacts**
   - Calibration parameters
   - Model configurations
   - Historical results

### Implementation
- Format: Parquet (Delta Lake)
- Partitioning: By date and source
- Retention: 3 years
- Schema: Flexible (schema-on-read)

## Silver Layer (Cleansed & Validated)

### Purpose
- Data quality checks
- Schema enforcement
- Deduplication
- Type conversion
- Business rule validation

### Transformations
1. **Data Quality**
   - Null handling
   - Outlier detection
   - Completeness checks
   - Consistency validation

2. **Standardization**
   - Date/time normalization
   - Currency conversion
   - Naming conventions
   - Unit standardization

3. **Enrichment**
   - Join reference data
   - Calculate derived fields
   - Add metadata

### Implementation
- Format: Parquet (Delta Lake)
- Partitioning: By date and data type
- Retention: 3 years
- Schema: Enforced schema
- Quality Metrics: Tracked per dataset

## Gold Layer (Analytics-Ready)

### Purpose
- Aggregated data for consumption
- Optimized for query performance
- Business logic applied
- Ready for ML and validation

### Datasets
1. **Calibration Metrics**
   - Daily calibration parameters
   - Quality metrics
   - Historical trends

2. **Validation Results**
   - Test execution results
   - Pass/fail status
   - Detailed metrics

3. **Model Performance**
   - P&L attribution
   - Exposure forecasts
   - Greeks calculations

4. **Degradation Indicators**
   - Health scores
   - Anomaly flags
   - Alert triggers

### Implementation
- Format: Parquet (optimized)
- Partitioning: By date and metric type
- Retention: 5 years
- Schema: Dimensional model
- Indexes: For fast queries

## Data Flow

```
Sources → Bronze (Raw) → Silver (Cleaned) → Gold (Aggregated) → Consumption
           ↓               ↓                   ↓
        Audit Log    Quality Metrics    Business Metrics
```

## Technology Stack

- **Storage**: S3 / Azure Data Lake / GCS
- **Format**: Delta Lake (ACID transactions)
- **Processing**: Apache Spark
- **Orchestration**: Apache Airflow
- **Catalog**: AWS Glue / Unity Catalog
- **Query**: PrestoDB / Trino

## Data Governance

### Data Lineage
- Track data from source to consumption
- Maintain transformation history
- Impact analysis capabilities

### Data Quality
- Automated quality checks at each layer
- SLA monitoring and alerting
- Data quality dashboards

### Security
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Column-level access control
- Audit logging

### Compliance
- GDPR compliance (data retention)
- SOX compliance (audit trail)
- Model Risk Management (SR 11-7)
EOF

# Create Bronze layer implementation
cat > src/data_engineering/bronze/ingestion.py << 'EOF'
"""
Bronze Layer - Raw Data Ingestion
"""
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class BronzeIngestion:
    """Ingest raw data into Bronze layer"""
    
    def __init__(self, storage_path: str):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
    
    def ingest_market_data(
        self, 
        data: pd.DataFrame, 
        source: str,
        metadata: Dict[str, Any] = None
    ) -> str:
        """
        Ingest market data into Bronze layer
        
        Args:
            data: Raw market data DataFrame
            source: Data source identifier (e.g., 'bloomberg', 'refinitiv')
            metadata: Additional metadata about the data
        
        Returns:
            str: Path to ingested data
        """
        ingestion_time = datetime.now()
        date_partition = ingestion_time.strftime('%Y-%m-%d')
        
        # Add audit columns
        data['_ingestion_time'] = ingestion_time
        data['_source'] = source
        data['_record_id'] = data.index
        
        # Create partition path
        partition_path = self.storage_path / 'market_data' / f'date={date_partition}' / f'source={source}'
        partition_path.mkdir(parents=True, exist_ok=True)
        
        # Save as Parquet
        file_path = partition_path / f'data_{ingestion_time.strftime("%H%M%S")}.parquet'
        data.to_parquet(file_path, engine='pyarrow', compression='snappy')
        
        # Save metadata
        if metadata:
            metadata_path = partition_path / f'metadata_{ingestion_time.strftime("%H%M%S")}.json'
            import json
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
        
        logger.info(f"Ingested {len(data)} records to {file_path}")
        return str(file_path)
    
    def ingest_trade_data(self, data: pd.DataFrame) -> str:
        """Ingest trade data"""
        return self.ingest_market_data(data, source='trade_repository')
    
    def ingest_model_artifacts(self, artifacts: Dict[str, Any], model_id: str) -> str:
        """Ingest model calibration artifacts"""
        ingestion_time = datetime.now()
        date_partition = ingestion_time.strftime('%Y-%m-%d')
        
        partition_path = self.storage_path / 'model_artifacts' / f'date={date_partition}' / f'model={model_id}'
        partition_path.mkdir(parents=True, exist_ok=True)
        
        file_path = partition_path / f'artifacts_{ingestion_time.strftime("%H%M%S")}.json'
        
        import json
        with open(file_path, 'w') as f:
            json.dump({
                'artifacts': artifacts,
                'ingestion_time': ingestion_time.isoformat(),
                'model_id': model_id
            }, f, indent=2)
        
        logger.info(f"Ingested model artifacts to {file_path}")
        return str(file_path)
EOF

# Create Silver layer implementation
cat > src/data_engineering/silver/cleansing.py << 'EOF'
"""
Silver Layer - Data Cleansing and Validation
"""
import pandas as pd
import numpy as np
from typing import Tuple, Dict, List
import logging

logger = logging.getLogger(__name__)

class SilverCleansing:
    """Clean and validate data for Silver layer"""
    
    def __init__(self):
        self.quality_metrics = {}
    
    def cleanse_market_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict]:
        """
        Cleanse market data with quality checks
        
        Args:
            df: Raw market data from Bronze layer
        
        Returns:
            Tuple of (cleansed_df, quality_metrics)
        """
        original_count = len(df)
        metrics = {
            'original_records': original_count,
            'timestamp': pd.Timestamp.now()
        }
        
        # Remove exact duplicates
        df = df.drop_duplicates()
        metrics['duplicates_removed'] = original_count - len(df)
        
        # Handle missing values
        missing_before = df.isnull().sum().sum()
        df = self._handle_missing_values(df)
        missing_after = df.isnull().sum().sum()
        metrics['nulls_handled'] = missing_before - missing_after
        
        # Detect and handle outliers
        df, outliers_count = self._handle_outliers(df)
        metrics['outliers_handled'] = outliers_count
        
        # Validate data types
        df = self._validate_types(df)
        
        # Add quality score
        df['_quality_score'] = self._calculate_quality_score(df)
        
        metrics['final_records'] = len(df)
        metrics['quality_pass_rate'] = (df['_quality_score'] >= 0.8).mean()
        
        logger.info(f"Cleansed {original_count} → {len(df)} records")
        return df, metrics
    
    def _handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values based on column type"""
        for col in df.columns:
            if df[col].dtype in ['float64', 'int64']:
                # Forward fill then backward fill for numeric
                df[col] = df[col].fillna(method='ffill').fillna(method='bfill')
            elif df[col].dtype == 'object':
                # Fill with 'UNKNOWN' for categorical
                df[col] = df[col].fillna('UNKNOWN')
        return df
    
    def _handle_outliers(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """Detect and cap outliers using IQR method"""
        outliers_count = 0
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if col.startswith('_'):  # Skip metadata columns
                continue
            
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - 3 * IQR
            upper_bound = Q3 + 3 * IQR
            
            outliers = ((df[col] < lower_bound) | (df[col] > upper_bound))
            outliers_count += outliers.sum()
            
            # Cap outliers instead of removing
            df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
        
        return df, outliers_count
    
    def _validate_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """Validate and convert data types"""
        # Convert date columns
        date_cols = [col for col in df.columns if 'date' in col.lower()]
        for col in date_cols:
            df[col] = pd.to_datetime(df[col], errors='coerce')
        
        return df
    
    def _calculate_quality_score(self, df: pd.DataFrame) -> pd.Series:
        """Calculate quality score for each record"""
        # Factors: completeness, validity, consistency
        completeness = 1 - (df.isnull().sum(axis=1) / len(df.columns))
        
        # Add more sophisticated quality measures here
        quality_score = completeness
        
        return quality_score
EOF

# Create Gold layer implementation
cat > src/data_engineering/gold/aggregation.py << 'EOF'
"""
Gold Layer - Aggregated Analytics-Ready Data
"""
import pandas as pd
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class GoldAggregation:
    """Aggregate data for Gold layer consumption"""
    
    def create_calibration_metrics(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create daily calibration metrics
        
        Args:
            df: Cleansed calibration data from Silver layer
        
        Returns:
            Aggregated calibration metrics
        """
        metrics = df.groupby(['date', 'currency', 'model']).agg({
            'calibration_error': ['mean', 'std', 'min', 'max'],
            'parameter_value': ['mean', 'std'],
            'iteration_count': 'mean',
            'convergence_time': 'mean'
        }).reset_index()
        
        # Flatten column names
        metrics.columns = ['_'.join(col).strip('_') for col in metrics.columns.values]
        
        # Add quality flags
        metrics['quality_flag'] = metrics['calibration_error_mean'].apply(
            lambda x: 'GREEN' if x < 1.0 else ('AMBER' if x < 2.0 else 'RED')
        )
        
        logger.info(f"Created calibration metrics: {len(metrics)} records")
        return metrics
    
    def create_validation_summary(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create validation test summary"""
        summary = df.groupby(['date', 'test_category']).agg({
            'test_id': 'count',
            'passed': 'sum',
            'execution_time': 'mean'
        }).reset_index()
        
        summary['pass_rate'] = summary['passed'] / summary['test_id']
        summary.rename(columns={'test_id': 'total_tests'}, inplace=True)
        
        return summary
    
    def create_pnl_attribution(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create P&L attribution summary"""
        attribution = df.groupby(['date', 'desk']).agg({
            'actual_pnl': 'sum',
            'delta_pnl': 'sum',
            'vega_pnl': 'sum',
            'gamma_pnl': 'sum',
            'theta_pnl': 'sum',
            'unexplained_pnl': 'sum'
        }).reset_index()
        
        attribution['attribution_ratio'] = (
            (attribution['actual_pnl'] - attribution['unexplained_pnl']) / 
            attribution['actual_pnl']
        )
        
        return attribution
EOF
```

### 5.2 Data Pipeline Orchestration

```bash
# Create Airflow DAG for data pipeline
mkdir -p src/data_engineering/orchestration/dags

cat > src/data_engineering/orchestration/dags/daily_data_pipeline.py << 'EOF'
"""
Daily Data Pipeline DAG
Bronze → Silver → Gold
"""
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import sys
sys.path.append('/opt/airflow/src')

default_args = {
    'owner': 'mobu_xval',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_data_pipeline',
    default_args=default_args,
    description='Daily Bronze → Silver → Gold pipeline',
    schedule_interval='0 1 * * *',  # 1 AM daily
    catchup=False,
    tags=['data-engineering', 'daily'],
)

def ingest_market_data(**context):
    """Ingest market data to Bronze layer"""
    from data_engineering.bronze.ingestion import BronzeIngestion
    
    ingestion = BronzeIngestion(storage_path='data/bronze')
    # Implement actual data fetching logic
    print(f"Ingesting market data for {context['ds']}")
    
    return "bronze_complete"

def cleanse_data(**context):
    """Cleanse data to Silver layer"""
    from data_engineering.silver.cleansing import SilverCleansing
    
    cleansing = SilverCleansing()
    # Implement cleansing logic
    print(f"Cleansing data for {context['ds']}")
    
    return "silver_complete"

def aggregate_data(**context):
    """Aggregate data to Gold layer"""
    from data_engineering.gold.aggregation import GoldAggregation
    
    aggregation = GoldAggregation()
    # Implement aggregation logic
    print(f"Aggregating data for {context['ds']}")
    
    return "gold_complete"

def publish_metrics(**context):
    """Publish data quality metrics"""
    print(f"Publishing metrics for {context['ds']}")
    return "metrics_published"

# Define tasks
task_ingest = PythonOperator(
    task_id='ingest_market_data',
    python_callable=ingest_market_data,
    dag=dag,
)

task_cleanse = PythonOperator(
    task_id='cleanse_data',
    python_callable=cleanse_data,
    dag=dag,
)

task_aggregate = PythonOperator(
    task_id='aggregate_data',
    python_callable=aggregate_data,
    dag=dag,
)

task_publish = PythonOperator(
    task_id='publish_metrics',
    python_callable=publish_metrics,
    dag=dag,
)

# Set dependencies
task_ingest >> task_cleanse >> task_aggregate >> task_publish
EOF
```

---

## 6. Backend Setup

### 6.1 API Endpoints

```bash
cat > src/api/routes/validation.py << 'EOF'
"""
Validation API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/api/v1/validation", tags=["validation"])

class ValidationTestResult(BaseModel):
    test_id: str
    test_name: str
    status: str
    metric_value: float
    threshold: float
    passed: bool
    execution_time_ms: int

class ValidationSummary(BaseModel):
    date: date
    total_tests: int
    passed: int
    failed: int
    pass_rate: float
    execution_time_ms: int

@router.get("/summary", response_model=ValidationSummary)
async def get_validation_summary(date: Optional[date] = None):
    """Get validation summary for a date"""
    # Implement actual logic
    return ValidationSummary(
        date=date or date.today(),
        total_tests=127,
        passed=127,
        failed=0,
        pass_rate=1.0,
        execution_time_ms=15120000
    )

@router.get("/tests", response_model=List[ValidationTestResult])
async def get_test_results(
    date: Optional[date] = None,
    category: Optional[str] = None
):
    """Get individual test results"""
    # Implement actual logic
    return []

@router.post("/run-test")
async def run_validation_test(test_id: str):
    """Trigger a specific validation test"""
    # Implement actual logic
    return {"status": "queued", "test_id": test_id}
EOF

cat > src/api/routes/degradation.py << 'EOF'
"""
Degradation Monitoring API Routes
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
from datetime import date

router = APIRouter(prefix="/api/v1/degradation", tags=["degradation"])

class DegradationMetric(BaseModel):
    metric_name: str
    current_value: float
    baseline_value: float
    status: str  # GREEN, AMBER, RED
    threshold: float

class DegradationAlert(BaseModel):
    alert_id: str
    timestamp: str
    severity: str
    message: str
    status: str
    action_taken: str

@router.get("/metrics", response_model=List[DegradationMetric])
async def get_degradation_metrics():
    """Get current degradation metrics"""
    return [
        DegradationMetric(
            metric_name="calibration_error",
            current_value=0.6,
            baseline_value=0.5,
            status="GREEN",
            threshold=1.0
        ),
        DegradationMetric(
            metric_name="pnl_attribution",
            current_value=94.1,
            baseline_value=95.3,
            status="GREEN",
            threshold=90.0
        )
    ]

@router.get("/alerts", response_model=List[DegradationAlert])
async def get_degradation_alerts(days: int = 7):
    """Get recent degradation alerts"""
    return []

@router.get("/health-score")
async def get_health_score():
    """Get overall model health score"""
    return {
        "health_score": 97.3,
        "status": "GREEN",
        "timestamp": "2026-09-04T10:00:00Z"
    }
EOF
```

---

## 7. Frontend Setup

See `validation_platform_demo/` for existing implementation.

For production React/Vue.js setup, create:

```bash
mkdir -p src/frontend
cd src/frontend

# Initialize React app (optional - for production)
# npx create-react-app mobu-xval-ui
# cd mobu-xval-ui
# npm install plotly.js react-plotly.js axios react-router-dom

# OR use existing HTML/JS demo
echo "Using existing demo in validation_platform_demo/"
```

---

## 8. Database Setup

### 8.1 Docker Compose for Databases

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: mobu_postgres
    environment:
      POSTGRES_DB: mobu_xval
      POSTGRES_USER: mobu_user
      POSTGRES_PASSWORD: changeme
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - mobu_network

  timescaledb:
    image: timescale/timescaledb:latest-pg15
    container_name: mobu_timescaledb
    environment:
      POSTGRES_DB: mobu_timeseries
      POSTGRES_USER: mobu_user
      POSTGRES_PASSWORD: changeme
    ports:
      - "5433:5432"
    volumes:
      - timescale_data:/var/lib/postgresql/data
    networks:
      - mobu_network

  redis:
    image: redis:7-alpine
    container_name: mobu_redis
    command: redis-server --requirepass changeme
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - mobu_network

  airflow-webserver:
    image: apache/airflow:2.7.1
    container_name: mobu_airflow
    environment:
      - AIRFLOW__CORE__EXECUTOR=LocalExecutor
      - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://mobu_user:changeme@postgres/airflow
      - AIRFLOW__CORE__LOAD_EXAMPLES=false
    volumes:
      - ./src/data_engineering/orchestration/dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./src:/opt/airflow/src
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - mobu_network
    command: webserver

volumes:
  postgres_data:
  timescale_data:
  redis_data:

networks:
  mobu_network:
    driver: bridge
EOF

# Create database initialization script
mkdir -p infrastructure/docker
cat > infrastructure/docker/init-db.sql << 'EOF'
-- Initialize MOBU_Xval databases

-- Create schemas
CREATE SCHEMA IF NOT EXISTS validation;
CREATE SCHEMA IF NOT EXISTS models;
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Validation results table
CREATE TABLE IF NOT EXISTS validation.test_results (
    test_id VARCHAR(100) PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    test_category VARCHAR(50),
    execution_date DATE NOT NULL,
    status VARCHAR(20),
    metric_value NUMERIC,
    threshold NUMERIC,
    passed BOOLEAN,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model artifacts table
CREATE TABLE IF NOT EXISTS models.artifacts (
    artifact_id VARCHAR(100) PRIMARY KEY,
    model_id VARCHAR(100) NOT NULL,
    artifact_type VARCHAR(50),
    version VARCHAR(20),
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(100),
    approval_date TIMESTAMP
);

-- Degradation metrics table
CREATE TABLE IF NOT EXISTS monitoring.degradation_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    baseline_value NUMERIC,
    threshold NUMERIC,
    status VARCHAR(20),
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_test_results_date ON validation.test_results(execution_date);
CREATE INDEX idx_test_results_status ON validation.test_results(status);
CREATE INDEX idx_artifacts_model ON models.artifacts(model_id);
CREATE INDEX idx_degradation_measured ON monitoring.degradation_metrics(measured_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA validation TO mobu_user;
GRANT ALL PRIVILEGES ON SCHEMA models TO mobu_user;
GRANT ALL PRIVILEGES ON SCHEMA monitoring TO mobu_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA validation TO mobu_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA models TO mobu_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA monitoring TO mobu_user;
EOF

# Start databases
docker-compose up -d postgres timescaledb redis

echo "✅ Databases started. Access:"
echo "   PostgreSQL:   localhost:5432"
echo "   TimescaleDB:  localhost:5433"
echo "   Redis:        localhost:6379"
```

---

## 9. GPU & Compute Setup

```bash
cat > docs/gpu_setup.md << 'EOF'
# GPU Setup for MOBU_Xval

## NVIDIA GPU Setup (Linux/WSL2)

### 1. Install NVIDIA Drivers
```bash
# Ubuntu
sudo ubuntu-drivers autoinstall
sudo reboot

# Verify installation
nvidia-smi
```

### 2. Install CUDA Toolkit
```bash
# CUDA 11.8
wget https://developer.download.nvidia.com/compute/cuda/11.8.0/local_installers/cuda_11.8.0_520.61.05_linux.run
sudo sh cuda_11.8.0_520.61.05_linux.run

# Add to PATH
echo 'export PATH=/usr/local/cuda-11.8/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-11.8/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
```

### 3. Install CuPy
```bash
pip install cupy-cuda11x
```

### 4. Verify Setup
```python
import cupy as cp
print(cp.cuda.Device(0).compute_capability)
```

## macOS (Apple Silicon)

macOS does not support CUDA. Use CPU or Metal Performance Shaders:
```bash
# Install with MPS support
pip install torch torchvision
```

## Docker with GPU Support

```yaml
# Add to docker-compose.yml
services:
  mobu-compute:
    image: nvidia/cuda:11.8.0-runtime-ubuntu22.04
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```
EOF
```

---

## 10. Testing Setup

```bash
# Create test configuration
cat > pytest.ini << 'EOF'
[pytest]
minversion = 7.0
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --cov=src
    --cov-report=html
    --cov-report=term-missing
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
    gpu: Tests requiring GPU
EOF

# Create sample tests
cat > tests/unit/test_calibration.py << 'EOF'
"""
Unit tests for calibration module
"""
import pytest
import numpy as np

def test_calibration_error_calculation():
    """Test calibration error calculation"""
    model_prices = np.array([100.0, 200.0])
    market_prices = np.array([100.1, 199.9])
    
    error = np.mean(np.abs(model_prices - market_prices))
    assert np.isclose(error, 0.1)

def test_parameter_validation():
    """Test parameter validation"""
    params = {'sigma': 0.2, 'kappa': 0.1}
    assert params['sigma'] > 0
    assert params['kappa'] > 0

@pytest.mark.slow
def test_monte_carlo_convergence():
    """Test Monte Carlo convergence"""
    # Simulate convergence test
    pass
EOF

# Run tests
pytest tests/ --cov=src --cov-report=html
```

---

## 11. CI/CD Setup

```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements-dev.txt
    
    - name: Lint with flake8
      run: |
        flake8 src --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 src --count --exit-zero --max-complexity=10 --max-line-length=88 --statistics
    
    - name: Type check with mypy
      run: mypy src
    
    - name: Test with pytest
      run: |
        pytest tests/ --cov=src --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t mobu-xval:latest .
    
    - name: Push to registry
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        docker tag mobu-xval:latest ${{ secrets.DOCKER_USERNAME }}/mobu-xval:latest
        docker push ${{ secrets.DOCKER_USERNAME }}/mobu-xval:latest
EOF
```

---

## 12. Deployment Setup

See dedicated deployment guides in `infrastructure/` folder.

Quick start:

```bash
# Build Docker image
docker build -t mobu-xval:latest .

# Deploy with Docker Compose
docker-compose up -d

# Or deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

---

## 13. Monitoring & Logging

```bash
# Add Prometheus metrics
cat > src/utils/metrics.py << 'EOF'
"""
Prometheus Metrics
"""
from prometheus_client import Counter, Histogram, Gauge

# Define metrics
validation_tests_total = Counter(
    'mobu_validation_tests_total',
    'Total number of validation tests run',
    ['test_category', 'status']
)

calibration_error = Gauge(
    'mobu_calibration_error',
    'Current calibration error in basis points',
    ['currency', 'model']
)

api_request_duration = Histogram(
    'mobu_api_request_duration_seconds',
    'API request duration',
    ['method', 'endpoint']
)
EOF
```

---

## 14. Security Setup

```bash
# Create security checklist
cat > docs/security_checklist.md << 'EOF'
# Security Setup Checklist

## Pre-Production
- [ ] Change all default passwords
- [ ] Generate strong API keys
- [ ] Set up SSL/TLS certificates
- [ ] Enable firewall rules
- [ ] Set up VPN for remote access
- [ ] Configure authentication (OAuth2/SAML)
- [ ] Enable audit logging
- [ ] Set up secrets management (Vault)

## Production
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Regular security scans
- [ ] Penetration testing
- [ ] Incident response plan
- [ ] Backup and disaster recovery
EOF
```

---

## 15. Collaboration Workflow

See `CONTRIBUTING.md` for detailed workflow.

Quick reference:

```bash
# Daily workflow
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
# Create PR on GitHub

# After approval, merge and clean up
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

---

## ✅ Setup Complete!

Your MOBU_Xval development environment is now fully configured.

**Next Steps:**
1. Start databases: `docker-compose up -d`
2. Run API: `python src/api/main.py`
3. Run tests: `pytest tests/`
4. Start demo: `cd validation_platform_demo && python -m http.server 8000`

**Questions?** See documentation in `docs/` or open an issue on GitHub.

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-04  
**Maintained by**: FedeAnalytics Team
