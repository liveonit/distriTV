#!/usr/bin/env bash

ROOT=$(dirname $(readlink -f $(which "$0")))
source $ROOT/../commons/print.sh

# @cmd Returns the information about how to run the cli.
usage() {
  tee <<-EOF
DistriTV DevOps CLI

USAGE:
    distri infra <SUBCOMMAND> [OPTIONS]

OPTIONS:
    -h, --help    Print help information

COMMANDS:
    create-ssh-key                   Create ssh-key to install in the VMs and connect to them.
    vargrant-up                      Deploy the cluster using vagrant and virtualbox.
    vagrant-down                     Destroy the cluster including all the data.
    config-kubectl-vagrant-context   Configure kubectl to use the vagrant cluster credentials.
EOF
}

case $1 in
  vagrant-up)
    shift
    cd $ROOT/../../infra/cluster && vagrant up
	  docker run --rm -it -v $ROOT/../../infra/cluster/playbook:/playbooks -v $ROOT/../../infra/cluster/ssh-key:/playbooks/ssh-key -w /playbooks liveonit/nwtools ansible-playbook -i inventory.yml playbook.yml
    exit 0
    ;;
  vagrant-down)
    shift
    cd $ROOT/../../infra/cluster && vagrant destroy -f
    exit 0
    ;;
  config-kubectl-vagrant-context)
    shift
    kubectl config set-context distri-vagrant --kubeconfig="$ROOT/../../infra/cluster/playbook/cluster_config"
    # Make a copy of your existing config
    cp ~/.kube/config ~/.kube/config.bak
    # Merge the two config files together into a new config file
    KUBECONFIG=~/.kube/config:$ROOT/../../infra/cluster/playbook/cluster_config kubectl config view --flatten > /tmp/config
    # Replace your old config with the new merged config
    mv /tmp/config ~/.kube/config
    kubectl config use-context distri-vagrant
    exit 0
    ;;
  create-ssh-key)
    shift
    cd $ROOT/../../infra/cluster && ssh-keygen -b 2048 -t rsa -f ssh-key -q -N ""
    exit 0
    ;;
  *)
    shift
    usage
    exit 0
esac
