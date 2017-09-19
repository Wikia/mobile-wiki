/*
Temporary file needed for XW-3939
to be able to run ember serve
we can't have serve/server files/folders in root directory

We do have hardcoded path to server/app/server in chef repo though
so to enable us to be able to change name of the 'server' folder
I need to have a single file that would work for both cases
to be able to change that in chef repo
 */

require('./server/app/server');
