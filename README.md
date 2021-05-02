To run this project you'll need to create a virtual environment (venv):
Please note, that these commands are for Linux environment. 

python3 -m venv venv
source venv/bin/activate


Then you'll need to install Flask and python-dotenv

pip install flask python-dotenv

Now in venv you can check that backend (api.py) is running well:

flask run

You can stop the server by pressing Ctrl-c

To start the frontend, open the terminal and type the following command:

yarn start

To start the backend, open the second terminal and type the followinf command:

yarn start-api
