import argparse

from tabbench import run


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="tabbench")
    subparsers = parser.add_subparsers(dest="command")

    run_parser = subparsers.add_parser("run", help="Run a model against the benchmark.")
    run.add_arguments(run_parser)

    subparsers.add_parser("help", help="Show the run command's help.")

    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    if args.command == "run":
        run.main(
            model=args.model,
            test_size=args.test_size,
            seed=args.seed,
            stratify=args.stratify,
        )
    else:
        parser.parse_args(["run", "--help"])


if __name__ == "__main__":
    main()
