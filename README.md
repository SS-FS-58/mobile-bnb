# Commons #

The project is structured using frontend and backend directories.

## Installation Guide ##

Follow the instructions below in order to setup every part of the stack.

Setup the environment variables found in `frontend/.env` and  `backend/.env` by following the `.env.example` example of setting.

1) Create `.env` file in `backend` directory and do the following in frontend `directory`
2) Modify both files following this example:
```
...
REACT_APP_BACKEND_API_ENDPOINT_URL=http://localhost:8000
...
```

### Backend ###

Prerequisites for running the backend are `Python 3.x.y`, `PostgreSQL 12.4` and `Django` web framework.

To setup virtual environment for working with backend execute following two commands:
```sh
virtualenv env
source env/bin/activate
```

For installing latest `PostgreSQL` check the guide for your operating system [here](https://wiki.postgresql.org/wiki/Detailed_installation_guides#General_Linux).
You can check if the correct `PostgreSQL` version is running by executing following command:
```sh
psql --version
```

To install `Django` run the following command:
```sh
python -m pip install Django
```

To install middleware that is used by the backend run the following command:
```sh
pip install -r backend/requirements.txt
```

In order to setup database once you installed the latest `PostgreSQL` execute the following commands:
```sh
sudo su postgres -c psql
```
then create the user with
```
CREATE USER developer;
```
and development database with
```
CREATE DATABASE mobilebnb OWNER developer;
```

To create superuser using django run the following command:
```sh
python manage.py createsuperuser
```

For running migrations inside `backend` directory execute:
```sh
python manage.py makemigrations
```
then
```sh
python manage.py migrate
```

### Frontend ###

Prerequisites for running the backend are recent version of `Node.js` and React web framework

Once you are in the frontend directory run:
```sh
npm install
```

## Running Guide ##

Follow the instructions below in order to run the project.

### Backend ###

In order to run backend `cd backend` and run the following command:
```sh
python manage.py runserver
```

Visit `localhost:8000/ping` to check if backend works.

### Frontend ###
In order to run frontend `cd frontend` and run the following command:
```sh
npm start
```

Visit `localhost:3000` to view frontend.