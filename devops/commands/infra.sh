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
    vargrant-k8s-up                  Deploy the k8s cluster using vagrant and virtualbox.
    vagrant-k8s-down                 Destroy the k8s cluster including all the data.
    config-kubectl-vagrant-context   Configure kubectl to use the vagrant k8s cluster credentials.
EOF
}

case $1 in
  vagrant-k8s-up)
    shift
    cd $ROOT/../../infra/k8s-cluster && vagrant up
	  docker run --rm -it -v $ROOT/../../infra/k8s-cluster/playbook:/playbooks -v $ROOT/../../infra/k8s-cluster/ssh-key:/playbooks/ssh-key -w /playbooks liveonit/nwtools ansible-playbook -i inventory.yml playbook.yml
    exit 0
    ;;
  vagrant-k8s-down)
    shift
    cd $ROOT/../../infra/k8s-cluster && vagrant destroy -f
    exit 0
    ;;
  config-kubectl-vagrant-context)
    shift
    kubectl config set-context distri-vagrant --kubeconfig="$ROOT/../../infra/k8s-cluster/playbook/cluster_config"
    # Make a copy of your existing config
    cp ~/.kube/config ~/.kube/config.bak
    # Merge the two config files together into a new config file
    KUBECONFIG=~/.kube/config:$ROOT/../../infra/k8s-cluster/playbook/cluster_config kubectl config view --flatten > /tmp/config
    # Replace your old config with the new merged config
    mv /tmp/config ~/.kube/config
    kubectl config use-context distri-vagrant
    exit 0
    ;;
  create-ssh-key)
    shift
    cd $ROOT/../../infra/k8s-cluster && ssh-keygen -b 2048 -t rsa -f ssh-key -q -N ""
    exit 0
    ;;
  *)
    shift
    usage
    exit 0
esac
