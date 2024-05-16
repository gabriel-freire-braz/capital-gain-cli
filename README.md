# Ganho de Capital (CLI Program)

Programa de linha de comando (CLI) que calcula o imposto a ser pago sobre lucros ou prejuízos de operações no mercado financeiro de ações.  

Este documento apresenta uma visão geral das principais decisões técnicas e arquiteturais adotadas durante o desenvolvimento da aplicação, bem como todas as informações consideradas relevantes para compreensão e execução do programa. 

Todos os casos de uso da proposta de requisitos estão no diretório `src/operations` em arquivos `json`, todos são adaptáveis para execução de comandos CLI diretamente via terminal e também são utilizados para os testes unitários. Porém deixamos a opção de inputar os dados de forma independente via terminal caso desejado.

## Tecnologias

NodeJS + Typescript + Vitest. 
 

## Get started

### Baixar dependências e compilar a aplicação

    yarn install && yarn build
  
### Executar o comando CLI 

Executar linha de comando `stdin` via arquivo

    cat src/operations/case1.json | yarn cli
   
Para executar mais de um arquivo, adicione um após o outro separados por espaços em branco:

    cat src/operations/case1.json src/operations/case2.json | yarn cli
  
Ou adicione o valor de stdin explicitamente via terminal (substituir `<stdinValue>` pelo dado de entrada):
  
    echo '<stdinValue>' | yarn cli
   

## Testar a solução

    yarn test

Você verá a execução dos testes unitários com Vitest:

![UnitTest](https://lh3.googleusercontent.com/fife/ALs6j_FcpWsALRNmU4QoDId5r5hlsjG3gkct5cyoVg58zrM_IztPDbpDc8YMugo17WlfdTob6z_UHhnGDFYmZ7bpiMjCjmNx1ZfpyJXAcffnu0Cr-lbJefzJ4yeSpUU3kLcUZbRdmUN3MgasOfiwYKhiAxpDHR1utqImF-1hJK6vUU4dw-l73ZX2u2XMS4nkD8TEujL-sahPAVGsEvyVa9VvnbuslXGNfsqIoc6f9RNITFXfCz0cpUJflKf0elYbD-NoDm1Qdz86stc_Kq1CN59IWGp_pS2O0dJBu8kvp9nhbnAXJe81qfk-NpPmwvOocQwWHHe6Z6Lb4DS03H3W80EItQsWfu0Jz1dSK_jwiLhjDmmhXwZ6dfjt7s-sIOImac45mA6cp8DqD54UBwThXmh5CGXq0-UNthLG9LFnXU6sAcVtrZOwJzmYtRrm3_Wj4BZT5Lzn9xDjgAgNUxEdedChyN2DxJnpJdHoLUibT7UGDxTURsosfXMN7fyolLTB_1lS3LJ1mZq_8L80Nt30CrJXn2oaHBOcK2RqAaaLg1J6kVdOJxV-LOAQGHdNDEeId6BZYcqJAquiJ5UwETpvHotLDX-mdpYelwOp_n6pwi4MbsFzw76iCWbLowY4URPILbfD-5zSFJ9V5J6-yRkZrxAN5fdr7EjN5mgMOkDdbKVrB54Gs-jAhZc5VER5O9G4WswSPx_BrLcntXSwpS0cQE63ABRLYTQgZCPsTZj5vUKNMMRVvqPgS8pVUhruMrMDv3aJjy0Q9RZxw738fKcuKocWD2Vp60dK9kckLPOn_0prc_ByRwUp2E_lkl_QvEfoeq-8T2z_xzPvpROzwPKqMdA-f9Iao3holKzT9V3clsR3aeZUF9euvrTRnO1IQiPoTKVW649KOEwJff7pda2zynQQQGQFYN4CDZv_mDDCl8odr2WWqRbBsWEVihBwzoT8Ip8QYS9jfqsuy9SPl6WI_m3EjAyKoI2xqeC73B1nvq8Xv7Fy0TF_xu_4aUHhVa8bae5pokFK4bLEaFQUBVl6mLN9s_lTzhudIaZ81OyU19-GkCom-LUf9FcbOeUwDdpRZUa80xRYTYaRzN-LCTM3pRB_BiHbem0rSLVC8QBurjfe0fLvy1E0qhR5MaPzaAmGXho7jhRg9Ylyo94O0QtndQjcYYEYVqOnGOM7gbVrbMqQriZZoll8DpByXs-v4FUOV0YVCIDdQCGQ5kMwryIL6lFW8Pl2GH02QojmzeOnA67MyBA-Vz3qvtexuyy5ywe4PoWPOCBJ5YctQgipZ7MYwn5XSfRE20p-INs3seMmGAonY3pZNMDjPgdlQieZIrmzd_5jzJPZGPGa-2Vdm1sepUBsWXUnVIY51vCiHEyQHdGa3wx9LPvdeBUuiVJccgHTFptPzmmdZm7pbC9mXPjzYSdahWAb41J3oNDRu-30Xoq-u3j1FjQw_G4zjzJuS_f7FZtxQ8TB6uuMAvucFUMoT2rPHU-CUNOENztHQH6RkUmo_muMVQzhIcqmQMnFk0cVhcWyrj9Eb1CQNEoLI6jPArKnIW3IWn1bN_-mprmKLeW5KcyMiNwz430rSx8ZgM50RGlI-fCsqSGAULiQ82nlZrRa_Tk7ET_QBFsQcjyCFUnpz6c6VD4nSaIxTQUFQQm7cU2QeMzCLdqb8lVea3vLEIchuVgz=w1920-h934)
   


## Decisões de arquitetura e boas práticas

- **Arquitetura de Services**: Decidimos adotar uma arquitetura de services na nossa aplicação CLI para separar a lógica de negócios da interação do usuário. Isso não apenas facilita a manutenção e escalabilidade do código, mas também permite uma maior flexibilidade na hora de testar e modificar componentes individuais. Cada serviço é responsável por uma parte específica da lógica de negócios e opera de forma independente, o que contribui para um sistema mais desacoplado e coeso.

- **Transparência Referencial**: A transparência referencial é um conceito que implementamos para garantir que nossas funções se comportem de maneira previsível. Cada função é projetada para produzir o mesmo resultado dado o mesmo conjunto de entradas, independentemente de fatores externos, garantindo a confiabilidade e a testabilidade do nosso código.

- **Independência de Execução**: Nossa aplicação executa de forma independente, sem necessidade de dependências externas desnecessárias. Isso simplifica a implantação e o uso da aplicação, além de contribuir para um ambiente de execução mais controlado e previsível.

- **Princípios SOLID: Single Responsibility Principle (SRP)**: Adotamos o primeiro princípio do SOLID, o Princípio da Responsabilidade Única, para garantir que cada módulo ou classe na nossa aplicação tenha apenas uma razão para mudar. Isso significa que cada classe ou módulo é responsável por apenas uma parte da funcionalidade, o que simplifica a manutenção e melhora a legibilidade do código.

- **Gerenciamento de Memória**: Optamos por gerenciar o estado da aplicação em memória através de variáveis de escopo bem definidas. Isso nos permite ter um controle mais direto sobre o uso da memória, evitando overhead de gerenciamento de estado externo e aumentando a performance da aplicação.

- **Testes unitários**: Testamos cada componente de forma isolada (testes unitários) para garantir que todos os aspectos da aplicação funcionem como esperado. Escolhemos o Vitest pois é um framework moderno, eficiente e rápido.

- **Simplicidade e Elegância**: Durante o desenvolvimento, priorizamos a simplicidade e a elegância. Evitamos instalar ou configurar mais do que é estritamente necessário para resolver o problema em questão. Isso não apenas torna nossa aplicação mais leve e fácil de entender, mas também minimiza o risco de erros e problemas de compatibilidade.

- **Resolução de Problemas**: A finalidade última da nossa aplicação é resolver o problema proposto de maneira eficiente e eficaz. Cada decisão técnica e arquitetural foi tomada com esse objetivo em mente, garantindo que a solução final seja não apenas tecnicamente viável, mas também prática e útil para os usuários finais.
  

## Bibliotecas e frameworks

### Commander

A biblioteca Commander é uma das ferramentas mais populares para a criação de interfaces de linha de comando (CLI) em Node.js, ela simplifica o processo de interpretação de argumentos de linha de comando, facilitando a criação de aplicativos CLI robustos e fáceis de usar.

Utilizar a biblioteca Commander em vez de depender apenas das funcionalidades stdin nativas para desenvolver uma aplicação CLI traz várias vantagens significativas que podem otimizar o desenvolvimento, melhorar a funcionalidade e aumentar a manutenibilidade do código. Vamos explorar esses benefícios:

1. Simplificação de Análise de Argumentos (Abstração de Complexidade): Automatiza e simplifica a análise de argumentos de linha de comando. Ele lida com a separação e a interpretação dos argumentos, permitindo que você se concentre na lógica do aplicativo ao invés de se preocupar com os detalhes de parsing.
2. Gestão de Opções e Comandos: A biblioteca permite definir facilmente comandos e opções associadas. Cada comando pode ter seu próprio conjunto de opções e ação associada, o que torna seu CLI modular e fácil de expandir.
3. Automatização de Ajuda: Gera automaticamente saídas de ajuda detalhadas e atualizadas com base nas definições dos comandos, melhorando a usabilidade.
4. Extensibilidade: Facilita a adição e modificação de comandos devido à sua estrutura modular, permitindo que o CLI cresça de forma organizada.
5. Manutenção e Clareza: Produz código mais legível e fácil de manter, ajudando no onboarding de novos desenvolvedores e na manutenção de longo prazo.
6. Facilidade de Testes: Simplifica a simulação de entradas de comandos em testes, permitindo focar na lógica de negócio em vez da infraestrutura de entrada.
    
### Vitest
  
Escolhemos o Vitest como nossa ferramenta de teste para nossa aplicação CLI em TypeScript devido a várias características importantes que alinham com as necessidades do nosso projeto. Primeiramente, o Vitest é extremamente rápido, graças à sua integração com o esbuild, o que acelera significativamente a compilação de TypeScript e a execução dos testes. Isso é crucial para manter a agilidade e eficiência do nosso ciclo de desenvolvimento, permitindo que a equipe obtenha feedback instantâneo sobre as mudanças feitas no código.
   

## Implementação técnica futura

Abaixo estão algumas ideias de melhoria com possibilidade de implementação futura para tornar o projeto ainda mais poderoso e adaptável a diferentes cenários de uso (mas não se limitando a elas).

- **Build conteinerizado:** Implementar a conteinerização através do Docker para facilitar o deployment, a distribuição e a execução em ambientes distintos, garantindo consistência entre desenvolvimento, testes e produção.

- **Expandir Services**: Atualmente, nossa lógica de aplicação está concentrada em um único arquivo, o que pode limitar a manutenção e a escalabilidade. Planejamos modularizar essa lógica em classes separadas dentro de uma arquitetura de serviços. Isso não só melhora a organização do código, mas também facilita a expansão e a manutenção futura.

- **Ampliar Bateria de Testes**: Aumentar a cobertura de testes é crucial para garantir a estabilidade e a confiabilidade da aplicação à medida que ela cresce. Importande implementar mais testes unitários e de integração para cobrir todos os aspectos e casos de uso da aplicação.

- **Lidar com Logs ou Erros**: Melhorar o sistema de logging e tratamento de erros é fundamental para diagnósticos rápidos e eficazes em produção. Isso inclui a implementação de um sistema mais robusto para captura, armazenamento e análise de logs e erros, facilitando a resolução de problemas e a monitoração do sistema.

- **Estratégia de Caching**: Se a demanda por nossa aplicação aumentar, o caching se tornará essencial para a escalabilidade. Planejamos investigar e implementar soluções de caching, como Node Cache ou Redis, para persistência rápida de informações, reduzindo a carga sobre nossos servidores e acelerando a recuperação de dados frequentemente acessados.

- **Uso de Stream**: Para lidar com grandes volumes de dados e arquivos de nossa aplicação CLI, o uso de streams pode ser extremamente benéfico. Consideramos adotar bibliotecas de streaming para processar dados de maneira eficiente, sem consumir muita memória, melhorando o desempenho e  capacidade de resposta da aplicação.

- **Segurança**: Tratar adequadamente questões de segurança é crucial, especialmente ao lidar com informações financeiras sensíveis. Isso inclui a implementação de medidas como criptografia de dados, autenticação segura e proteção contra ataques comuns, como injeção de SQL ou XSS, mesmo em uma CLI.

- **Devops**: À medida que avançamos com o desenvolvimento da nossa aplicação CLI em Node.js, a implementação de deploy em nuvem na AWS e a integração de processos de Integração Contínua e Entrega Contínua (CI/CD) representam passos cruciais para a evolução do projeto. 