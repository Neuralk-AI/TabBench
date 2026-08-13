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

```bash
pip install tabbench
```

For development, clone the repo and use [uv](https://docs.astral.sh/uv/):

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
