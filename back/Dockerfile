FROM golang:latest as builder

# ENV DATABASE_URL="postgres://admin:adminpwd@postgresdb:5432/db?schema=public"

WORKDIR /app

COPY . .

# RUN go run github.com/steebchen/prisma-client-go db push
RUN go install
RUN go build -o main /app

FROM golang:latest as runner

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 3001

ENTRYPOINT [ "/app/main" ]