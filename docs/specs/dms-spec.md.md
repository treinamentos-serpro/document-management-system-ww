# Especificação - Document Management System

## 1. Objetivo

O sistema deve permitir que usuários enviem, listem e baixem documentos de forma simples, segura e local, mantendo os arquivos no filesystem da aplicação e os metadados em memória durante esta fase inicial.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário
- Armazenamento local dos arquivos com multer e diskStorage
- Separação da aplicação em camadas de backend e frontend

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Compartilhamento público por link
- Controle avançado de permissões e papéis
- Busca textual por conteúdo do arquivo
- OCR, assinatura digital ou indexação semântica
- Backup automatizado de arquivos e metadados
- Sincronização multiinstância

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o upload de um documento enviado por um usuário ou pelo contexto da aplicação. |
| RF-02 | O sistema deve validar que o arquivo foi recebido corretamente antes de salvar o documento. |
| RF-03 | O sistema deve gerar um identificador único para cada documento enviado. |
| RF-04 | O sistema deve armazenar o arquivo no filesystem local da aplicação, preservando o nome original em metadados. |
| RF-05 | O sistema deve registrar metadados do documento, incluindo identificador, nome original, tamanho, data de upload e proprietário. |
| RF-06 | O sistema deve listar todos os documentos recebidos, retornando seus metadados em ordem de criação. |
| RF-07 | O sistema deve permitir a recuperação de um documento específico pelo identificador. |
| RF-08 | O sistema deve disponibilizar o download do arquivo original armazenado localmente. |
| RF-09 | O sistema deve retornar erro claro quando um documento solicitado não existir. |
| RF-10 | O sistema deve rejeitar requisições inválidas, como upload sem arquivo ou identificador inexistente. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados no filesystem local da aplicação utilizando multer com diskStorage. |
| RNF-02 | Os metadados dos documentos devem ser mantidos em memória durante esta fase. |
| RNF-03 | A aplicação deve ser configurável por variáveis de ambiente, seguindo o princípio 12-Factor. |
| RNF-04 | O backend deve expor endpoints simples e previsíveis, com respostas em JSON para metadados e fluxo binário para download. |
| RNF-05 | A solução deve ser implementada com boa separação de responsabilidades para facilitar manutenção e evolução futura. |
| RNF-06 | A interface frontend deve consumir a API via fetch e seguir a arquitetura baseada em componentes. |
| RNF-07 | O sistema deve tratar falhas de leitura, arquivo inexistente e entrada inválida de forma controlada. |

## 5. Modelo de dados

### Entidade Documento

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | string | Sim | Identificador único do documento. |
| originalName | string | Sim | Nome original do arquivo no momento do upload. |
| storedName | string | Sim | Nome do arquivo salvo no filesystem local. |
| size | number | Sim | Tamanho em bytes do arquivo. |
| uploadedAt | string | Sim | Data e hora do upload em formato ISO 8601. |
| owner | string | Sim | Identificador do usuário ou proprietário do documento. |
| mimeType | string | Não | Tipo de conteúdo do arquivo, quando disponível. |
| filePath | string | Sim | Caminho local da cópia física no armazenamento. |

### Observações do modelo

- O modelo de dados foi definido para atender à fase inicial do projeto.
- O armazenamento físico do documento fica em backend/storage.
- Os metadados ficam em memória, o que torna o sistema simples, porém não persistente entre reinicializações.
- O campo owner representa o “dono” do arquivo e pode ser expandido no futuro para autenticação e autorização.

## 6. Contratos de API

### 6.1. Endpoint: POST /upload

Descrição: recebe um arquivo no corpo da requisição e cria um novo documento.

#### Requisição

- Método: POST
- Content-Type: multipart/form-data
- Campos:
  - file: arquivo enviado pelo cliente
  - owner: opcional, dependendo da estratégia de identificação do usuário

#### Resposta de sucesso

- Status: 201 Created
- Content-Type: application/json

Exemplo:

```json
{
  "id": "doc_123",
  "originalName": "relatorio.pdf",
  "storedName": "relatorio_2026-09-01.pdf",
  "size": 245671,
  "uploadedAt": "2026-09-01T18:30:00.000Z",
  "owner": "user-01",
  "mimeType": "application/pdf",
  "filePath": "/app/backend/storage/relatorio_2026-09-01.pdf"
}