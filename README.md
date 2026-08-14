<div align="center">

[![PyPI version](https://badge.fury.io/py/tabbench.svg)](https://badge.fury.io/py/tabbench)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Website](https://img.shields.io/badge/website-neuralk.ai-%2345b69c)](https://www.neuralk-ai.com)

</div>

# TabBench

A tabular machine learning benchmark for industrial tasks.

**All documentation, leaderboards, datasets, and usage instructions are on the Hugging Face Space:**

## 👉 [huggingface.co/spaces/Neuralk-AI/TabBench](https://huggingface.co/spaces/Neuralk-AI/TabBench)

## Install

Clone the repo and use [uv](https://docs.astral.sh/uv/):

```bash
git clone https://github.com/Neuralk-AI/TabBench
cd TabBench
uv sync
```

## Usage

```bash
tabbench run --model xgboost
tabbench help
```

## Benchmarking your own model

`--model` takes either the name of a packaged baseline or a path to a yaml config.
A config names the class to instantiate and the parameters to pass it:

```yaml
model: my_classifier
target: my_package.models.MyClassifier
params:
  learning_rate: 0.01
```

`target` can point at any importable class following scikit-learn's classifier
contract — `fit(X, y)`, `predict(X)`, `predict_proba(X)`, and `classes_`. Most
tabular models already do, so no adapter is usually needed and nothing has to be
added to this repository.

Note that a config is executable: TabBench imports `target` and calls it. Treat one
from an untrusted source as you would a Python script.

## Citing TabBench

```bibtex
@article{neuralk2025tabench,
         title={TabBench: A Tabular Machine Learning Benchmark},
         author={Neuralk-AI},
         year={2025},
         publisher = {GitHub},
         howpublished = {\url{https://github.com/Neuralk-AI/TabBench}},
}
```

## Contact

Questions or feature requests: alex@neuralk-ai.com
Collaborations: antoine@neuralk-ai.com

License: [Apache 2.0](./LICENSE)
