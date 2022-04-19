# Task 2

### Start a docker container for a redis client:

1. build on a chosen redis image `redis`

2. with the client insert some user info where key is the person name, and value is the address.

To complete this task we have to create a docker container which will be connected to the server created in the first task, for this we have to execute `docker run -it --link redis_server:redis --name redis_client redis sh`, then to enter data we have to run `redis-cli -h redis` and we will be able to insert some data.![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-12-11-23-16-image.png)

Now I'm going to introduce the next key value pair "John" "Thakurova 9, 160 00, Prague" with the set instrucction`set John "Thakurova 9, 160 00, Prague"`, and we will verify that everything has been added correctly by going to the *__redis_server__* and execute `get John` and we should recive John's address.

![Captura3.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\04\screenshots\Captura3.PNG)




