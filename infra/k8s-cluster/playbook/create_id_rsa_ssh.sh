#!/bin/bash

# generate ssh key
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
	echo "Generating private key"
	echo -e 'y\n'|ssh-keygen -q -t rsa -f "$HOME/.ssh/id_rsa" -C "" -N ""
else
	echo "Private key exists, skipping..."
fi


