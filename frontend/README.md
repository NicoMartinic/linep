# To start the docker container for the frontend you need to take the following steps

# If you don't have docker/docker-compose you need to install it
* Docker for Linux:
    * https://docs.docker.com/engine/install/ubuntu/
* Docker for Windows:
    * https://docs.docker.com/desktop/install/windows-install/

# Next you need to open a terminal where the frontend folder is and execute the following commands 
# For example: C:\Users\nicom\OneDrive\Documents\GitHub\linep\linep-frontend>
* Copy and edit the `.env`:
    * Development: `cp .env-dev .env` <- Use this 
    * Production: `cp .env-prod .env`

* Execute docker-compose:
    * `sudo docker-compose build`
    * `sudo docker-compose up`

* Once that is done you can now access to `http://localhost:3000/` in your browser to see the project in your local machine
