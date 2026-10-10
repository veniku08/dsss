#!/bin/bash
echo "Iniciando MOTUS Mock Server en puerto 3000..."
npx json-server --watch db.json --routes routes.json --port 3000

