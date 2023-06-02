# Pokedex Backend API

## About this Project

Information about all pokemons.

## Why
_"a local pokemon API for you to build your front end"_

I wanted a way to build my front end without having to use [Pokeapi](https://pokeapi.co), one day I had this thought "will they ever discontinue the project?" so I decided to do some web scraping and have something of my own.

**So here is!**

## Functionalities

- You can get information such as name, images, skills, types, number in pokedex, status.
- Get a list of pokemons and choose how many pokemons you want to jump or how many you want to catch.
- Get a single pokemon.
- Add new pokemons.
- Updated a pokemon.
- Delete a pokemon.
- Get a list of skills.
- Get a single ability, which also brings up a list of all the pokemons that have it.
- Get a list of types.
- Get a single type, which also brinks up a list of all the pokemons that have it.

## Getting Started

### Prerequisites

If you have Docker the first installation process we will use it. If you don't have it i'll leave a tutorial [here](https://github.com/codeedu/wsl2-docker-quickstart) that works for both windows and linux, if you are on a mac the tutorial is [here](https://docs.docker.com/desktop/install/mac-install/). If you don't want to download Docker, below we also have the installation process without the use of Docker.

**That said, let's go!**

### Istalling with Docker

**Cloning the Repository**

```
$ git clone https://github.com/Wesleyfbarretos/backend-DEX.git

$ cd backend-DEX
```

**.env file**

Now you just have to create an .env at the root of project and give value to the environment variables.
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
```

**Docker CLI**

Now you just need to type the following command in the project's root terminal and the project will be running on the http://localhost:8080/pokemon port.

```
docker compose up
```

**PS:** It may take some time, because when the container goes up, a lot of information will be entered into the database.
