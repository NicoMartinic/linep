FROM python:3.10.6
    
ENV PYTHONUNBUFFERED=1

WORKDIR /code/

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools18 && \
    ACCEPT_EULA=Y apt-get install -y unixodbc-dev

COPY . /code/

RUN pip install -r requirements.txt