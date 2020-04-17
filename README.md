Pretty much just a school project

Currently, the client tries to connect to localhost on port 8080, mostly for demonstration purpouses. If you run the server client on an actual server just replace 'http://localhost:8080'in line 2 of the client script with the address of your server.

To run the client program once the repo has been downloaded, navigate to ./*program_name*/client/ and type "npm install" into the console to download and install all the necessary modules (this only needs to be done once). Then type "npm run start" to actually run the program.

To run the server program once the repo has been downloaded navigate to ./*program name*/server/ and type "npm install" into the console to download and install all the necessary modules (again, only needs to be done once). Next, type "npm run keygen" to generate servers public and private keys. (Unlike the clients RSA keys, which are generated each time the program is ran, servers keys are only generated once and kept in a file, which optimizes launch time of the server, as generating keys takes longer than just reading them from a file). After the keys are generated type "npm run start" to run the server program.

Currently, there is no exit function/button, so use "CTRL + C" to stop the either script once you're done using them.
