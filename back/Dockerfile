FROM golang:latest as builder

WORKDIR /app

COPY . .

RUN go run github.com/steebchen/prisma-client-go db push
RUN go install
RUN go build -o main /app

FROM golang:latest as runner

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 3001

ENTRYPOINT [ "/app/main" ]