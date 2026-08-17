"""tabbench: run a model against the TabBench benchmark.

Usage: tabbench --model <baseline-name-or-config-path>

  --model MODEL   Name of a packaged baseline or a path to a custom model's
                  yaml config. Required.

Fits and evaluates the model on every dataset in openml.yaml, then writes
metrics and predictions to out/. A custom model's yaml config needs a
`target` (dotted path to a sklearn-compatible estimator class), `requires_cuda`
(bool), and `params` (kwargs passed to its constructor) — see
src/tabbench/engine/models/*/config.yaml for examples.
"""

import argparse
import sys

from tabbench import run


def main() -> None:
    if "-h" in sys.argv[1:] or "--help" in sys.argv[1:]:
        print(__doc__)
        sys.exit(0)

    parser = argparse.ArgumentParser(prog="tabbench", add_help=False)
    run.add_arguments(parser)
    args = parser.parse_args()
    run.main(model=args.model)


if __name__ == "__main__":
    main()
