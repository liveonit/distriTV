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
    cd $ROOT/../../ && minikube start --memory=16384 --cpus=8 --disk-size=40g --extra-disks=1 --driver kvm2
    cd $ROOT/../../ && minikube addons enable metrics-server
    exit 0
    ;;
  down)
    shift
    cd $ROOT/../../ && minikube delete
    exit 0
    ;;
  setup)
    shift
    source "$ROOT/../../.env"
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f crds.yaml -f common.yaml -f operator.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f cluster-test.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl apply -f object-test.yaml
    cd $ROOT/../../infra/deployments/rook-manifests && kubectl create -f toolbox.yaml
    cd $ROOT/../../infra/deployments/percona-manifests && kubectl apply -f bundle.yaml
    cd $ROOT/../../infra/deployments/percona-manifests && kubectl apply -f cr-minimal.yaml
    helm repo add bitnami https://charts.bitnami.com/bitnami
    cd $ROOT/../../infra/deployments/redis && helm install redis bitnami/redis --values values.yml

    for i in {0..10}; do
      echo `yellow "Witing for db connection, retry: $i"`

      PERCONA_DB_ROOT_PASSWORD=`kubectl get secrets minimal-cluster-secrets -ojson | jq -r .data.root | base64 -d`
      if kubectl run -it --rm percona-client --image=percona:8.0 --restart=Never -- mysqladmin ping -hminimal-cluster-haproxy -uroot -p"$PERCONA_DB_ROOT_PASSWORD" | grep "mysqld is alive"; then
        echo `green "DB is alive"`
        echo `blue "Creating API database"`
        kubectl run -it --rm percona-client --image=percona:8.0 --restart=Never -- mysql -hminimal-cluster-haproxy -uroot -p"$PERCONA_DB_ROOT_PASSWORD" -e "CREATE DATABASE $DB_NAME";
        echo `blue "Creating DB API user"`
        kubectl run -it --rm percona-client --image=percona:8.0 --restart=Never -- mysql -hminimal-cluster-haproxy -uroot -p"$PERCONA_DB_ROOT_PASSWORD" -e "CREATE USER '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD'";
        echo `blue "Giving permissions to API user on API database"`
        kubectl run -it --rm percona-client --image=percona:8.0 --restart=Never -- mysql -hminimal-cluster-haproxy -uroot -p"$PERCONA_DB_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%'";
        echo `blue "Applying privilege changes"`
        kubectl run -it --rm percona-client --image=percona:8.0 --restart=Never -- mysql -hminimal-cluster-haproxy -uroot -p"$PERCONA_DB_ROOT_PASSWORD" -e "FLUSH PRIVILEGES";
        break
      fi
      sleep 6
    done
    for i in {0..10}; do
      echo `yellow "Witing for storage connection, retry: $i"`

      if ! kubectl -n rook-ceph run -it --rm --env="AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" --env="AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" nwtools --image=liveonit/nwtools --restart=Never -- bash -c "aws --endpoint-url=http://rook-ceph-rgw-distritv s3 ls" | grep "Could not connect to the endpoint URL"; then
        echo `green "DB is alive"`
        echo `blue "Creating storage user"`
        kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin user create --uid="distritv_user" --display-name="distritv"
        AWS_ACCESS_KEY_ID=`kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin user info --uid=distritv_user | jq -r '.keys[0].access_key' | sed 's/ *$//g'`
        AWS_SECRET_ACCESS_KEY=`kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin user info --uid=distritv_user | jq -r '.keys[0].secret_key' | sed 's/ *$//g'`
        echo `blue "Creating API bucket"`
        kubectl -n rook-ceph run -it --rm --env="AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" --env="AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" nwtools --image=liveonit/nwtools --restart=Never -- bash -c "aws --endpoint-url=http://rook-ceph-rgw-distritv s3api create-bucket --bucket distritv"
        echo `blue "Creating ceph-credentials secret with storage credentials"`
        kubectl create secret generic ceph-credentials --from-literal=awsAccessKeyId=$AWS_ACCESS_KEY_ID --from-literal=awsSecretAccessKey=$AWS_SECRET_ACCESS_KEY
        break;
      fi
      sleep 6
    done
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


