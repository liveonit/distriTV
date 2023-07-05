#!/usr/bin/env bash
ROOT=$(dirname $(readlink -f $(which "$0")))
source $ROOT/../commons/print.sh

# @cmd Returns the information about how to run the cli.
usage() {
  tee <<-EOF
Development commands

USAGE:
    distri minikube <SUBCOMMAND>

OPTIONS:
    -h, --help    Print help information

COMMANDS:
    up             Run all the services in the local environmnet using minikube.
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

if minikube -h &> /dev/null; then
    echo `green "Minikube is installed"`
else
    echo `red "Minikube is not installed and it's required to run the local environmnet. Instalation instructions"`
    exit 1
fi

case $1 in
  up)
    shift
    cd $ROOT/../../ && minikube start --disk-size=40g --extra-disks=1 --driver kvm2
    exit 0
    ;;
  down)
    shift
    cd $ROOT/../../ && minikube delete
    exit 0
    ;;
  setup)
    shift
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f crds.yaml -f common.yaml -f operator.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f cluster-test.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f object-test.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl create -f toolbox.yaml
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


