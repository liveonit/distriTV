#!/usr/bin/env bash
ROOT=$(dirname $(readlink -f $(which "$0")))
source $ROOT/../commons/print.sh

# @cmd Returns the information about how to run the cli.
usage() {
  tee <<-EOF
Development commands

USAGE:
    distri dev <SUBCOMMAND>

OPTIONS:
    -h, --help    Print help information

COMMANDS:
    up             Run all the services in the local environmnet using docker compose.
    down           Stop all the services in the local environmnet keeping the database and storage data.
    setup          (Re)build and run all services in the local environment usign docker compose.
    destroy        Destroy all the services, removing the database data and the files in the storage.
    logs           Show the logs of specific service or a mix of all servies logs.
    rebuild        Rebuild and restart an specific service.
EOF
}

if ! command -v docker &> /dev/null
then
    echo `red "Docker is not installed and it's required to run the local environmnet. Instalation instructions"`
    exit 1
fi

compose_comand=
if docker-compose --version &> /dev/null; then
    compose_comand="docker-compose"
elif docker compose --version &> /dev/null; then
    compose_comand="docker compose"
else
    echo `red "Docker is not installed and it's required to run the local environmnet. Instalation instructions"`
    exit 1
fi



show_logs() {
  flags=
  read -r -d '' services << EOF
all
$(cd $ROOT/../../ && eval "$compose_comand ps" | awk '{print $1}' | tail -n+2)
EOF
  service=$(echo "$services" | gum choose --limit 1)
  gum confirm "Do you want to follow the logs?" && flags+="-f"
  if [ "$service" == "all" ]; then
    cd $ROOT/../../ && eval "$compose_comand logs $flags"
  else
    cd $ROOT/../../ && docker logs $flags $service
  fi
}

rebuild_service() {
  service=$(eval "$compose_comand ps --services" | gum choose --limit 1)
  if [ -z "$service" ]; then
    echo `red "The service should be running and choosing one of them is required"`
    exit 1
  fi
  eval "$compose_comand  up -d --build --force-recreate $service"
}

case $1 in
  up)
    shift
    cd $ROOT/../../ && eval "$compose_comand up -d"
    exit 0
    ;;
  down)
    shift
    cd $ROOT/../../ && eval "$compose_comand down"
    exit 0
    ;;
  setup)
    shift
    cd $ROOT/../../ && eval "$compose_comand up -d --build --force-recreate"
    exit 0
    ;;
  destroy)
    shift
    cd $ROOT/../../ && eval "$compose_comand down -v --rmi 'all'"
    exit 0
    ;;
  logs)
    shift
    show_logs
    exit 0
    ;;
  rebuild)
    shift
    rebuild_service
    exit 0
    ;;
  *)
    shift
    usage
    exit 0
esac


