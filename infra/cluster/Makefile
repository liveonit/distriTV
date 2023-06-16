vagrant_deploy:
	vagrant up
	cd playbook && docker run --rm -it -v $(shell pwd)/playbook:/playbooks  -v $(shell pwd)/ssh-key:/playbooks/ssh-key -w /playbooks liveonit/nwtools ansible-playbook -i inventory.yml playbook.yml

vagrant_tear_down:
	vagrant destroy -f

kubectl_config: export KUBECONFIG = $(shell pwd)/playbook/cluster_config

get_all_pods_example:
	kubectl --kubeconfig=./kubectl-config/kubeadminconfig get pods -o wide --all-namespaces
