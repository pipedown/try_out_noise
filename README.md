# try_out_noise
Demo to let users try out Noise queries in the browser

You can set the following environment variables:

 - `NOISE_QUERY_INDEXES` (default: 4): Number of indexes that are opened for querying. This is also the number of queries that can run in parallel.
 - `NOISE_MAX_WAITING_CLIENTS` (default: 10): Number of clients that will be queued up before they return with an error.
 - `NOISE_ACQUIRE_TIMEOUT` (default: 5000): The time in milliseconds that will be be tried to acquire an index to query on. This is for the waiting clients.
