# To start the docker container for the frontend you need to take the following steps

# If you don't have docker/docker-compose you need to install it
* Docker for Linux:
    * https://docs.docker.com/engine/install/ubuntu/
* Docker for Windows:
    * https://docs.docker.com/desktop/install/windows-install/

# Next you need to open a terminal where the project folder is and execute the following commands 
# For example: C:\Users\nicom\OneDrive\Documents\GitHub\linep>

* Execute docker-compose:
    * `docker-compose build` 
    * `docker-compose up -d`

* Once the containers are up we need to make the migrations:
* On the terminal:
    * `docker exec -it backend bash` 
    * `python3 manage.py makemigrations app`
    * `python3 manage.py migrate`

* If we want to create some testing data we need to go to this endpoint in your browser:
    * Testing data: `http://localhost:8001/init_db/?create_testing_data=true`
    * If you want only to update the modules: `http://localhost:8001/init_db/?update_modules=true`

* Once that is done you can now access to `http://localhost:3000/` in your browser to see the project in your local machine

* To reset database:
    * `docker exec -it backend bash`
    * `python3 manage.py flush`
    * `python3 manage.py migrate app zero`
    * `python3 manage.py sqlsequencereset app`

* You can access `http://localhost:8001/` where there will be listed all the endpoints of the backend.

