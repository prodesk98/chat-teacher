FROM python:3.12-slim-bullseye

RUN apt-get update && apt-get install -y curl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -Ls https://astral.sh/uv/install.sh | bash

ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

COPY . ./

CMD ["uv", "run", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]