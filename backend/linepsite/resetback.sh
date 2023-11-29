#!/bin/bash

# Execute command and automatically answer 'yes' when prompted
yes | python3 manage.py flush
yes | python3 manage.py migrate backend zero
yes | python3 manage.py sqlsequencereset backend