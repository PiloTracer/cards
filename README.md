# Cards – employee e-card generator



########################################
# pull base images + start stack
docker compose up -d --build

# watch logs (Ctrl-C to quit)
docker compose logs -f --tail 50

# open in browser
Start-Process http://localhost:3000
Start-Process http://localhost:8000/docs   # Swagger UI

########################################
# psql into the db container
docker compose exec db psql -U cards -d cards

# bash inside backend
docker compose exec backend bash



########################################
# run migrations in /app
alembic revision --autogenerate -m "init-tables"
alembic upgrade head

alembic revision --autogenerate -m "fix user-company cicled"
alembic upgrade head
