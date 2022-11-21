#!/bin/bash
sleep 14d;
docker-compose -f prod.landing.docker-compose.yml down;
rm -- "$0";
exit;