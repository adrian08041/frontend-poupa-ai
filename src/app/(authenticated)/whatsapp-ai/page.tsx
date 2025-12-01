// src/app/(authenticated)/whatsapp-ai/page.tsx
"use client";

import { MessageCircle, Zap, Bot, ArrowRight, Lightbulb, Workflow, Smartphone, HelpCircle, Code, ShieldCheck, Camera, Receipt, CheckCircle2, TrendingUp, TrendingDown, Clock, Search, CreditCard, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// Definições de constantes que usamos em múltiplos lugares (bom para manutenção!)
const WHATSAPP_NUMBER_DISPLAY = "+55 11 94044-6770";
const WHATSAPP_NUMBER_RAW = "5511940446770";
const INITIAL_MESSAGE = "Olá, eu quero começar a gerenciar minhas finanças com o PoupaAI!";

/**
 * Componente que cria o fundo dinâmico de partículas.
 * Adorei esse efeito de 'Inteligência' sutil que ele dá à página!
 */
const ParticleEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
        {/* Gera 50 partículas flutuantes para dar volume ao fundo */}
        {[...Array(50)].map((_, i) => (
            <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-green rounded-full opacity-0"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.2, 0.8, 0.2, 0], 
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                    duration: 10 + Math.random() * 10, 
                    repeat: Infinity,
                    delay: Math.random() * 5, 
                    ease: "easeInOut",
                }}
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }}
            />
        ))}
        {/* Círculos grandes de desfoque para dar o efeito de luz ambiente verde */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green/5 rounded-full blur-3xl opacity-10 animate-floatX" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-green/5 rounded-full blur-3xl opacity-10 animate-floatY" />
    </div>
);


/**
 * Card principal de chamada para ação (CTA).
 * Centralizado e com largura limitada para não quebrar no celular (CORRIGIDO!).
 */
function WhatsAppConnectSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(INITIAL_MESSAGE)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      // CHAVE DA CORREÇÃO: Força o Card a ter largura limitada e centralização em telas pequenas.
      className="col-span-1 relative z-10 w-full flex justify-center px-4 lg:px-0 mx-auto" 
    >
      <Card 
        // LARGURA CORRIGIDA: Max-width para o Card no mobile.
        className="shadow-2xl border-green dark:border-green/50 border-4 h-full flex flex-col bg-white dark:bg-background-02 transition-all 
        hover:shadow-green-md w-full max-w-sm sm:max-w-md lg:max-w-lg" // Aumentei o max-w para ser um bloco de destaque maior em telas maiores que mobile
      >
        <CardHeader className="text-center ">
          <div className="flex justify-center ">
            <motion.div
              animate={{ y: [0, -8, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bot className="h-16 w-16 text-green" />
            </motion.div>
          </div>
          <CardTitle className="text-3xl font-extrabold flex flex-col items-center justify-center gap-2 text-gray dark:text-white">
            <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green mr-2" />
                PoupaAI Zap
            </div>
            <span className="text-sm font-medium text-gray dark:text-gray-400">Gerenciamento Rápido e Seguro</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 flex-grow p-6">
          <p className="text-center text-gray dark:text-gray-300 leading-relaxed text-md">
            Sinto que essa funcionalidade vai me dar muita agilidade! Envio mensagens ou fotos de cupons fiscais para que a Inteligência Artificial registre tudo.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-md px-4 py-2 bg-green/10 text-green-400 dark:text-green-300 font-bold">
               {WHATSAPP_NUMBER_DISPLAY}
            </Badge>
          </div>
          <div className="mt-auto flex justify-center"> 
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full h-14 bg-green hover:bg-green/90 text-white text-xl font-bold flex items-center 
              justify-center gap-3 shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-[1.01]">
                <MessageCircle className="h-7 w-7" />
                Iniciar Chat no WhatsApp
                <ArrowRight className="h-6 w-6" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Seção de Perguntas Frequentes (FAQ) para adicionar mais valor e linhas ao código.
 */
function FAQSection() {
    const faqs = [
        {
            q: "Como o PoupaAI Zap garante a segurança dos meus dados?",
            a: "A segurança é nossa prioridade. Usamos conexões criptografadas e o seu número de telefone é mapeado de forma única e segura ao seu perfil. Além disso, as fotos dos seus cupons fiscais são processadas apenas para extrair os dados e não são armazenadas permanentemente.",
            icon: <ShieldCheck className="h-5 w-5 text-green" />
        },
        {
            q: "Preciso digitar comandos muito específicos para registrar?",
            a: "Não! A grande vantagem é a Inteligência Artificial. Você pode usar linguagem natural como 'Gastei 45 no cinema' ou 'Entrou 1500'. A IA entende a intenção, extrai o valor e a descrição, e aplica a categoria mais provável.",
            icon: <Lightbulb className="h-5 w-5 text-green" />
        },
        {
            q: "O recurso de foto (OCR) funciona com qualquer tipo de cupom?",
            a: "Sim, ele funciona muito bem com a maioria dos cupons fiscais (NFC-e) e notas claras. A IA usa o reconhecimento de imagem para localizar o valor total e a data, acelerando muito o seu registro. Para melhores resultados, certifique-se de que a foto esteja nítida!",
            icon: <Camera className="h-5 w-5 text-green" />
        },
        {
            q: "Posso usar o PoupaAI Zap para ver meu saldo?",
            a: "Claro! É super rápido. Basta enviar a palavra 'Saldo' e o assistente buscará os dados em tempo real no seu perfil, retornando o resumo das suas finanças em segundos.",
            icon: <DollarSign className="h-5 w-5 text-green" />
        },
        {
            q: "O que é essa 'Automação' no fluxo de trabalho?",
            a: "A 'Automação' é o motor que faz a mágica acontecer. Ela coordena o processo: recebe sua mensagem do WhatsApp, aciona a Inteligência Artificial para análise e, em seguida, envia os dados limpos e prontos para o nosso sistema de registro. Tudo isso acontece em uma fração de segundo!",
            icon: <Workflow className="h-5 w-5 text-green" />
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
        >
            <Card className="bg-white dark:bg-background-02 border-light-gray dark:border-dark-gray shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray dark:text-white">
                        <HelpCircle className="h-6 w-6 text-green" />
                        Perguntas Frequentes (FAQ)
                    </CardTitle>
                    <CardDescription className="text-gray dark:text-gray-400 mt-2">
                        Respostas rápidas para as principais dúvidas sobre a integração do PoupaAI com o WhatsApp.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-4 bg-green/5 dark:bg-dark-green/30 rounded-lg border border-green/20 dark:border-green/10">
                            <h4 className="font-semibold text-gray dark:text-white flex items-center gap-2 mb-1">
                                {faq.icon} {faq.q}
                            </h4>
                            <p className="text-sm text-gray dark:text-gray-300 ml-7 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ====================================================================
// PÁGINA PRINCIPAL
// ====================================================================

export default function WhatsappAiPage() {
  
  // O estado inicial precisa refletir a chave correta.
  const [activeCommandTab, setActiveCommandTab] = useState("Transações (Texto)");

  const howItWorksSteps = [
    {
      icon: <Smartphone className="h-6 w-6 text-green" />,
      title: "1. Conexão e Identificação",
      description: `Sua conta é associada ao seu número de WhatsApp de forma segura. O sistema sabe que a mensagem é sua, garantindo privacidade e precisão.`,
      color: "bg-green/20"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-green" />,
      title: "2. Análise de Linguagem Inteligente",
      description: `Nossa IA de ponta interpreta sua intenção (Receita, Despesa ou Investimento), o valor e a descrição, mesmo com frases informais.`,
      color: "bg-green/20"
    },
    {
      icon: <Camera className="h-6 w-6 text-green" />,
      title: "3. Reconhecimento de Imagem (Foto)", 
      description: `Ao enviar uma foto de cupom fiscal ou nota, a IA escaneia e extrai automaticamente o valor total, data e descrição.`,
      color: "bg-green/20"
    },
    {
      icon: <Workflow className="h-6 w-6 text-green" />,
      title: "4. Automação de Fluxo", 
      description: `O sistema de automação gerencia o fluxo de trabalho: aciona a IA/OCR e, por fim, envia o payload final ao backend, registrando a transação rapidamente.`,
      color: "bg-green/20"
    },
     {
      icon: <Clock className="h-6 w-6 text-green" />,
      title: "5. Respostas Imediatas",
      description: `Para comandos de consulta como "Saldo", o assistente busca os dados em tempo real no seu perfil e retorna a informação formatada em segundos, via WhatsApp.`,
      color: "bg-green/20"
    },
    {
      icon: <Search className="h-6 w-6 text-green" />,
      title: "6. Sugestão Inteligente de Categoria",
      description: `Baseado na descrição, a IA aplica a categoria mais provável (ex: "McDonald's" -> ALIMENTAÇÃO), mantendo seu controle organizado.`,
      color: "bg-green/20"
    },
  ];

  const exampleCommands = useMemo(() => ({
    "Transações (Texto)": [
      { 
        command: "Gastei 50 com almoço no centro", 
        type: "Despesa", 
        description: "Registra R$50 (Saída). A IA identifica o local e categoriza como ALIMENTAÇÃO. Você pode usar 'Gastei', 'Paguei', 'Saí'.",
        icon: <TrendingDown className="h-4 w-4" />
      },
      { 
        command: "Recebi 1200 de salário da empresa", 
        type: "Receita", 
        description: "Registra R$1200 (Entrada). A IA categoriza como SALÁRIO. Use 'Recebi', 'Entrou', 'Ganhei'.",
        icon: <TrendingUp className="h-4 w-4" />
      },
      { 
        command: "Investi 500 para a viagem de final de ano", 
        type: "Investimento", 
        description: "Registra R$500 na categoria Investimento. Excelente para acompanhar metas de poupança/investimento.",
        icon: <Zap className="h-4 w-4" />
      },
      { 
        command: "Conta de luz R$250", 
        type: "Despesa", 
        description: "Registro rápido. O sistema assume a categoria MORADIA ou CONTAS FIXAS e usa o valor exato.",
        icon: <CreditCard className="h-4 w-4" />
      },
      { 
        command: "Entrou R$300 de freelance", 
        type: "Receita", 
        description: "Registra R$300 na categoria FREELANCE. A descrição 'freelance' é automaticamente mapeada.",
        icon: <TrendingUp className="h-4 w-4" />
      },
      { 
        command: "Comprei passagem de ônibus R$15", 
        type: "Despesa", 
        description: "Registra R$15. O sistema categoriza como TRANSPORTE. Mantenha as descrições claras.",
        icon: <TrendingDown className="h-4 w-4" />
      },
    ],
    "Extração por Foto (Imagem)": [ 
      { 
        command: "ANEXAR FOTO", 
        type: "Extração (Foto)", 
        description: "Envie a imagem de qualquer cupom fiscal (NFC-e) ou nota. O sistema escaneia, extrai o valor total e o registra.",
        icon: <Camera className="h-4 w-4" />
      },
      { 
        command: "Foto do cupom", 
        type: "Extração (Foto)", 
        description: "Mensagem opcional. Basta anexar a imagem que a IA fará o resto. O valor extraído será inserido como DESPESA.",
        icon: <Receipt className="h-4 w-4" />
      },
      { 
        command: "Foto de recebimento (opcional)", 
        type: "Extração (Foto)", 
        description: "Se a foto for de um comprovante de recebimento, a IA pode tentar identificar como RECEITA.",
        icon: <Zap className="h-4 w-4" />
      },
      { 
        command: "Recomendação", 
        type: "Dica Rápida", 
        description: "Para melhor precisão, envie fotos claras e sem cortes no valor total ou na data. A IA agradece!",
        icon: <Lightbulb className="h-4 w-4" />
      },
    ],
    "Consultas e Ajuda": [
      { 
        command: "Saldo", 
        type: "Consulta", 
        description: "Exibe seu saldo atual consolidado e um resumo rápido das Receitas e Despesas do mês.",
        icon: <DollarSign className="h-4 w-4" />
      },
      { 
        command: "Gastos de Janeiro", 
        type: "Consulta", 
        description: "Mostra um resumo detalhado das despesas no mês específico. Tente também: 'Receitas de Março'.",
        icon: <Search className="h-4 w-4" />
      },
      { 
        command: "Ajuda", 
        type: "Informação", 
        description: "Exibe a lista completa de comandos e exemplos de uso diretamente no chat.",
        icon: <HelpCircle className="h-4 w-4" />
      },
      { 
        command: "Relatório Rápido", 
        type: "Consulta", 
        description: "Gera um resumo da sua saúde financeira atual e um insight da IA.",
        icon: <Lightbulb className="h-4 w-4" />
      },
       { 
        command: "Top 3 despesas", 
        type: "Consulta", 
        description: "Retorna as três maiores categorias de despesas do mês para que você possa identificar onde está gastando mais.",
        icon: <TrendingDown className="h-4 w-4" />
      },
    ],
  }), []);

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-01 relative overflow-hidden">
        {/* Este é o nosso fundo dinâmico e brilhante! */}
        <ParticleEffect /> 

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative z-10">
            
            {/* Header Principal da Página */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                className="text-center space-y-3 pt-8"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray dark:text-white flex flex-col md:flex-row items-center justify-center gap-3">
                    <Zap className="h-8 w-8 md:h-10 md:w-10 text-green" />
                    <span className="text-green">PoupaAI Zap</span>: Gestão por Conversa
                </h1>
                <p className="text-lg md:text-xl text-gray dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    A forma mais rápida de manter suas finanças em dia. Use a IA para registrar
                    transações enviando textos ou fotos de cupons fiscais.
                </p>
            </motion.div>

            <Separator className="bg-dark-gray/50 my-8" />

            {/* Colocamos a Seção de Conexão (Card) aqui, FORA do grid, para quebrar o layout e ser o destaque do topo */}
            <WhatsAppConnectSection />
            
            <Separator className="bg-dark-gray/50 my-8" />
            
            {/* Seção Principal de Fluxo e Detalhes (Grid 1:3 para telas maiores) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Coluna 1/3: Como Funciona */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animationVariants}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 space-y-8" // Ocupa a largura total para o fluxo de 6 passos
                >
                    <Card className="bg-white dark:bg-background-02 border-light-gray dark:border-dark-gray shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray dark:text-white">
                                <Workflow className="h-6 w-6 text-green" />
                                O Fluxo de Trabalho Integrado (IA + Automação)
                            </CardTitle>
                            <CardDescription className="text-gray dark:text-gray-400 mt-2">
                                Entenda como o PoupaAI Zap transforma sua mensagem em um registro financeiro em 6 passos, usando inteligência de ponta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {howItWorksSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                                        className={cn("flex items-start gap-4 p-4 rounded-lg border border-green/20 dark:border-green/10 transition-shadow hover:shadow-green-md bg-green/5 dark:bg-green/20")}
                                    >
                                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 min-w-10 rounded-full bg-green/10 dark:bg-green/20 text-green">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg text-gray dark:text-white">{step.title}</h4>
                                            <p className="text-sm text-gray dark:text-gray-300 mt-1 leading-relaxed">{step.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-6">
                             <p className="text-sm text-gray-500 italic flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green" />
                                Profissionalmente, sinto que este fluxo é robusto e demonstra a força da nossa Clean Architecture.
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            <Separator className="bg-dark-gray/50 my-8" />

            {/* Seção de Comandos */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ delay: 0.5 }}
            >
                <Card className="bg-white dark:bg-background-02 border-light-gray dark:border-dark-gray shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray dark:text-white">
                            <Code className="h-6 w-6 text-green" />
                            Comandos e Extração (Texto e Foto)
                        </CardTitle>
                        <CardDescription className="text-gray dark:text-gray-400 mt-2">
                            A Inteligência Artificial processa sua entrada. Você pode usar linguagem natural para registrar ou anexar uma imagem para extração de dados automática.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Abas de Comandos */}
                        <div className="flex flex-wrap gap-2 mb-6 border-b border-light-gray dark:border-dark-gray/50 pb-4">
                            {Object.keys(exampleCommands).map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeCommandTab === tab ? "default" : "outline"}
                                    className={cn(
                                        activeCommandTab === tab ? "bg-green hover:bg-green/90 text-white" : "border-light-gray dark:border-dark-gray text-gray dark:text-light-gray hover:bg-green/5 dark:hover:bg-dark-green/50",
                                        "transition-colors text-sm md:text-base font-semibold"
                                    )}
                                    onClick={() => setActiveCommandTab(tab)}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>

                        {/* Conteúdo das Abas (Detalhamento dos comandos) */}
                        <div className="space-y-6">
                            {exampleCommands[activeCommandTab as keyof typeof exampleCommands].map((cmd, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="p-4 bg-green/5 dark:bg-dark-green/30 rounded-lg border border-green/20 dark:border-green/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {cmd.icon}
                                            <span className="font-mono text-base font-semibold text-green dark:text-green-400 block md:inline-block">
                                                {cmd.command}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray dark:text-gray-300 w-full md:w-auto mt-2 md:mt-0 leading-relaxed">
                                            {cmd.description}
                                        </p>
                                    </div>
                                    <Badge 
                                        variant="secondary" 
                                        className={cn(
                                            "mt-2 md:mt-0 text-xs px-3 py-1 font-bold flex-shrink-0 min-w-[100px] justify-center",
                                            cmd.type.includes('Foto') ? "bg-red/20 text-red-400 border-red-400" : "bg-green/10 text-green-300 border-green-300"
                                        )}
                                    >
                                        {cmd.type}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6 border-t border-light-gray dark:border-dark-gray/50 mt-6">
                        <p className="text-sm text-gray-500 italic flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-gray" />
                            Minha dica é: use o WhatsApp para transações rápidas e pontuais, mas para despesas recorrentes, prefira a guia &apos;Fixas&apos; no app web!
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>

            <Separator className="bg-dark-gray/50 my-8" />
            
            {/* Nova Seção de Perguntas Frequentes (FAQ) */}
            <FAQSection />
            
            <Separator className="bg-dark-gray/50 my-8" />

            {/* Seção de Segurança e Privacidade */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ delay: 0.7 }}
            >
                <Card className="bg-white dark:bg-background-02 border-light-gray dark:border-dark-gray shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray dark:text-white">
                            <ShieldCheck className="h-6 w-6 text-green" />
                            Segurança na Conversa
                        </CardTitle>
                        <CardDescription className="text-gray dark:text-gray-400 mt-2">
                            Garantimos que seus dados permaneçam protegidos e confidenciais em todas as etapas da integração.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-gray dark:text-gray-300">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray dark:text-white">Conexão Criptografada:</span> Usamos as melhores práticas de segurança para a comunicação entre a plataforma de automação e o Backend. Me sinto seguro com isso.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray dark:text-white">Mapeamento Unitário:</span> Apenas seu número de telefone é mapeado ao seu perfil, eliminando o risco de transações em contas erradas.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray dark:text-white">Privacidade de Mídia:</span> As fotos de cupons fiscais são processadas só para extrair os dados financeiros e não são armazenadas após o registro. Isso é top!
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
            
            <footer className="pt-8 text-center text-gray-600 dark:text-gray-500">
                <p className="text-sm">© {new Date().getFullYear()} PoupaAI. Todos os direitos reservados. Gerenciamento de Finanças Pessoais com IA.</p>
                <p className="text-xs mt-1">Desenvolvido com Next.js, React e o poder da Inteligência Artificial.</p>
            </footer>
        </div>
    </div>
  );
}
