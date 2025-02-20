# INAWS-Reviews-Livros 

## Descrição
O projeto **Reviews-Livros** é uma aplicação onde qualquer usuário pode adicionar livros e avaliá-los 

O projeto está sendo utilizado nas disciplinas de **Interface Homem-Máquina** e **Infraestrutura em Nuvem com AWS**.

### Autores
- [@pachecorodr](https://github.com/pachecorodr)

## Variáveis de Ambiente
Para rodar esse projeto localmente, você precisará adicionar as seguintes variáveis de ambiente no seu arquivo `.env`:

- `POSTGRES_H`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_PORT`

## Rodando Localmente

### 1. Clone o projeto
```bash
git clone https://github.com/pachecorodr/INAWS-Reviews-Livros.git 
```
### 2. Entre no diretório do projeto
```bash
cd INAWS-Reviews-Livros-api
```
### 3. Construa uma imagem a partir do docker-compose.yaml
```bash
docker-compose -f docker/docker-compose.yaml -p front_INAWS-Reviews-Livros up --build
```

## Relacionado 

Segue a API do projeto
