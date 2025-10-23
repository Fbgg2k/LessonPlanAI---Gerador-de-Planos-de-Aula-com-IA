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
*   **Backend:** Supabase (Banco de dados).
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
3.  Execute o **Script SQL** fornecido na seção [Scripts SQL e Configuração de Acesso](#-scripts-sql-e-configuração-de-acesso) para configurar o schema do banco de dados e as políticas de segurança.
4.  Em `Project Settings > API`, obtenha a URL do projeto e a `anon key`.

### 4. Configuração das Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

```
# Credenciais Supabase (encontradas nas configurações do seu projeto)
NEXT_PUBLIC_SUPABASE_URL=[SUA_SUPABASE_PROJECT_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_SUPABASE_ANON_KEY]

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

## 🗺️ Scripts SQL e Configuração de Acesso

### 1. Estrutura de Dados

O banco de dados (Supabase) armazena os planos de aula gerados pela IA.

| Tabela         | Coluna           | Tipo                | Descrição                                         |
| :------------- | :--------------- | :------------------ | :------------------------------------------------ |
| `lesson_plans` | `id`             | `uuid`              | Chave primária (Gerada automaticamente)             |
|                | `topic`          | `text`              | Tema fornecido pelo usuário                       |
|                | `grade_level`    | `text`              | Nível de ensino fornecido pelo usuário            |
|                | `subject`        | `text`              | Matéria fornecida pelo usuário                    |
|                | `lesson_plan_data` | `jsonb`             | Plano de aula completo gerado pela IA (em JSON) |
|                | `created_at`     | `timestamp with time zone` | Data de criação (Padrão: `now()`)                 |


### 2. Configurando o Acesso Público (RLS)

Para que a aplicação possa salvar e ler os planos de aula sem exigir login, você precisa habilitar a **Segurança em Nível de Linha (RLS)** e criar políticas de acesso público no Supabase.

#### Opção A: Executando o Script SQL (Recomendado)

Copie e execute o script abaixo **de uma só vez** no **SQL Editor** do seu projeto Supabase. Ele irá criar a tabela (se não existir), limpar políticas antigas e configurar as novas permissões de acesso público corretamente.

```sql
-- 1. Cria a tabela (a execução pode falhar se ela já existir, e está tudo bem)
CREATE TABLE IF NOT EXISTS public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  grade_level text not null,
  subject text not null,
  lesson_plan_data jsonb not null,
  created_at timestamp with time zone default now() not null
);

-- 2. Habilita a Segurança em Nível de Linha (RLS) na tabela.
-- Este passo é CRUCIAL para que as políticas funcionem.
alter table public.lesson_plans enable row level security;

-- 3. Remove políticas antigas para evitar conflitos.
-- É seguro executar isso mesmo que as políticas não existam.
DROP POLICY IF EXISTS "Published visible to all" ON public.lesson_plans;
DROP POLICY IF EXISTS "Authenticated can select all" ON public.lesson_plans;
DROP POLICY IF EXISTS "Authenticated can insert" ON public.lesson_plans;
DROP POLICY IF EXISTS "Authenticated can update" ON public.lesson_plans;
DROP POLICY IF EXISTS "Only admins can delete" ON public.lesson_plans;
DROP POLICY IF EXISTS "Allow public read access" ON public.lesson_plans;
DROP POLICY IF EXISTS "Allow public insert access" ON public.lesson_plans;

-- 4. Cria a política que permite que QUALQUER um leia (SELECT) os dados da tabela.
create policy "Allow public read access" on public.lesson_plans for
select using (true);

-- 5. Cria a política que permite que QUALQUER um insira (INSERT) novos dados na tabela.
create policy "Allow public insert access" on public.lesson_plans for
insert with check (true);
```

#### Opção B: Configuração Manual pela Interface do Supabase

Se o script acima falhar ou se preferir o modo manual, siga os passos abaixo:

1.  **Navegue até as Políticas de Autenticação:**
    *   No painel do seu projeto Supabase, vá para `Authentication` -> `Policies`.

2.  **Encontre a Tabela `lesson_plans`:**
    *   Procure pela tabela `lesson_plans`. Se você vir uma mensagem dizendo `RLS is not enabled`, clique no botão **"Enable RLS"**.
    *   Delete todas as políticas existentes para a tabela `lesson_plans` clicando no ícone de lixeira ao lado de cada uma.

3.  **Crie a Política de Leitura (SELECT):**
    *   Clique em **"New Policy"**.
    *   Selecione **"Create a new policy from scratch"**.
    *   **Policy name:** `Allow public read access`
    *   **Allowed operation:** Marque a opção `SELECT`.
    *   **USING expression:** Digite `true`. Esta é a expressão SQL que permite a leitura.
    *   Clique em **"Review"** e depois em **"Save policy"**.

4.  **Crie a Política de Inserção (INSERT):**
    *   Clique novamente em **"New Policy"**.
    *   Selecione **"Create a new policy from scratch"**.
    *   **Policy name:** `Allow public insert access`
    *   **Allowed operation:** Marque a opção `INSERT`.
    *   **WITH CHECK expression:** Digite `true`. Esta é a expressão SQL que permite a inserção.
    *   Clique em **"Review"** e depois em **"Save policy"**.

Após executar o script ou configurar manualmente, a sua aplicação terá as permissões necessárias para funcionar corretamente.

-----

## 🤖 Implementação do Gerador

### 1. Escolha do Modelo de IA

| Critério               | Escolha                   | Justificativa                                                                                                                                                             |
| :--------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Modelo Escolhido**   | **`gemini-1.5-flash`**    | O modelo `gemini-1.5-flash` foi escolhido por seu excelente equilíbrio entre velocidade, custo e capacidade de seguir instruções complexas, como a geração de saídas em formato JSON estruturado. Sua janela de contexto ampla e performance o tornam ideal para esta tarefa. |
| **Documentação Acessada** | Documentação do Google AI Studio e Genkit | A integração foi realizada com base na documentação oficial, utilizando as ferramentas `definePrompt` e `defineFlow` do Genkit para criar um fluxo de geração robusto e tipado. |

### 2. Requisitos Funcionais Implementados

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
*   **Uso do Supabase sem Autenticação:** A aplicação foi refatorada para funcionar sem a necessidade de login. Para isso, o RLS (Row Level Security) foi habilitado no Supabase com políticas públicas (`using (true)`) para permitir que qualquer visitante possa ler e criar planos de aula, tornando a aplicação uma ferramenta pública e colaborativa.
*   **Next.js App Router e Server Actions:** A aplicação foi construída com o App Router do Next.js, utilizando Server Components para performance e Server Actions para mutações de dados (criação de planos), o que simplifica o código e melhora a segurança.

### 2. Desafios Encontrados e Soluções

*   **Desafio:** Garantir que o modelo Gemini sempre retornasse a saída em JSON válida.
    *   **Solução:** A utilização do framework Genkit com um `output.schema` definido com Zod resolveu este problema de forma elegante. O Genkit gerencia a comunicação com a API para garantir que a saída corresponda ao schema, fazendo retentativas ou ajustes no prompt se necessário.
*   **Desafio:** Gerenciamento do estado da aplicação durante o tempo de espera da resposta da IA.
    *   **Solução:** Foi implementado um estado de carregamento (`pending`) utilizando o hook `useFormStatus` do React, que desabilita o botão de submissão e exibe uma mensagem de "Gerando..." enquanto a Server Action está em execução. O feedback de sucesso ou erro é comunicado ao usuário através de toasts.
*   **Desafio:** Persistência de dados no Supabase sem autenticação.
    *   **Solução:** O erro "Falha ao salvar no banco de dados" foi resolvido configurando corretamente as políticas de RLS (Row Level Security) no Supabase. Foram criadas políticas explícitas que permitem as operações de `SELECT` e `INSERT` para o role `public`, garantindo que a aplicação possa ler e escrever dados de forma anônima.

-----

## 🔗 Acessos e Entregáveis

*   **URL da Aplicação:** [URL_DA_APLICACAO_DEPLOYADA]
*   **Repositório GitHub (Código-fonte):** [LINK_DO_REPOSITORIO]
*   **Link para o Projeto Supabase:** [LINK_PARA_O_DASHBOARD_SUPABASE]
