# Housie/Tambola/Bingo

A hosted version of the game 


## TicketMaker.js
The interesting bits of this are as follows:

**TicketMaker Rules**
 - Ticket has 3 rows, 9 columns and populated with 15 numbers between 1-90
 - Each row has maximum 5 numbers, each column has a minimum of 1 number
 - Column 0 (leftmost) has numbers 1-9, Column 1 has 10-19, Column 2 has 20-29 [...] and finally Column 8 has numbers 80-90
 
**TicketMaker Logic**
 - There are 126 patterns to choose from for each row represented as a combination of 5 1's (where a number exists) and 4 0's (blank space) e.g. 110001011 ==> Look-up table
 - Since each column has minimum 1 number (max is 3), the bit-wise OR of the binary patterns of all three rows should produce 111111111  ==> Bitwise-OR of numeric values to equal 511
 - Identify the three patterns that will be used to build the ticket: 
   * Get first pattern by random choice
   * Get second pattern get by random choice from remaining patterns
   * Iterate through third pattern choices to ensure that we get 511
 - For each column, a maximum of 3 numbers are needed
 - Ranges for Col 0 and Col 8 are different Col 0 ==> [1,9] Col 1 ==> [80, 90]
 - Within the same column, the numbers are ordered in an ascending order
 - Identify numbers per column
   * Shuffle an array containing [0-10] ==> Shuffle algorithm by Knuth / Fisher-Yates
   * Pick three numbers while filtering out invalid numbers (in Col 0 => 0,10; in Col 1-7 => 10)
   * Sort the selection
   * Populate number into the correct cell (if pattern has 1, use number, if pattern has 0, skip number)ng
 - A mechanism is needed to validate the ticket numbers in a quick and efficient manner
   * First we encode the cells (Row 1: 0-8 ==> abcdefghi Row 2: 9-17 ==> jklmnopqr and Row 3: 18-26 ==> stuvwxyzA), picking only the cells with a number in it
   * We then encode the number in the cell as follows: number%10 ==> 0-9 ==> BCDEF GHIJK unless number is 90. 90 is encoded as L
   * Finally we get the system date/time and pick out MON,DATE,HH,MM and use it as an index position to extract a letter from a 62 char long string consisting of a-z, A-Z, 0-9.
   * The string is constructed as concatenation of [Cell idx],[Cell number],...,[Cell idx][Cell number],[encoded MON,DATE,HH,MM], total 34 characters long
   * This string can be decoded to extract the actual ticket and a time stamp for validation   
 - For online version, a mechanism is need to ensure that ticket is not modified (to suit winning numbers) and produced within a certain window (can't be too old or new)
   * We create a server secret SALT (can be a long random string known only to the server)
   * We concatenate the ticket validator 34 char string with the SALT
   * We use a hash function e.g. sha3_256 (package: js-sha3) to get a hash string 
   * Finally, we use the last 6 characters from the hash, concatenate with the 34 char string and attach the 40-char string as a validator code for the ticket
   * When validating, the first 34 characters are used (along with server SALT) to compute a new hash and compare its last 6 chars with the last 6 of the validator string
     - if the 6-chars match, extremely likely ticket is not altered
     - then use the 34 chars to reconstruct the ticket and check against the completed board
     - timestamp tells us if the ticket is produced within a specific period of time
 
**Using it online as host**
 - Setup a server secret e.g. a 6-char string F3CEDF
   - For multiple rounds, setup more codes, but share one at a time only
 - Ask players to access <glitch-site>/index.html?b=F3CEDF 
 - The call will load a basic view, then route a GET request to <glitch-site>/ticket/:id where :id is the provided value for query variable 'b' (i.e. ?b=F3CEDF)
 - If the :id exists (i.e. is saved in the .env file), then a ticket is produced and sent as a JSON to the index.html page
 - The page will parse the JSON and populate the ticket on the user's browser
 - As host, load the '<glitch-site>/generator.html'
 - Click on the picture at the top of the page to draw a new number
   - To prevent accidental double clicks, new numbers are generated only after a 3-second delay post last generated number
 - To validate, request the ticket validator string from the user (40chars)
 - Paste into the validator section and press 'Validate'
   - If valid ticket, a ticket will be populated and will have all called out numbers marked



## Made by [Glitch](https://glitch.com/)

**Glitch** is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more [about Glitch](https://glitch.com/about).

( ᵔ ᴥ ᵔ )