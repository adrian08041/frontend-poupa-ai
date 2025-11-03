# 🎨 PoupaAI Frontend

> Interface moderna e responsiva para gerenciamento de finanças pessoais

[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📑 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura](#-arquitetura)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Tecnologias](#-tecnologias)
5. [Instalação](#-instalação)
6. [Executando](#-executando)
7. [Páginas e Funcionalidades](#-páginas-e-funcionalidades)
8. [Componentes](#-componentes)
9. [Padrões de Código](#-padrões-de-código)
10. [Aprendendo o Código](#-aprendendo-o-código)

---

## 🎯 Sobre o Projeto

O **PoupaAI Frontend** é uma aplicação web moderna construída com **Next.js 15** (App Router) e **React 19**. É um excelente exemplo de:

- ✅ **Next.js App Router** (nova arquitetura)
- ✅ **React Server Components**
- ✅ **TypeScript** (type-safe)
- ✅ **Tailwind CSS** (utility-first)
- ✅ **shadcn/ui** (componentes acessíveis)
- ✅ **React Hook Form + Zod** (validação robusta)
- ✅ **Dark Mode** (tema claro/escuro)

### 🎓 O Que Você Vai Aprender

Estudando este projeto, você aprenderá:

1. **Next.js Moderno**
   - App Router (file-based routing)
   - Server vs Client Components
   - Layouts aninhados
   - Loading e Error states

2. **React Avançado**
   - Hooks customizados
   - Gerenciamento de estado
   - Contextos (Theme)
   - Formulários complexos

3. **TypeScript**
   - Type-safety completo
   - Interfaces e types
   - Generics
   - Type inference

4. **UI/UX**
   - Design responsivo
   - Componentes reutilizáveis
   - Acessibilidade (a11y)
   - Dark mode

5. **Integração de APIs**
   - Fetch API
   - Autenticação JWT
   - Upload de arquivos
   - Tratamento de erros

6. **Validação de Formulários**
   - React Hook Form
   - Zod schemas
   - Mensagens de erro
   - Upload com preview

---

## 🏗️ Arquitetura

### Estrutura do Next.js 15 (App Router)

```
┌─────────────────────────────────────┐
│         USUÁRIO                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   PÁGINAS (App Router)              │
│   - Server Components (padrão)      │
│   - Client Components ("use client")│
│   - Layouts compartilhados          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   COMPONENTES                       │
│   - UI (shadcn/ui)                  │
│   - Layout (Header)                 │
│   - Específicos de domínio          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   LÓGICA DE NEGÓCIO                 │
│   - API Clients (fetch)             │
│   - Validadores (Zod)               │
│   - Hooks customizados              │
│   - Contextos (Theme, Auth)         │
└──────────────┬──────────────────────┘
               │
               ▼
          Backend API
```

---

## 📂 Estrutura de Pastas

```
frontend/
├── src/
│   │
│   ├── app/                         # 📄 App Router (Next.js 15)
│   │   │
│   │   ├── (authenticated)/         # 🔐 Grupo de rotas autenticadas
│   │   │   ├── layout.tsx           # Layout com Header
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard principal
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── page.tsx         # Listagem
│   │   │   │   └── components/
│   │   │   │       ├── TransactionForm.tsx  # Form completo
│   │   │   │       ├── transaction-table.tsx
│   │   │   │       └── delete-dialog.tsx
│   │   │   │
│   │   │   ├── reports/             # 📊 Relatórios com IA
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── subscription/
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/                   # Páginas públicas
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home (redireciona)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx           # Navegação principal
│   │   │
│   │   └── ui/                      # 🎨 shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── user-profile-card.tsx
│   │       └── theme-toggle.tsx
│   │
│   ├── lib/
│   │   ├── api/                     # 🔌 API Clients
│   │   │   ├── client.ts            # Base HTTP client
│   │   │   ├── auth.ts
│   │   │   ├── transaction.ts
│   │   │   ├── profile.ts
│   │   │   └── metadata.ts
│   │   │
│   │   ├── validator/               # ✅ Schemas Zod
│   │   │   ├── transaction.ts
│   │   │   ├── auth.ts
│   │   │   └── profile.ts
│   │   │
│   │   ├── utils/
│   │   │   └── format.ts            # Formatação (moeda, data)
│   │   │
│   │   └── utils.ts                 # Utilitários (cn, etc)
│   │
│   ├── types/                       # 📝 TypeScript Types
│   │   ├── transaction.ts
│   │   └── report.ts
│   │
│   ├── hooks/                       # 🪝 Custom Hooks
│   │   └── useAuth.ts
│   │
│   └── contexts/                    # 🌐 React Contexts
│       └── ThemeContext.tsx
│
├── public/
│   ├── logo-pequena.png
│   └── logo-grande.png
│
├── tailwind.config.ts               # Configuração Tailwind
├── next.config.ts                   # Configuração Next.js
└── tsconfig.json                    # Configuração TypeScript
```

### 📝 Convenções de Nomenclatura

- **Arquivos de página**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Componentes**: `PascalCase.tsx`
- **Utilitários**: `kebab-case.ts`
- **Hooks**: `useNome.ts`
- **Contextos**: `NomeContext.tsx`

---

## 🛠️ Tecnologias

### Core

| Tech | Versão | Descrição |
|------|--------|-----------|
| [Next.js](https://nextjs.org/) | 15.x | Framework React |
| [React](https://reactjs.org/) | 19.x | Biblioteca UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Superset tipado |

### UI/Styling

| Tech | Descrição |
|------|-----------|
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes acessíveis |
| [Lucide React](https://lucide.dev/) | Ícones |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode |

### Formulários e Validação

| Tech | Descrição |
|------|-----------|
| [React Hook Form](https://react-hook-form.com/) | Gerenciamento de forms |
| [Zod](https://zod.dev/) | Validação de schemas |
| [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers) | Integração Zod + RHF |

### Utilitários

| Tech | Descrição |
|------|-----------|
| [clsx](https://github.com/lukeed/clsx) | Composição de classes |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Merge classes Tailwind |
| [date-fns](https://date-fns.org/) | Manipulação de datas |

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
- Node.js 20.x
- npm 9.x
- Backend rodando em `http://localhost:3001`

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar ambiente
```bash
# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 4. Executar
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar produção
npm start
```

Acesse: `http://localhost:3000`

---

## 📱 Páginas e Funcionalidades

### 1. Login (`/login`)
- Formulário de autenticação
- Validação de email e senha
- Mensagens de erro amigáveis
- Link para registro

### 2. Registro (`/register`)
- Criação de nova conta
- Validação em tempo real
- Força da senha
- Redirect automático após sucesso

### 3. Dashboard (`/dashboard`)
**Layout:**
```
┌──────────────────────────────────────┐
│  Header (Navegação)                  │
├──────────────────┬───────────────────┤
│                  │                   │
│  Saldo           │  Transações       │
│  Cards Resumo    │  Recentes         │
│  Gráficos        │  (Sidebar)        │
│  Categorias      │                   │
│                  │                   │
└──────────────────┴───────────────────┘
```

**Componentes:**
- Card de Saldo (com toggle mostrar/ocultar)
- Cards de Resumo (Receitas, Despesas, Investimentos)
- Gráfico de Pizza (distribuição)
- Gastos por Categoria (barras)
- Transações Recentes
- Filtro por Mês/Ano

### 4. Transações (`/transactions`)
**Funcionalidades:**
- Tabela completa de transações
- Botão "Nova Transação"
- Modal com formulário completo
- Upload de imagem (extração com IA)
- Editar/Deletar inline
- Paginação
- Filtros

**Modal - Nova Transação:**
```
┌─────────────────────────────────────┐
│  Nova Transação              [X]    │
├─────────────────────────────────────┤
│                                     │
│  📷 Extrair de Imagem               │
│  [Upload] ou [Arrastar]             │
│  Preview da imagem                  │
│  [Extrair Dados] 🤖                 │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Título: [_____________________]    │
│  Valor:  [R$ __________]            │
│  Tipo:   [Dropdown ▼]               │
│  Método: [Dropdown ▼]               │
│  Categoria: [Dropdown ▼]            │
│  Data:   [📅 __/__/____]            │
│                                     │
│  [Cancelar]  [Adicionar]            │
└─────────────────────────────────────┘
```

### 5. Relatórios (`/reports`) 📊🤖
**Layout:**
```
┌─────────────────────────────────────┐
│  Filtros: [Mês ▼] [Ano ▼] [Gerar]  │
├─────────────────────────────────────┤
│  Score: 82/100 💚                   │
│  "Ótima saúde financeira!"          │
├─────────────────────────────────────┤
│  Visão Geral (motivacional)         │
├─────────────────────────────────────┤
│  Cards: Receitas | Despesas | Saldo│
├─────────────────────────────────────┤
│  ✅ Pontos Positivos                │
│  - Reduziu 18% em Alimentação       │
│  - Investimentos +25%               │
├─────────────────────────────────────┤
│  ⚠️ Pontos de Atenção                │
│  - Lazer subiu 45%                  │
├─────────────────────────────────────┤
│  💡 Dicas Personalizadas            │
│  [Alta] Desafio: Semana sem gastos  │
│  [Média] Reduzir gastos em Lazer    │
├─────────────────────────────────────┤
│  🎯 Metas para Próximo Mês          │
│  - Reduzir Lazer para R$ 750        │
├─────────────────────────────────────┤
│  💡 Você Sabia?                     │
│  "Seus gastos são 35% menores..."  │
└─────────────────────────────────────┘
```

**Gerado por IA (OpenAI GPT):**
- Análise inteligente dos gastos
- Insights personalizados
- Comparação com mês anterior
- Dicas práticas de economia
- Metas sugeridas

### 6. Assinatura (`/subscription`)
- Planos disponíveis
- Features de cada plano
- Status da assinatura atual

---

## 🧩 Componentes

### Layout

**Header.tsx**
```typescript
// Navegação principal
- Logo
- Links: Dashboard, Transações, Relatórios, Assinatura
- Profile dropdown
- Theme toggle (dark/light)
```

### UI Components (shadcn/ui)

Todos os componentes seguem padrões de acessibilidade:

| Componente | Uso |
|------------|-----|
| `Button` | Botões estilizados |
| `Card` | Containers com borda |
| `Dialog` | Modals |
| `Form` | Formulários com validação |
| `Input` | Campos de texto |
| `Select` | Dropdowns |
| `Alert` | Mensagens de feedback |

### Componentes Específicos

**TransactionForm.tsx**
- Formulário completo de transação
- Upload de imagem com preview
- Validação com Zod
- Integração com API de extração

**transaction-table.tsx**
- Tabela de transações
- Ações inline (editar/deletar)
- Formatação de valores

**user-profile-card.tsx**
- Dropdown de perfil
- Opções de conta
- Logout

---

## 💻 Padrões de Código

### 1. Páginas (App Router)

**Server Component (padrão):**
```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  // Sem "use client"
  // Renderizado no servidor
  return <div>Dashboard</div>;
}
```

**Client Component:**
```typescript
// app/transactions/page.tsx
"use client"; // ← Necessário para interatividade

import { useState } from "react";

export default function TransactionsPage() {
  const [data, setData] = useState([]);
  
  return <div>Transactions</div>;
}
```

### 2. API Clients

```typescript
// lib/api/transaction.ts
export async function createTransaction(
  data: CreateTransactionData
): Promise<Transaction> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Erro ao criar transação");
  }
  
  return response.json();
}
```

### 3. Formulários (React Hook Form + Zod)

```typescript
// Definir schema
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

// Usar no formulário
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
  },
});

const onSubmit = async (data: FormData) => {
  await login(data);
};

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Enviar</Button>
    </form>
  </Form>
);
```

### 4. Hooks Customizados

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  return { user, loading };
}
```

### 5. Formatação de Valores

```typescript
// lib/utils/format.ts

// Formatar moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formatar data
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
```

---

## 📚 Aprendendo o Código

### Ordem Recomendada de Estudo:

#### 1. Estrutura Básica
1. `src/app/layout.tsx` - Root layout
2. `src/app/(authenticated)/layout.tsx` - Layout autenticado
3. `src/components/layout/Header.tsx` - Navegação

#### 2. Páginas Simples
1. `src/app/login/page.tsx` - Login
2. `src/app/register/page.tsx` - Registro
3. `src/app/(authenticated)/dashboard/page.tsx` - Dashboard

#### 3. Componentes UI
1. `src/components/ui/button.tsx`
2. `src/components/ui/card.tsx`
3. `src/components/ui/form.tsx`

#### 4. API e Lógica
1. `src/lib/api/client.ts` - Cliente base
2. `src/lib/api/auth.ts` - Autenticação
3. `src/lib/api/transaction.ts` - Transações

#### 5. Formulários Complexos
1. `src/lib/validator/transaction.ts` - Schemas
2. `src/app/(authenticated)/transactions/components/TransactionForm.tsx`

#### 6. Avançado (IA)
1. `src/app/(authenticated)/reports/page.tsx` - Relatórios
2. `src/types/report.ts` - Tipos de IA

### Conceitos Importantes:

**App Router vs Pages Router:**
- App Router é a nova arquitetura (Next.js 13+)
- File-based routing (`page.tsx`)
- Layouts compartilhados
- Server Components por padrão

**Server vs Client Components:**
- Server: Renderizado no servidor, sem interatividade
- Client: `"use client"`, com hooks e eventos

**shadcn/ui:**
- Não é biblioteca npm
- Componentes copiados para seu projeto
- Totalmente customizáveis
- Baseados em Radix UI

**React Hook Form:**
- Performance (re-renders mínimos)
- Validação integrada
- Controle total do form
- API simples

---

## 🎨 Tema e Estilização

### Dark Mode

```typescript
// Usar tema
import { useTheme } from "next-themes";

function Component() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle
    </button>
  );
}
```

### Tailwind Utility Classes

```typescript
// Exemplo de classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Título
  </h1>
</div>
```

### Classes Condicionais

```typescript
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded",
    isActive && "bg-green text-white",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
/>
```

---

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 🤝 Dúvidas?

1. Leia a [Documentação Completa](../DOCUMENTATION.md)
2. Verifique comentários no código
3. Abra uma issue no GitHub

---

**Desenvolvido para aprendizado 💚**
