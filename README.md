# LessonPlanAI - Gerador de Planos de Aula com IA

## 📝 Descrição do Projeto

Este projeto é o **Gerador de Planos de Aula com IA** e tem como objetivo desenvolver um sistema para gerar planos de aula personalizados utilizando Inteligência Artificial. A aplicação permite que educadores insiram um nível de ensino, matéria e tópico para receber um plano de aula estruturado.

O plano de aula gerado inclui os seguintes componentes:

*   **Introdução lúdica:** Uma forma criativa e engajadora de apresentar o tema.
*   **Objetivo de aprendizagem da BNCC:** Alinhado à Base Nacional Comum Curricular.
*   **Passo a passo da atividade:** Um roteiro detalhado para a execução da atividade.
*   **Rubrica de avaliação:** Critérios para a professora avaliar o aprendizado.

-----

## 🚀 Stack Tecnológica

O projeto foi desenvolvido utilizando a seguinte stack:

*   **Frontend:** Next.js (React) com TypeScript e Tailwind CSS.
*   **Backend:** Supabase (Banco de dados e autenticação).
*   **IA:** Google AI Studio / Gemini API (através de Genkit).
*   **UI Components:** ShadCN/UI.

-----

## 🛠️ Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Pré-requisitos

*   Node.js (v18 ou superior)
*   Conta no Google AI Studio (para obter a chave da API do Gemini)
*   Conta no Supabase

### 2. Clonar o Repositório

```bash
git clone https://github.com/your-repo/lessonplanai.git
cd lessonplanai
```

### 3. Configuração do Banco de Dados (Supabase)

1.  Crie um novo projeto no Supabase.
2.  Vá para o `SQL Editor` no painel do seu projeto.
3.  Execute o **Script SQL** fornecido na seção [Scripts SQL](#2-scripts-sql) para configurar o schema do banco de dados.
4.  Em `Project Settings > API`, obtenha a URL do projeto e a `anon key`.
5.  Em `Authentication > Providers`, habilite o provedor de Email. Para este projeto de teste, recomenda-se desabilitar a opção "Confirm email" para um fluxo de cadastro mais rápido.

### 4. Configuração das Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as seguintes variáveis:

```
# Credenciais Supabase (encontradas nas configurações do seu projeto)
NEXT_PUBLIC_SUPABASE_URL=[SUA_SUPABASE_PROJECT_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_SUPABASE_ANON_KEY]

# URL da aplicação para redirects de autenticação
NEXT_PUBLIC_SITE_URL=http://localhost:9002

# Chave da API do Gemini (obtida no Google AI Studio)
GEMINI_API_KEY=[SUA_GEMINI_API_KEY]
```

### 5. Instalação das Dependências

```bash
npm install
```

### 6. Execução do Projeto

```bash
npm run dev
```

O projeto estará acessível em `http://localhost:9002`.

-----

## 🗺️ Modelagem de Dados e Scripts SQL

### 1. Estrutura de Dados

O banco de dados (Supabase) armazena os planos de aula gerados pela IA, associados a cada usuário.

**Inputs definidos para o usuário:**

*   Nível de Ensino (Fundamental I, II, Médio)
*   Componente Curricular (Matemática, Português, etc.)
*   Tema/Assunto da Aula

**Diagrama da Estrutura de Dados:**

| Tabela         | Coluna           | Tipo                | Descrição                                         |
| :------------- | :--------------- | :------------------ | :------------------------------------------------ |
| `lesson_plans` | `id`             | `uuid`              | Chave primária (Gerada automaticamente)             |
|                | `user_id`        | `uuid`              | Chave estrangeira para `auth.users(id)`             |
|                | `topic`          | `text`              | Tema fornecido pelo usuário                       |
|                | `grade_level`    | `text`              | Nível de ensino fornecido pelo usuário            |
|                | `subject`        | `text`              | Matéria fornecida pelo usuário                    |
|                | `lesson_plan_data` | `jsonb`             | Plano de aula completo gerado pela IA (em JSON) |
|                | `created_at`     | `timestamp with time zone` | Data de criação (Padrão: `now()`)                 |

### 2. Scripts SQL

Script SQL para criação da tabela `lesson_plans` no Supabase e configuração de políticas de segurança (RLS).

```sql
-- Criação da tabela lesson_plans
CREATE TABLE public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  grade_level text not null,
  subject text not null,
  lesson_plan_data jsonb not null,
  created_at timestamp with time zone default now() not null
);

-- Habilita RLS (Row Level Security) na tabela
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem visualizar apenas seus próprios planos de aula.
CREATE POLICY "Users can view their own lesson plans"
  ON public.lesson_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem criar planos de aula para si mesmos.
CREATE POLICY "Users can insert their own lesson plans"
  ON public.lesson_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios planos de aula.
CREATE POLICY "Users can update their own lesson plans"
  ON public.lesson_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios planos de aula.
CREATE POLICY "Users can delete their own lesson plans"
  ON public.lesson_plans FOR DELETE
  USING (auth.uid() = user_id);
```

-----

## 🤖 Implementação do Gerador

### 1. Escolha do Modelo de IA

| Critério               | Escolha                   | Justificativa                                                                                                                                                             |
| :--------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Modelo Escolhido**   | **`gemini-1.5-flash`**    | O modelo `gemini-1.5-flash` foi escolhido por seu excelente equilíbrio entre velocidade, custo e capacidade de seguir instruções complexas, como a geração de saídas em formato JSON estruturado. Sua janela de contexto ampla e performance o tornam ideal para esta tarefa. |
| **Documentação Acessada** | Documentação do Google AI Studio e Genkit | A integração foi realizada com base na documentação oficial, utilizando as ferramentas `definePrompt` e `defineFlow` do Genkit para criar um fluxo de geração robusto e tipado. |

### 2. Requisitos Funcionais Implementados

*   **Autenticação de Usuários:** Integração com Supabase Auth para login e cadastro.
*   **Formulário para Entrada de Dados:** Interface intuitiva para o usuário fornecer os parâmetros do plano de aula.
*   **Validação dos Inputs:** Validação no frontend e backend para garantir que os dados inseridos são válidos.
*   **Integração com Gemini API:** Envio de requisição à API do Gemini com um *prompt* estruturado através do Genkit.
*   **Parsing da Resposta da IA:** Uso do schema de saída do Genkit para garantir que a resposta da IA seja um JSON válido e processá-la.
*   **Salvamento no Banco de Dados:** O plano de aula gerado é salvo na tabela `lesson_plans` do Supabase.
*   **Exibição do Plano de Aula:** O resultado final é apresentado ao usuário em uma interface limpa e organizada.
*   **Listagem de Planos:** Os usuários podem visualizar uma lista de todos os seus planos de aula gerados.
*   **Tratamento de Erros:** Mecanismos para lidar com falhas na requisição da API ou no banco de dados, com feedback para o usuário.

-----

## ⚙️ Decisões Técnicas e Desafios

### 1. Decisões Técnicas Tomadas

*   **Prompt Engineering:** O prompt para o Gemini foi cuidadosamente estruturado para especificar os quatro componentes obrigatórios do plano de aula. O uso do Genkit com schemas Zod de entrada e saída (`input` e `output`) foi crucial para forçar o modelo a retornar um JSON bem-formado e consistente.
*   **Uso do Supabase:** Supabase foi utilizado para autenticação e armazenamento de dados. O RLS (Row Level Security) foi habilitado para garantir que os usuários só possam acessar e manipular seus próprios dados, proporcionando uma arquitetura multi-tenant segura.
*   **Next.js App Router e Server Actions:** A aplicação foi construída com o App Router do Next.js, utilizando Server Components para performance e Server Actions para mutações de dados (login, signup, criação de planos), o que simplifica o código e melhora a segurança.

### 2. Desafios Encontrados e Soluções

*   **Desafio:** Garantir que o modelo Gemini sempre retornasse a saída em JSON válida.
    *   **Solução:** A utilização do framework Genkit com um `output.schema` definido com Zod resolveu este problema de forma elegante. O Genkit gerencia a comunicação com a API para garantir que a saída corresponda ao schema, fazendo retentativas ou ajustes no prompt se necessário.
*   **Desafio:** Gerenciamento do estado da aplicação durante o tempo de espera da resposta da IA.
    *   **Solução:** Foi implementado um estado de carregamento (`pending`) utilizando o hook `useFormStatus` do React, que desabilita o botão de submissão e exibe uma mensagem de "Gerando..." enquanto a Server Action está em execução. O feedback de sucesso ou erro é comunicado ao usuário através de toasts.

-----

## 🔗 Acessos e Entregáveis

*   **URL da Aplicação:** [URL_DA_APLICACAO_DEPLOYADA]
*   **Repositório GitHub (Código-fonte):** [LINK_DO_REPOSITORIO]
*   **Credenciais de Teste:** E-mail: `test@example.com`, Senha: `password`
*   **Link para o Projeto Supabase:** [LINK_PARA_O_DASHBOARD_SUPABASE]
