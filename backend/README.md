# To start the docker container for the frontend you need to take the following steps

# If you don't have docker/docker-compose you need to install it
* Docker for Linux:
    * https://docs.docker.com/engine/install/ubuntu/
* Docker for Windows:
    * https://docs.docker.com/desktop/install/windows-install/

# Next you need to open a terminal where the frontend folder is and execute the following commands 
# For example: C:\Users\nicom\OneDrive\Documents\GitHub\linep\linep-backend>

* `cd linepsite/`

* Copy and edit the `.env`:
    * Development: `cp .env-dev .env` <- Use this 
    * Production: `cp .env-prod .env`

* Execute docker-compose:
    * `sudo docker-compose build` 
    * `sudo docker-compose up`

* Once the containers are up:
* On Linux:
    * `docker ps` #Search for the container id of the backend
    * `docker exec -it container_id bash` #Container_id is
    # Once inside the container
    * `python3 manage.py makemigrations backend`
    * `python3 manage.py migrate`

* Para crear datos iniciales en la db tirar en el browser el siguiente endpoint:
    * Para desarrollo con datos de prueba: `http://localhost:8001/init_db/?create_testing_data=true`
    * Para produccion sin datos de prueba: `http://localhost:8001/init_db/`
    * Para actualizar los modulos: `http://localhost:8001/init_db/?update_modules=true`

* Para reiniciar la BD:
    * `docker exec -it container_id bash`
    * `python3 manage.py flush`
    * `python3 manage.py migrate backend zero`
    * `python3 manage.py sqlsequencereset backend`

* Ejecutar docker-compose para el pgadmin:
    * docker run -p 8111:80 \
     -e 'PGADMIN_DEFAULT_EMAIL=admin@admin.com' \
     -e 'PGADMIN_DEFAULT_PASSWORD=admin' \
     -d dpage/pgadmin4

* Ejecutar las instrucciones del archivo queries en algún cliente de SQL, en nuestro caso PGadmin:

    * Click dercho en servers > register > server
    * En name nombre del proyecto `linep`
    * En las pestaña de Connection:
        * Hostname: Ip
        * Port: 5432
        * Username: postgres
        * Password: postgres

    * Click en boton Save y se va a abrir una base de datos que dice linep

    * Cambiar nombre de schema lineptest a linep

    * linep > linep > Schemas > Tables(Click derecho > Query tool) y pegamos el contenido que se encuentra en el archivo linepsite/queries, ahora CTRL+A y despues F5

    * Estas queries que se ejecutan en la base de datos pueden tardar varios minutos

* Una vez que termina el proceso de ejecución de las queries en PGadmin:
    * `docker exec -it linep-backend /code/manage.py migrate`
    * Si es la primera vez se debe crear el superuser para poder acceder al panel de administración de Django
    *  `docker exec -it linep-backend /code/manage.py createsuperuser`
    * `docker exec -it linep-backend /code/manage.py collectstatic`

* Una vez ejecutado esos pasos, acceder a `http://localhost:8001/`. Allí se listarán los endpoints de los modelos de nuestro backend.

* Para debuggear:
    * Levantar backend con config de `.env-dev` (el comando usa debugpy para levantar uvicorn)
    * CADUCADO PERO LO DEJO POR LAS DUDAS: Para poner un breakpoint en cualquier parte del codigo usar: `breakpoint()`
    * Desde el vscode ir al menu para debug e iniciar el debugger cliente
    * Para poner un breakpoint usar los puntitos rojos de vscode
