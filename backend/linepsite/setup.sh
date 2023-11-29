#!/bin/bash

# Execute command and automatically answer 'yes' when prompted
python3 manage.py makemigrations backend
yes | python3 manage.py migrate