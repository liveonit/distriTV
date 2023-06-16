#!/usr/bin/env bash

ROOT=$(dirname $(readlink -f $(which "$0")))
source $ROOT/commons/print.sh

# @cmd Returns the information about how to run the cli.
usage() {
  tee <<-EOF
DistriTV DevOps CLI

USAGE:
    distri <COMMAND> <SUBCOMMAND> [OPTIONS]

OPTIONS:
    -h, --help    Print help information

COMMANDS:
    infra                     Run or deploy the base hardware/software in an On Premises environment. [alias: i]
    dev                       Set of commands to run the project on the local development environmnet. [alias: d]
    services                  Deploy services to specific environment. [alias: s]
EOF
}

case $1 in
  i|infra)
    shift
    "$ROOT/commands/infra.sh" "$@"
    exit 0
    ;;
  d|dev)
    shift
    "$ROOT/commands/dev.sh" "$@"
    exit 0
    ;;
  s|services)
    shift
    "$ROOT/commands/services.sh" "$@"
    exit 0
    ;;
  *)
    shift
    usage
    exit 0
esac
