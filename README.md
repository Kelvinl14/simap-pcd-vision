# SIMAP-PCD Vision

Sistema para gestão e visualização de dados de pessoas com deficiência (PCD).

## Tecnologias Utilizadas

O projeto é construído com:

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Ferramenta de build e dev server
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado de servidor
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Leaflet / React Leaflet** - Mapa interativo
- **Recharts** - Gráficos
- **jsPDF / jsPDF-AutoTable** - Exportação de relatórios em PDF
- **Lucide React** - Ícones

## Funcionalidades

- **Autenticação**: Login, recuperação de senha e primeiro acesso
- **Dashboard**: Visão geral com estatísticas e gráficos
- **Cadastro**: Registro de PCDs
- **Consulta**: Pesquisa e filtro de registros
- **Mapa**: Visualização geográfica dos dados
- **Estatísticas**: Análises detalhadas com gráficos
- **Relatórios**: Geração de relatórios em PDF
- **Gestão**: Administração de usuários e instituições
- **Configurações**: Personalização do sistema

## Como rodar o projeto

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou bun

### Passo a passo

1. **Instalar dependências**

```sh
npm install
# ou
bun install
```

2. **Configurar variáveis de ambiente**

Crie/edite o arquivo `.env` na raiz do projeto com as configurações necessárias.

3. **Iniciar o servidor de desenvolvimento**

```sh
npm run dev
# ou
bun dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run build:dev` - Cria a build de desenvolvimento
- `npm run lint` - Executa o ESLint
- `npm run preview` - Visualiza a build de produção localmente

## Estrutura do projeto

```
src/
├── components/
│   ├── auth/         # Componentes de autenticação
│   ├── dashboard/    # Componentes do dashboard
│   ├── layout/       # Componentes de layout
│   └── ui/           # Componentes shadcn/ui
├── contexts/         # Contextos React (AuthContext)
├── hooks/            # Hooks personalizados
├── lib/              # Utilitários (PDF export, utils)
├── pages/            # Páginas da aplicação
│   └── auth/         # Páginas de autenticação
└── services/         # Serviços de API
```
