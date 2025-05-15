#!/bin/sh

until pg_isready -h db -p 5432 -U library; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "PostgreSQL is ready!"