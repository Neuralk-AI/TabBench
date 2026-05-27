<div align="center">

[![PyPI version](https://badge.fury.io/py/tabbench.svg)](https://badge.fury.io/py/tabbench)
[![Dashboard](https://img.shields.io/badge/dashboard-neuralk.ai-red)](https://dashboard.neuralk-ai.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Python Versions](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue)](https://www.neuralk-ai.com)
[![Website](https://img.shields.io/badge/website-neuralk.ai-%2345b69c)](https://www.neuralk-ai.com)

</div>

<div align="center">

[![Neuralk TabBench](https://raw.githubusercontent.com/Neuralk-AI/TabBench/main/assets/cover.png)](https://dashboard.neuralk-ai.com)

</div>

<h3 align="center">An open evaluation suite for tabular classification</h3>

<p align="center">
  <a href="https://dashboard.neuralk-ai.com"><strong>[Dashboard]</strong></a> •
  <a href="./tutorials/"><strong>[Tutorials]</strong></a>
</p>

---

<div align="center">

[![Neuralk OpenML](https://raw.githubusercontent.com/Neuralk-AI/TabBench/main/assets/openml_ranks.svg)](https://dashboard.neuralk-ai.com)

</div>


## 👋 Welcome to TabBench

**TabBench** is an open evaluation suite for tabular classification. It features **189 OpenML classification datasets** spanning healthcare, finance & insurance, industry & science, retail and behavioral data, computer vision, games & synthetic data, social and public-sector data, and other domains. Every dataset is filtered to be IID across rows.

It compares the entire current landscape of tabular models head-to-head: gradient-boosted trees, tuned deep tabular networks, and the new wave of pre-trained tabular **foundation models**.

Browse the results, leaderboard and analyses on the **[TabBench dashboard](https://dashboard.neuralk-ai.com)**.

### 👉 Benchmark features

- **Reproducible, standardized workflows** — consistent preprocessing, training and evaluation steps for fair model comparison.
- **Broad model coverage** — tree ensembles (XGBoost, CatBoost, LightGBM), tuned neural networks (RealMLP, TabM, ModernNCA) and tabular foundation models (TabPFN, TabPFN v3, TabICL, TabICL v2, TabDPT, Mitra, LimiX, Seldon).
- **Built on Neuralk Foundry** — the modular framework that powers each workflow. [Explore here](https://github.com/Neuralk-AI/NeuralkFoundry-CE/).

---

## 🛠️ How does TabBench work?

**TabBench** employs a modular approach to address various use cases. Each task is broken down into a sequence of steps, organized into a `Workflow`. Below is a visual representation of a TabBench Workflow for any given dataset and use case:

<div align="center">

[![Neuralk Workflow](https://raw.githubusercontent.com/Neuralk-AI/TabBench/main/assets/workflow.png)](https://dashboard.neuralk-ai.com)

</div>

The TabBench Workflow is divided into 4 main steps:
1.  **Load:** Loads the dataset and splits it into train/test folds.
2.  **Vectorize:** Performs the preprocessing required by the model family (ordinal encoding, scaling, learned embeddings, etc.).
3.  **Predict:** Trains the model on the train fold (or runs the in-context-learning forward pass for foundation models) and produces predictions on the test fold.
4.  **Evaluate:** Computes the suite of classification metrics (Accuracy, AUC, F1, Precision, Recall, Cross-entropy) on the test fold.

To get quickly started with a TabBench Workflow, you can jump straight into our example notebooks:

| File | Description                                             |
----------|---------------------------------------------------------|
| [1 - Getting Started with TabBench](tutorials/1%20-%20Getting%20Started%20with%20TabBench.ipynb)    | Discover how TabBench works and train your first tabular model on a Product Categorization task.
| [2 - Adding a local or internet dataset](tutorials/2%20-%20Adding%20a%20local%20or%20internet%20dataset.ipynb) | How to add your own datasets for evaluation (local, downloadable, or OpenML).
| [3 - Use a custom model](tutorials/3%20-%20Use%20a%20custom%20model.ipynb) |  How to integrate a new model in TabBench and use it on different use cases.
| [4 - Tackle the categorisation challenge](tutorials/Tackle%20the%20categorisation%20challenge.ipynb) |  A pipeline similar to our private task for you to train your model before submitting it.

## 🗂️ Datasets

The public benchmark base is a fixed list of **189 OpenML classification datasets**, defined in [`experiments/run_bench.py`](experiments/run_bench.py). It covers a wide range of sizes (~100 to ~100 000 rows), feature mixes (numeric, categorical, high-cardinality) and class counts (binary to multi-class).

## 📈 Experimental Evaluation

<div align="center">

[![Experimental Evaluation](https://raw.githubusercontent.com/Neuralk-AI/TabBench/main/assets/experimental_evaluation.png)](https://dashboard.neuralk-ai.com)

</div>

### 📊 Benchmark models

TabBench compares three families:

- **Tree ensembles**: XGBoost, CatBoost, LightGBM.
- **Tuned neural networks**: RealMLP, TabM, ModernNCA.
- **Tabular foundation models**: TabPFN, [TabPFN v3](https://www.nature.com/articles/s41586-024-08328-6), TabICL, TabICL v2, TabDPT, Mitra, LimiX, Seldon.

### Benchmarking procedure

TabBench focuses on classification. Performance is evaluated with a 5-fold stratified shuffle split; tuned models use 100 Optuna trials on a held-out validation fold. Preprocessing follows each model's recommended practice:

- **Foundation models** ship their own preprocessing pipelines, used as-is.
- **Tree ensembles** receive ordinal-encoded categorical features and unchanged numerical features.
- **Tuned neural networks** receive learned embeddings for categorical features and z-score normalized numerical features.

For the gradient-boosted families we report **ensemble** results: predictions averaged over the tuned configurations.

## ⚙️ Installation Guide

### Option 1: Quick Install via `pip`
Use this option if you just want to **run TabBench** or use it in your own pipelines without modifying its source code.

```bash
$ pip install tabbench
```

### Option 2: Clone the Repository (for development)
Use this option if you want to explore, modify, or contribute to the codebase, or run local notebooks and experiments.

```bash
git clone https://github.com/Neuralk-AI/TabBench
cd TabBench
```

It is recommended to build a custom environment. Example with `conda`:

```bash
conda create -n tabbench python=3.10
conda activate tabbench
```

Installing the packages in the conda environment (in editable mode):

```bash
pip install -e . 
```

## 🤿 Getting Deeper

For those who wish to understand the underlying mechanics, contribute to the development of the industry workflows, or build their own custom solutions, we encourage you to explore [**Neuralk Foundry**](https://github.com/Neuralk-AI/NeuralkFoundry-CE/). This is the modular framework that powers key aspects of TabBench. You can find the Neuralk Foundry repository and more detailed information [here](https://github.com/Neuralk-AI/NeuralkFoundry-CE/).

## Citing TabBench

If you incorporate any part of this repository into your work, please reference it using the following citation:

```bibtex
@article{neuralk2026tabbench,
         title={TabBench: An Open Evaluation Suite for Tabular Classification},
         author={Neuralk-AI},
         year={2026},
         publisher = {GitHub},
         howpublished = {\url{https://github.com/Neuralk-AI/TabBench}},
}
```

# Contact

If you have any questions or wish to propose new features please feel free to open an issue or contact us at alex@neuralk-ai.com.  

For collaborations please contact us at antoine@neuralk-ai.com.  
